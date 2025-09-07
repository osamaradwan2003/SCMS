import React, { useState, useEffect } from "react";
import { Button, Table, Space, Modal, message, Input, Card, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import { FormModal } from "@/components";
import { CreateCategoryFormSchema, UpdateCategoryFormSchema } from "@/forms/Categories.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

interface Category {
  id: string;
  name: string;
  description?: string;
  type: string;
  calculationMethod: string;
  created_at: string;
  updated_at: string;
}

const CategoriesPage: React.FC = () => {
  const t = useTranslate("categories");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });
      
      if (searchText) {
        params.append("q", searchText);
        return httpClient.get(`/categories/search?${params}`);
      }
      
      return httpClient.get(`/categories/paginate?${params}`);
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => httpClient.post("/categories", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      httpClient.put(`/categories/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedCategory(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/categories/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createCategoryMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, data: values });
    }
  };

  const handleDelete = (category: Category) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteCategoryMutation.mutate(category.id),
    });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
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
      render: (text: string) => text || "-",
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
      title: t("table.calculation_method"),
      dataIndex: "calculationMethod",
      key: "calculationMethod",
      render: (method: string) => (
        <Tag color="blue">{t(`calculation_options.${method}`)}</Tag>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_, record: Category) => (
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

  const createFormSchema = CreateCategoryFormSchema();
  const updateFormSchema = UpdateCategoryFormSchema();

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
            placeholder="Search categories..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={categoriesData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: categoriesData?.total || 0,
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
        loading={createCategoryMutation.isPending}
      />

      {/* Update Modal */}
      <FormModal
        title={t("edit_title")}
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleUpdate}
        formSchema={updateFormSchema}
        initialValues={selectedCategory}
        loading={updateCategoryMutation.isPending}
      />
    </div>
  );
};

export default CategoriesPage;
