import React, { useState } from "react";
import { Button, Table, Space, Modal, message, Input, Card, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import type { QueryParams, ApiResponse, Employee } from "@/types/api";
import { FormModal } from "@/components";
import { CreateEmployeeFormSchema, UpdateEmployeeFormSchema } from "@/forms/Employees.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  position: string;
  salary: number;
  hireDate: string;
  classId?: string;
  class?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const EmployeesPage: React.FC = () => {
  const t = useTranslate("employees");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employeesData, isLoading } = useQuery<ApiResponse<Employee>>({
    queryKey: ["employees", currentPage, pageSize, searchText],
    queryFn: async (): Promise<ApiResponse<Employee>> => {
      const params: QueryParams = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) params.q = searchText;
      
      const response = searchText 
        ? await httpClient.get(`/employees/search?${new URLSearchParams(params as Record<string, string>)}`)
        : await httpClient.get(`/employees/paginate?${new URLSearchParams(params as Record<string, string>)}`);
      
      return response.data;
    },
  });

  // Fetch classes for class selection
  const { data: classesData } = useQuery<ApiResponse<any>>({
    queryKey: ["classes"],
    queryFn: async (): Promise<ApiResponse<any>> => {
      const response = await httpClient.get("/classes");
      return response.data;
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: (data: Partial<Employee>) => httpClient.post("/employees", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      httpClient.put(`/employees/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedEmployee(null);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/employees/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: Partial<Employee>) => {
    createEmployeeMutation.mutate(values);
  };

  const handleUpdate = (values: Partial<Employee>) => {
    if (selectedEmployee) {
      updateEmployeeMutation.mutate({ id: selectedEmployee.id, data: values });
    }
  };

  const handleDelete = (employee: Employee) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteEmployeeMutation.mutate(employee.id),
    });
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    {
      title: t("table.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("table.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("table.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "-",
    },
    {
      title: t("table.position"),
      dataIndex: "position",
      key: "position",
      render: (position: string) => <Tag color="blue">{position}</Tag>,
    },
    {
      title: t("table.salary"),
      dataIndex: "salary",
      key: "salary",
      render: (salary: number) => `$${salary.toLocaleString()}`,
    },
    {
      title: t("table.hire_date"),
      dataIndex: "hireDate",
      key: "hireDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: t("table.class"),
      dataIndex: "class",
      key: "class",
      render: (classItem: any) => classItem?.name || "-",
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: unknown, record: Employee) => (
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

  // Prepare class options for form
  const classOptions = classesData?.data?.map((classItem: any) => ({
    label: classItem.name,
    value: classItem.id,
  })) || [];

  // Update form schemas with class options
  const createFormSchema = CreateEmployeeFormSchema();
  const updateFormSchema = UpdateEmployeeFormSchema();
  
  // Update class options in form schemas
  createFormSchema.find(field => field.name === "classId")!.autoCompleteProps!.options = classOptions;
  updateFormSchema.find(field => field.name === "classId")!.autoCompleteProps!.options = classOptions;

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
            placeholder="Search employees..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={employeesData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: employeesData?.total || 0,
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
        loading={createEmployeeMutation.isPending}
      />

      {/* Update Modal */}
      <FormModal
        title={t("edit_title")}
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleUpdate}
        formSchema={updateFormSchema}
        initialValues={selectedEmployee}
        loading={updateEmployeeMutation.isPending}
      />
    </div>
  );
};

export default EmployeesPage;
