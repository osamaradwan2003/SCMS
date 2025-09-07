import React, { useState } from "react";
import { Button, Table, Space, Modal, message, Input, Card, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import type { QueryParams, ApiResponse } from "@/types/api";
import { FormModal } from "@/components";
import { CreateBankFormSchema, UpdateBankFormSchema } from "@/forms/Banks.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

const BanksPage: React.FC = () => {
  const t = useTranslate("banks");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const queryClient = useQueryClient();

  // Fetch banks
  const { data: banksData, isLoading } = useQuery({
    queryKey: ["banks", currentPage, pageSize, searchText],
    queryFn: async (): Promise<ApiResponse<any>> => {
      const params: QueryParams = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) params.q = searchText;
      
      const response = searchText 
        ? await httpClient.get(`/banks/search?${new URLSearchParams(params as Record<string, string>)}`)
        : await httpClient.get(`/banks/paginate?${new URLSearchParams(params as Record<string, string>)}`);
      
      return response.data;
    },
  });

  // Create bank mutation
  const createBankMutation = useMutation({
    mutationFn: (data: any) => httpClient.post("/banks", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update bank mutation
  const updateBankMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      httpClient.put(`/banks/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedBank(null);
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete bank mutation
  const deleteBankMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/banks/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createBankMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedBank) {
      updateBankMutation.mutate({ id: selectedBank.id, data: values });
    }
  };

  const handleDelete = (bank: Bank) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteBankMutation.mutate(bank.id),
    });
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    {
      title: t("table.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("table.account_number"),
      dataIndex: "accountNumber",
      key: "accountNumber",
      render: (accountNumber: string) => <Tag color="blue">{accountNumber}</Tag>,
    },
    {
      title: t("table.balance"),
      dataIndex: "balance",
      key: "balance",
      render: (balance: number) => (
        <Tag color={balance >= 0 ? "green" : "red"}>
          ${balance.toLocaleString()}
        </Tag>
      ),
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_, record: Bank) => (
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

  const createFormSchema = CreateBankFormSchema();
  const updateFormSchema = UpdateBankFormSchema();

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
            placeholder="Search banks..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={banksData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: banksData?.total || 0,
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
        loading={createBankMutation.isPending}
      />

      {/* Update Modal */}
      <FormModal
        title={t("edit_title")}
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedBank(null);
        }}
        onSubmit={handleUpdate}
        formSchema={updateFormSchema}
        initialValues={selectedBank}
        loading={updateBankMutation.isPending}
      />
    </div>
  );
};

export default BanksPage;
