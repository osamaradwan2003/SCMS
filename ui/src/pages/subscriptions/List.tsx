import React, { useState } from "react";
import {
  Button,
  Table,
  Space,
  message,
  Input,
  Card,
  Popconfirm,
  Divider,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi, type Subscription } from "@/api/subscriptions";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const SubscriptionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("subscriptions");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch subscriptions
  const { data: subscriptionsData, isLoading } = useQuery({
    queryKey: ["subscriptions", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchText && { q: searchText }),
      };

      const endpoint = searchText ? subscriptionsApi.search : subscriptionsApi.getAll;
      const response = await endpoint(params);
      return response.data;
    },
  });

  // Delete subscription mutation
  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.delete_error"));
    },
  });

  const handleDelete = (id: string) => {
    deleteSubscriptionMutation.mutate(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchText("");
    setCurrentPage(1);
  };

  const columns: ColumnsType<Subscription> = [
    {
      title: t("fields.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (name: string) => (
        <span className="font-medium">{name}</span>
      ),
    },
    {
      title: t("fields.value"),
      dataIndex: "value",
      key: "value",
      render: (value: number) => (
        <span className="font-medium text-green-600">
          ${typeof value === 'number' ? value.toFixed(2) : parseFloat(value).toFixed(2)}
        </span>
      ),
      sorter: true,
    },
    {
      title: t("fields.notes"),
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => (
        <div style={{ maxWidth: 200 }}>
          {notes ? (notes.length > 50 ? `${notes.substring(0, 50)}...` : notes) : "-"}
        </div>
      ),
    },
    {
      title: t("table.students_count"),
      key: "students_count",
      render: (record: Subscription) => (
        <span className="text-blue-600">
          {record.students?.length || 0} {t("table.students")}
        </span>
      ),
    },
    {
      title: t("fields.created_at"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
      sorter: true,
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (record: Subscription) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/subscriptions/${record.id}`)}
          >
            {t("buttons.view")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/subscriptions/${record.id}/edit`)}
          >
            {t("buttons.edit")}
          </Button>
          <Popconfirm
            title={t("messages.delete_confirm")}
            description={t("messages.delete_description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("buttons.yes")}
            cancelText={t("buttons.no")}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deleteSubscriptionMutation.isPending}
            >
              {t("buttons.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">{t("list")}</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/subscriptions/create")}
          >
            {t("create")}
          </Button>
        </div>
        
        <Divider />
        
        {/* Search and Filters */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder={t("placeholder.search")}
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => !e.target.value && handleSearch("")}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button
              size="large"
              onClick={clearFilters}
              style={{ width: "100%" }}
            >
              {t("buttons.reset")}
            </Button>
          </Col>
        </Row>
        
        <Divider />
        
        <Table
          columns={columns}
          dataSource={subscriptionsData?.data || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1000 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: subscriptionsData?.total || 0,
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

export default SubscriptionsListPage;
