import React, { useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Space,
  message,
  Table,
  Tag,
  Statistic,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "@/api/departments";
import type { Employee } from "@/api/employees";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { ApiError } from "@/types/api";

const ViewDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("departments");
  const queryClient = useQueryClient();
  const [employeesPage, setEmployeesPage] = useState(1);
  const [employeesPageSize, setEmployeesPageSize] = useState(10);

  // Fetch department details
  const { data: department, isLoading } = useQuery({
    queryKey: ["departments", id],
    queryFn: async () => {
      if (!id) throw new Error("Department ID is required");
      const res = await departmentsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch department statistics
  const { data: stats } = useQuery({
    queryKey: ["departments", id, "stats"],
    queryFn: async () => {
      if (!id) throw new Error("Department ID is required");
      const res = await departmentsApi.getStats(id);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch department employees
  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ["departments", id, "employees", employeesPage, employeesPageSize],
    queryFn: async () => {
      if (!id) throw new Error("Department ID is required");
      const res = await departmentsApi.getEmployees(id, {
        page: employeesPage,
        limit: employeesPageSize,
      });
      return res.data;
    },
    enabled: !!id,
  });

  // Delete department mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Department ID is required");
      return departmentsApi.delete(id);
    },
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      navigate("/departments");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || t("messages.delete_error");
      message.error(errorMessage);
    },
  });

  // Remove manager mutation
  const removeManagerMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Department ID is required");
      return departmentsApi.removeManager(id);
    },
    onSuccess: () => {
      message.success(t("messages.manager_removed"));
      queryClient.invalidateQueries({ queryKey: ["departments", id] });
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || t("messages.manager_remove_error");
      message.error(errorMessage);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleRemoveManager = () => {
    removeManagerMutation.mutate();
  };

  const employeeColumns: ColumnsType<Employee> = [
    {
      title: t("employees.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("employees.position"),
      dataIndex: "position",
      key: "position",
    },
    {
      title: t("employees.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "active" ? "green" : status === "inactive" ? "orange" : "red";
        return <Tag color={color}>{t(`employees.status_${status}`)}</Tag>;
      },
    },
    {
      title: t("employees.subjects"),
      dataIndex: "subjects",
      key: "subjects",
      render: (subjects: { id: string; name: string }[]) => (
        <Space wrap>
          {subjects?.map((subject) => (
            <Tag key={subject.id} color="blue">
              {subject.name}
            </Tag>
          )) || "-"}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <Card loading />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <h3>{t("messages.not_found")}</h3>
            <Button onClick={() => navigate("/departments")}>
              {t("actions.back_to_list")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/departments")}
        >
          {t("actions.back")}
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {/* Department Details */}
        <Col xs={24} lg={16}>
          <Card
            title={t("department_details")}
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/departments/${id}/edit`)}
                >
                  {t("actions.edit")}
                </Button>
                <Popconfirm
                  title={t("messages.delete_confirm")}
                  description={t("messages.delete_description")}
                  onConfirm={handleDelete}
                  okText={t("actions.yes")}
                  cancelText={t("actions.no")}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteMutation.isPending}
                  >
                    {t("actions.delete")}
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label={t("fields.name")}>
                {department.name}
              </Descriptions.Item>
              <Descriptions.Item label={t("fields.description")}>
                {department.description || "-"}
              </Descriptions.Item>
              <Descriptions.Item label={t("fields.manager")}>
                {department.manager ? (
                  <Space>
                    <Tag color="blue">{department.manager.name}</Tag>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {department.manager.position}
                    </span>
                    <Popconfirm
                      title={t("messages.remove_manager_confirm")}
                      onConfirm={handleRemoveManager}
                      okText={t("actions.yes")}
                      cancelText={t("actions.no")}
                    >
                      <Button
                        size="small"
                        danger
                        type="text"
                        loading={removeManagerMutation.isPending}
                      >
                        {t("actions.remove")}
                      </Button>
                    </Popconfirm>
                  </Space>
                ) : (
                  <Tag color="default">{t("no_manager")}</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label={t("fields.created_at")}>
                {dayjs(department.created_at).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label={t("fields.updated_at")}>
                {dayjs(department.updated_at).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Statistics */}
        <Col xs={24} lg={8}>
          <Card title={t("statistics")} className="mb-4">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title={t("stats.total_employees")}
                  value={stats?.totalEmployees || 0}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={t("stats.active_employees")}
                  value={stats?.activeEmployees || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={t("stats.inactive_employees")}
                  value={stats?.inactiveEmployees || 0}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={t("stats.salary_budget")}
                  value={stats?.totalSalaryBudget || 0}
                  prefix={<DollarOutlined />}
                  precision={2}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Department Employees */}
        <Col xs={24}>
          <Card title={t("department_employees")}>
            <Table
              columns={employeeColumns}
              dataSource={employeesData?.data || []}
              rowKey="id"
              loading={employeesLoading}
              pagination={{
                current: employeesPage,
                pageSize: employeesPageSize,
                total: employeesData?.total || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  t("table.pagination_info", {
                    start: range[0],
                    end: range[1],
                    total,
                  }),
                onChange: (page, size) => {
                  setEmployeesPage(page);
                  setEmployeesPageSize(size || 10);
                },
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewDepartmentPage;
