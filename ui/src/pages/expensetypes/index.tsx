import React, { useState } from "react";
import {
  Button,
  Table,
  Space,
  Modal,
  message,
  Input,
  Card,
  Tag,
  Form,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import CreateForm from "@/components/Form/CreateForm";
import {
  CreateExpenseTypeFormSchema,
  UpdateExpenseTypeFormSchema,
} from "@/forms/ExpenseTypes.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

interface ExpenseType {
  id: string;
  name: string;
  description?: string;
  _count?: {
    transaction: number;
  };
  created_at: string;
  updated_at: string;
}

const ExpenseTypesPage: React.FC = () => {
  const t = useTranslate("expensetypes");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<ExpenseType | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch expense types
  const { data: expenseTypesData, isLoading } = useQuery({
    queryKey: ["expensetypes", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchText && { q: searchText }),
      };
      
      if (searchText) {
        return httpClient.get(`/expensetypes/search?${new URLSearchParams(params as any)}`);
      }
      
      return httpClient.get(`/expensetypes/paginate?${new URLSearchParams(params as any)}`);
    },
  });

  // Create expense type mutation
  const createExpenseTypeMutation = useMutation({
    mutationFn: (data: any) => httpClient.post("/expensetypes", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["expensetypes"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update expense type mutation
  const updateExpenseTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      httpClient.put(`/expensetypes/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedExpenseType(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["expensetypes"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete expense type mutation
  const deleteExpenseTypeMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/expensetypes/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["expensetypes"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createExpenseTypeMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedExpenseType) {
      updateExpenseTypeMutation.mutate({ id: selectedExpenseType.id, data: values });
    }
  };

  const handleDelete = (expenseType: ExpenseType) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteExpenseTypeMutation.mutate(expenseType.id),
    });
  };

  const handleEdit = (expenseType: ExpenseType) => {
    setSelectedExpenseType(expenseType);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    {
      title: t("table.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      key: "description",
      render: (description: string) => description || "-",
    },
    {
      title: t("table.transactions"),
      dataIndex: "_count",
      key: "transactions",
      render: (count: ExpenseType["_count"]) => (
        <Tag color="red">
          {count?.transaction || 0}
        </Tag>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: undefined, record: ExpenseType) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const createFormSchema = CreateExpenseTypeFormSchema();
  const updateFormSchema = UpdateExpenseTypeFormSchema();

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t("create_title")}
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search expense types..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={expenseTypesData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: expenseTypesData?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title={t("create_title")}
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={() => {
          createForm.submit();
        }}
        confirmLoading={createExpenseTypeMutation.isPending}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <CreateForm formSchema={createFormSchema.slice(0, -1)} />
        </Form>
      </Modal>

      {/* Update Modal */}
      <Modal
        title={t("edit_title")}
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedExpenseType(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updateExpenseTypeMutation.isPending}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedExpenseType || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default ExpenseTypesPage;
