import React, { useState } from "react";
import {
  Button,
  Table,
  Space,
  message,
  Input,
  Card,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "@/api/departments";
import type { Department } from "@/api/departments";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { ApiError } from "@/types/api";

const DepartmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("departments");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departmentsData, isLoading } = useQuery({
    queryKey: ["departments", currentPage, pageSize, searchText],
    queryFn: async () => {
      if (searchText) {
        const res = await departmentsApi.search({
          page: currentPage,
          limit: pageSize,
          q: searchText,
        });
        return res.data;
      } else {
        const res = await departmentsApi.getAll({
          page: currentPage,
          limit: pageSize,
        });
        return res.data;
      }
    },
  });

  // Delete department mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => departmentsApi.delete(id),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || t("messages.delete_error");
      message.error(errorMessage);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => departmentsApi.bulkDelete(ids),
    onSuccess: () => {
      message.success(t("messages.bulk_delete_success"));
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || t("messages.bulk_delete_error");
      message.error(errorMessage);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning(t("messages.select_items"));
      return;
    }
    bulkDeleteMutation.mutate(selectedRowKeys as string[]);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const columns: ColumnsType<Department> = [
    {
      title: t("table.name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Department) => (
        <Space>
          <strong>{text}</strong>
          {record.manager && (
            <Tooltip title={`${t("table.manager")}: ${record.manager.name}`}>
              <UserOutlined style={{ color: "#1890ff" }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: t("table.manager"),
      dataIndex: ["manager", "name"],
      key: "manager",
      render: (text: string, record: Department) => {
        if (record.manager) {
          return (
            <Space>
              <Tag color="blue">{text}</Tag>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {record.manager.position}
              </span>
            </Space>
          );
        }
        return <Tag color="default">{t("table.no_manager")}</Tag>;
      },
    },
    {
      title: t("table.employees_count"),
      dataIndex: ["_count", "employees"],
      key: "employeesCount",
      render: (count: number) => (
        <Space>
          <TeamOutlined />
          <span>{count || 0}</span>
        </Space>
      ),
    },
    {
      title: t("table.created_at"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_, record: Department) => (
        <Space size="middle">
          <Tooltip title={t("actions.view")}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/departments/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={t("actions.edit")}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/departments/${record.id}/edit`)}
            />
          </Tooltip>
          <Tooltip title={t("actions.delete")}>
            <Popconfirm
              title={t("messages.delete_confirm")}
              description={t("messages.delete_description")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("actions.yes")}
              cancelText={t("actions.no")}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deleteMutation.isPending}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/departments/create")}
          >
            {t("actions.create")}
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Input.Search
            placeholder={t("placeholder.search")}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          
          {selectedRowKeys.length > 0 && (
            <Space>
              <span>{t("messages.selected_count", { count: selectedRowKeys.length })}</span>
              <Popconfirm
                title={t("messages.bulk_delete_confirm")}
                description={t("messages.bulk_delete_description")}
                onConfirm={handleBulkDelete}
                okText={t("actions.yes")}
                cancelText={t("actions.no")}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  loading={bulkDeleteMutation.isPending}
                >
                  {t("actions.delete_selected")}
                </Button>
              </Popconfirm>
            </Space>
          )}
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={departmentsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: departmentsData?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              t("table.pagination_info", {
                start: range[0],
                end: range[1],
                total,
              }),
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default DepartmentsListPage;
