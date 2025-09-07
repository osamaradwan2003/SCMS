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
  CreateIncomeTypeFormSchema,
  UpdateIncomeTypeFormSchema,
} from "@/forms/IncomeTypes.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

interface IncomeType {
  id: string;
  name: string;
  description?: string;
  _count?: {
    transaction: number;
  };
  created_at: string;
  updated_at: string;
}

const IncomeTypesPage: React.FC = () => {
  const t = useTranslate("incometypes");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedIncomeType, setSelectedIncomeType] = useState<IncomeType | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch income types
  const { data: incomeTypesData, isLoading } = useQuery({
    queryKey: ["incometypes", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchText && { q: searchText }),
      };
      
      if (searchText) {
        return httpClient.get(`/incometypes/search?${new URLSearchParams(params as any)}`);
      }
      
      return httpClient.get(`/incometypes/paginate?${new URLSearchParams(params as any)}`);
    },
  });

  // Create income type mutation
  const createIncomeTypeMutation = useMutation({
    mutationFn: (data: any) => httpClient.post("/incometypes", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["incometypes"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update income type mutation
  const updateIncomeTypeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      httpClient.put(`/incometypes/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedIncomeType(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["incometypes"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete income type mutation
  const deleteIncomeTypeMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/incometypes/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["incometypes"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createIncomeTypeMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedIncomeType) {
      updateIncomeTypeMutation.mutate({ id: selectedIncomeType.id, data: values });
    }
  };

  const handleDelete = (incomeType: IncomeType) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteIncomeTypeMutation.mutate(incomeType.id),
    });
  };

  const handleEdit = (incomeType: IncomeType) => {
    setSelectedIncomeType(incomeType);
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
      render: (count: IncomeType["_count"]) => (
        <Tag color="blue">
          {count?.transaction || 0}
        </Tag>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: undefined, record: IncomeType) => (
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

  const createFormSchema = CreateIncomeTypeFormSchema();
  const updateFormSchema = UpdateIncomeTypeFormSchema();

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
            placeholder="Search income types..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={incomeTypesData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: incomeTypesData?.total || 0,
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
        confirmLoading={createIncomeTypeMutation.isPending}
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
          setSelectedIncomeType(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updateIncomeTypeMutation.isPending}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedIncomeType || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default IncomeTypesPage;
