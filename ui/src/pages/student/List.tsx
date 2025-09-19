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
  Avatar,
  Tag,
  Select,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi, type Student } from "@/api/students";
import { classesApi } from "@/api/classes";
import { guardiansApi, type Guardian } from "@/api/guardians";
import { subscriptionsApi, type Subscription } from "@/api/subscriptions";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const StudentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("students");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | undefined>();
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | undefined>();

  const queryClient = useQueryClient();

  // Fetch students
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["students", currentPage, pageSize, searchText, selectedClassId, selectedGuardianId, selectedSubscriptionId],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchText && { q: searchText }),
        ...(selectedClassId && { classId: selectedClassId }),
        ...(selectedGuardianId && { guardianId: selectedGuardianId }),
        ...(selectedSubscriptionId && { subscriptionsId: selectedSubscriptionId }),
      };

      const endpoint = searchText ? studentsApi.search : studentsApi.getAll;
      const response = await endpoint(params);
      return response.data;
    },
  });

  // Fetch filter options
  const { data: classesData = [] } = useQuery({
    queryKey: ["classes", "list"],
    queryFn: async () => {
      const res = await classesApi.getList();
      return res.data.data || [];
    },
  });

  const { data: guardiansData = [] } = useQuery({
    queryKey: ["guardians", "paginated"],
    queryFn: async () => {
      const res = await guardiansApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });

  const { data: subscriptionsData = [] } = useQuery({
    queryKey: ["subscriptions", "list"],
    queryFn: async () => {
      const res = await subscriptionsApi.getList();
      return res.data.data || [];
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.delete_error"));
    },
  });

  const handleDelete = (id: string) => {
    deleteStudentMutation.mutate(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedClassId(undefined);
    setSelectedGuardianId(undefined);
    setSelectedSubscriptionId(undefined);
    setSearchText("");
    setCurrentPage(1);
  };

  const columns: ColumnsType<Student> = [
    {
      title: t("fields.image"),
      dataIndex: "image",
      key: "image",
      render: (image: string, record: Student) => (
        <Avatar
          src={image ? `${import.meta.env.VITE_API_STATIC_URL}${image}` : undefined}
          icon={!image ? <UserOutlined /> : undefined}
          alt={record.name}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
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
      title: t("fields.dob"),
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
      sorter: true,
    },
    {
      title: t("fields.gender"),
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        if (!gender) return "-";
        const color = gender === "male" ? "blue" : "pink";
        return <Tag color={color}>{t(`gender_options.${gender}`)}</Tag>;
      },
    },
    {
      title: t("fields.classId"),
      key: "class",
      render: (record: Student) => (
        record.class ? (
          <Tag color="green">{record.class.name}</Tag>
        ) : (
          <Tag color="default">{t("no_class")}</Tag>
        )
      ),
    },
    {
      title: t("fields.guardianId"),
      key: "guardian",
      render: (record: Student) => (
        record.Guardian ? (
          <div>
            <div className="font-medium">{record.Guardian.name}</div>
            <div className="text-sm text-gray-500">{record.guradianDegree}</div>
          </div>
        ) : (
          <Tag color="default">{t("no_guardian")}</Tag>
        )
      ),
    },
    {
      title: t("fields.subscriptionsId"),
      key: "subscription",
      render: (record: Student) => (
        record.Subscriptions ? (
          <div>
            <div className="font-medium">{record.Subscriptions.name}</div>
            <div className="text-sm text-gray-500">${record.Subscriptions.value}</div>
          </div>
        ) : (
          <Tag color="default">{t("no_subscription")}</Tag>
        )
      ),
    },
    {
      title: t("fields.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "-",
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
      render: (record: Student) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/students/${record.id}`)}
          >
            {t("buttons.view")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/students/${record.id}/edit`)}
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
              loading={deleteStudentMutation.isPending}
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
            onClick={() => navigate("/students/create")}
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
            <Select
              placeholder={t("filters.by_class")}
              allowClear
              size="large"
              style={{ width: "100%" }}
              value={selectedClassId}
              onChange={(value) => {
                setSelectedClassId(value);
                handleFilterChange();
              }}
              options={classesData.map((cls: { id: string; name: string; code: string }) => ({
                label: cls.name,
                value: cls.id,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder={t("filters.by_guardian")}
              allowClear
              size="large"
              style={{ width: "100%" }}
              value={selectedGuardianId}
              onChange={(value) => {
                setSelectedGuardianId(value);
                handleFilterChange();
              }}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={guardiansData.map((guardian: Guardian) => ({
                label: guardian.name,
                value: guardian.id,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder={t("filters.by_subscription")}
              allowClear
              size="large"
              style={{ width: "100%" }}
              value={selectedSubscriptionId}
              onChange={(value) => {
                setSelectedSubscriptionId(value);
                handleFilterChange();
              }}
              options={subscriptionsData.map((sub: Subscription) => ({
                label: sub.name,
                value: sub.id,
              }))}
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
          dataSource={studentsData?.data || []}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: studentsData?.total || 0,
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

export default StudentsListPage;
