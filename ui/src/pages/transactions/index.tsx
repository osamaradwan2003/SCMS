import React, { useState, useEffect } from "react";
import { Button, Table, Space, Modal, message, Input, Card, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import { FormModal } from "@/components";
import {
  CreateTransactionFormSchema,
  UpdateTransactionFormSchema,
} from "@/forms/Transaction.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  bankId: string;
  categoryId: string;
  incomeTypeId?: string;
  expenseTypeId?: string;
  bank?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  incomeType?: {
    id: string;
    name: string;
  };
  expenseType?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const TransactionPage: React.FC = () => {
  const t = useTranslate("Transaction");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch Transaction
  const { data: TransactionData, isLoading } = useQuery({
    queryKey: ["Transaction", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (searchText) {
        params.append("q", searchText);
        return httpClient.get(`/Transaction/search?${params}`);
      }

      return httpClient.get(`/Transaction/paginate?${params}`);
    },
  });

  // Fetch banks for selection
  const { data: banksData } = useQuery({
    queryKey: ["banks"],
    queryFn: () => httpClient.get("/banks"),
  });

  // Fetch categories for selection
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => httpClient.get("/categories"),
  });

  // Fetch income types for selection
  const { data: incomeTypesData } = useQuery({
    queryKey: ["incometypes"],
    queryFn: () => httpClient.get("/incometypes"),
  });

  // Fetch expense types for selection
  const { data: expenseTypesData } = useQuery({
    queryKey: ["expensetypes"],
    queryFn: () => httpClient.get("/expensetypes"),
  });

  // Create Transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: (data: any) => httpClient.post("/Transaction", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["Transaction"] });
      queryClient.invalidateQueries({ queryKey: ["banks"] }); // Refresh bank balances
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update Transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      httpClient.put(`/Transaction/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedTransaction(null);
      queryClient.invalidateQueries({ queryKey: ["Transaction"] });
      queryClient.invalidateQueries({ queryKey: ["banks"] }); // Refresh bank balances
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete Transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/Transaction/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["Transaction"] });
      queryClient.invalidateQueries({ queryKey: ["banks"] }); // Refresh bank balances
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createTransactionMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedTransaction) {
      updateTransactionMutation.mutate({
        id: selectedTransaction.id,
        data: values,
      });
    }
  };

  const handleDelete = (Transaction: Transaction) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteTransactionMutation.mutate(Transaction.id),
    });
  };

  const handleEdit = (Transaction: Transaction) => {
    setSelectedTransaction(Transaction);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    {
      title: t("table.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: Transaction) => (
        <Tag color={record.type === "income" ? "green" : "red"}>
          {record.type === "income" ? "+" : "-"}${amount.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("table.date"),
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: t("table.type"),
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {t(`type_options.${type}`)}
        </Tag>
      ),
    },
    {
      title: t("table.bank"),
      dataIndex: "bank",
      key: "bank",
      render: (bank: any) => bank?.name || "-",
    },
    {
      title: t("table.category"),
      dataIndex: "category",
      key: "category",
      render: (category: any) => category?.name || "-",
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_, record: Transaction) => (
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

  // Prepare options for form
  const bankOptions =
    banksData?.data?.map((bank: any) => ({
      label: `${bank.name} (${bank.accountNumber})`,
      value: bank.id,
    })) || [];

  const categoryOptions =
    categoriesData?.data?.map((category: any) => ({
      label: category.name,
      value: category.id,
    })) || [];

  const incomeTypeOptions =
    incomeTypesData?.data?.map((type: any) => ({
      label: type.name,
      value: type.id,
    })) || [];

  const expenseTypeOptions =
    expenseTypesData?.data?.map((type: any) => ({
      label: type.name,
      value: type.id,
    })) || [];

  // Update form schemas with options
  const createFormSchema = CreateTransactionFormSchema();
  const updateFormSchema = UpdateTransactionFormSchema();

  // Update options in form schemas
  createFormSchema.find(
    (field) => field.name === "bankId"
  )!.autoCompleteProps!.options = bankOptions;
  createFormSchema.find(
    (field) => field.name === "categoryId"
  )!.autoCompleteProps!.options = categoryOptions;
  createFormSchema.find(
    (field) => field.name === "incomeTypeId"
  )!.autoCompleteProps!.options = incomeTypeOptions;
  createFormSchema.find(
    (field) => field.name === "expenseTypeId"
  )!.autoCompleteProps!.options = expenseTypeOptions;

  updateFormSchema.find(
    (field) => field.name === "bankId"
  )!.autoCompleteProps!.options = bankOptions;
  updateFormSchema.find(
    (field) => field.name === "categoryId"
  )!.autoCompleteProps!.options = categoryOptions;
  updateFormSchema.find(
    (field) => field.name === "incomeTypeId"
  )!.autoCompleteProps!.options = incomeTypeOptions;
  updateFormSchema.find(
    (field) => field.name === "expenseTypeId"
  )!.autoCompleteProps!.options = expenseTypeOptions;

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
            placeholder="Search Transaction..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={TransactionData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: TransactionData?.total || 0,
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
      <FormModal
        title={t("create_title")}
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        formSchema={createFormSchema}
        loading={createTransactionMutation.isPending}
      />

      {/* Update Modal */}
      <FormModal
        title={t("edit_title")}
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSubmit={handleUpdate}
        formSchema={updateFormSchema}
        initialValues={selectedTransaction}
        loading={updateTransactionMutation.isPending}
      />
    </div>
  );
};

export default TransactionPage;
