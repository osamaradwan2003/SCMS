import React, { useState } from "react";
import {
  Button,
  Space,
  message,
  Input,
  Card,
  Popconfirm,
  Divider,
  Tag,
  Avatar,
  Grid,
  Typography,
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
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  employeesApi,
  type Employee,
  type PaginatedResponse,
} from "@/api/employees";
import ResponsiveContainer from "@/components/utils/ResponsiveContainer";
import ResponsiveTable from "@/components/utils/ResponsiveTable";

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const EmployeesListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("employees");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const screens = useBreakpoint();

  const queryClient = useQueryClient();

  // Fetch employees
  const { data, isLoading } = useQuery({
    queryKey: ["employees", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
        ...(searchText ? { q: searchText } : {}),
      } as const;

      if (searchText) {
        const res = await employeesApi.search(params);
        return res.data as PaginatedResponse<Employee>;
      }
      const res = await employeesApi.getAll(params);
      return res.data as PaginatedResponse<Employee>;
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      const apiMessage = e?.response?.data?.message || e?.message;
      message.error(apiMessage || t("messages.delete_error"));
    },
  });

  const handleDelete = (id: string) => {
    deleteEmployeeMutation.mutate(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // no inline detail fetch; view handled on a separate page

  const statusColor = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "default";
      case "terminated":
        return "red";
      case "on_leave":
        return "gold";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: t("fields.profile_image"),
      dataIndex: "profile_image",
      key: "profile_image",
      render: (url?: string) => (
        <Avatar
          src={url ? `${import.meta.env.VITE_API_STATIC_URL}${url}` : undefined}
          alt="Profile"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        >
          {t("fields.name").slice(0, 1)}
        </Avatar>
      ),
    },
    {
      title: t("ID"),
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: t("fields.name"),
      key: "name",
      render: (record: Employee) => `${record.name}`,
    },
    {
      title: t("fields.department"),
      dataIndex: "department",
      key: "department",
    },
    {
      title: t("fields.position"),
      dataIndex: "position",
      key: "position",
    },
    {
      title: t("fields.manager"),
      key: "manager",
      render: (record: Employee) =>
        record.manager
          ? `${record.manager.firstName} ${record.manager.lastName}`
          : "-",
    },
    {
      title: t("fields.status"),
      dataIndex: "status",
      key: "status",
      render: (status: Employee["status"]) => (
        <Tag color={statusColor(status)}>{t(`status.${status}`)}</Tag>
      ),
    },
    {
      title: t("fields.hireDate"),
      dataIndex: "hireDate",
      key: "hireDate",
      render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD") : "-"),
      sorter: true,
    },
    {
      title: t("fields.salary"),
      dataIndex: "salary",
      key: "salary",
      render: (value: number) => value?.toLocaleString(),
    },
    {
      title: t("fields.docs"),
      dataIndex: "docs",
      key: "docs",
      render: (docs?: string) => {
        // Expecting docs as a serialized path or comma-separated string
        if (!docs) return "-";
        const count = docs.includes(",")
          ? docs.split(",").filter(Boolean).length
          : 1;
        return <Tag>{count}</Tag>;
      },
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record: Employee) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/employees/${record.id}`)}
          >
            {t("view")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/${record.id}/edit`)}
          >
            {t("edit")}
          </Button>
          <Popconfirm
            title={t("delete_confirmation")}
            description={t("delete_description")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              loading={deleteEmployeeMutation.isPending}
            >
              {t("delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Mobile-optimized columns
  const mobileColumns: ColumnsType<Employee> = [
    {
      title: t("fields.profile_image"),
      dataIndex: "profile_image",
      key: "profile_image",
      render: (url?: string) => (
        <Avatar
          src={url ? `${import.meta.env.VITE_API_STATIC_URL}${url}` : undefined}
          alt="Profile"
          size="small"
        >
          {t("fields.name").slice(0, 1)}
        </Avatar>
      ),
    },
    {
      title: t("fields.name"),
      key: "name",
      render: (record: Employee) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.position}
          </Text>
        </div>
      ),
    },
    {
      title: t("fields.status"),
      dataIndex: "status",
      key: "status",
      render: (status: Employee["status"]) => (
        <Tag color={statusColor(status)} size="small">
          {t(`status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record: Employee) => (
        <Space size="small" direction={screens.xs ? "vertical" : "horizontal"}>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/employees/${record.id}`)}
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/employees/${record.id}/edit`)}
          />
          <Popconfirm
            title={t("delete_confirmation")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteEmployeeMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Card render for mobile view
  const cardRender = (record: Employee) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Avatar
          src={record.profile_image ? `${import.meta.env.VITE_API_STATIC_URL}${record.profile_image}` : undefined}
          style={{ marginRight: 12 }}
        >
          {record.name.slice(0, 1)}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0 }}>{record.name}</Title>
          <Text type="secondary">{record.position}</Text>
        </div>
        <Tag color={statusColor(record.status)}>{t(`status.${record.status}`)}</Tag>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary">
          {t("fields.department")}: {record.department || '-'}
        </Text>
        <br />
        <Text type="secondary">
          {t("fields.hireDate")}: {record.hireDate ? dayjs(record.hireDate).format("YYYY-MM-DD") : '-'}
        </Text>
      </div>
      <Space>
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/employees/${record.id}`)}
        >
          {t("view")}
        </Button>
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => navigate(`/employees/${record.id}/edit`)}
        >
          {t("edit")}
        </Button>
        <Popconfirm
          title={t("delete_confirmation")}
          onConfirm={() => handleDelete(record.id)}
          okText={t("yes")}
          cancelText={t("no")}
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            loading={deleteEmployeeMutation.isPending}
          >
            {t("delete")}
          </Button>
        </Popconfirm>
      </Space>
    </div>
  );

  return (
    <ResponsiveContainer>
      <Card>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: screens.xs ? 'flex-start' : 'center',
          flexDirection: screens.xs ? 'column' : 'row',
          gap: screens.xs ? '12px' : '0',
          marginBottom: '24px' 
        }}>
          <Title level={2} style={{ margin: 0 }}>
            {t("employees_list")}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/employees/create")}
            size={screens.xs ? 'middle' : 'large'}
            block={screens.xs}
          >
            {t("create_employee")}
          </Button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <Input.Search
            placeholder={t("search_placeholder")}
            allowClear
            enterButton={<SearchOutlined />}
            size={screens.xs ? 'middle' : 'large'}
            onSearch={handleSearch}
            onChange={(e) => !e.target.value && handleSearch("")}
            style={{ maxWidth: screens.xs ? '100%' : '400px' }}
          />
        </div>
        
        <Divider />
        
        <ResponsiveTable
          columns={columns}
          mobileColumns={mobileColumns}
          cardView={screens.xs}
          cardRender={cardRender}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.total || 0,
            showSizeChanger: !screens.xs,
            showQuickJumper: !screens.xs,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>
    </ResponsiveContainer>
  );
};

export default EmployeesListPage;
