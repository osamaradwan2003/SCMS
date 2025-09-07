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
  Select,
  DatePicker,
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
  CreatePayrollFormSchema,
  UpdatePayrollFormSchema,
} from "@/forms/Payroll.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface Payroll {
  id: string;
  employeeId: string;
  amount: number;
  month: string;
  status: string;
  employee?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const PayrollPage: React.FC = () => {
  const t = useTranslate("payroll");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [employeeFilter, setEmployeeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [monthRange, setMonthRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch payroll records
  const { data: payrollData, isLoading } = useQuery({
    queryKey: ["payroll", currentPage, pageSize, searchText, employeeFilter, statusFilter, monthRange],
    queryFn: async () => {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) params.q = searchText;
      if (employeeFilter) params.employeeId = employeeFilter;
      if (statusFilter) params.status = statusFilter;
      if (monthRange) {
        params.startMonth = monthRange[0].format("YYYY-MM");
        params.endMonth = monthRange[1].format("YYYY-MM");
      }
      
      if (searchText) {
        return httpClient.get(`/payroll/search?${new URLSearchParams(params)}`);
      }
      
      return httpClient.get(`/payroll/paginate?${new URLSearchParams(params)}`);
    },
  });

  // Fetch employees for selection
  const { data: employeesData } = useQuery({
    queryKey: ["employees"],
    queryFn: () => httpClient.get("/employees"),
  });

  // Create payroll mutation
  const createPayrollMutation = useMutation({
    mutationFn: (data: any) => httpClient.post("/payroll", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update payroll mutation
  const updatePayrollMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      httpClient.put(`/payroll/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedPayroll(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete payroll mutation
  const deletePayrollMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/payroll/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createPayrollMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedPayroll) {
      updatePayrollMutation.mutate({ id: selectedPayroll.id, data: values });
    }
  };

  const handleDelete = (payroll: Payroll) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deletePayrollMutation.mutate(payroll.id),
    });
  };

  const handleEdit = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsUpdateModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: t("table.employee"),
      dataIndex: "employee",
      key: "employee",
      render: (employee: Payroll["employee"]) => employee?.name || "-",
    },
    {
      title: t("table.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: t("table.month"),
      dataIndex: "month",
      key: "month",
      render: (month: string) => dayjs(month).format("YYYY-MM"),
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {t(`status_options.${status}`)}
        </Tag>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: undefined, record: Payroll) => (
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

  // Prepare employee options for form
  const employeeOptions =
    employeesData?.data?.map((employee: any) => ({
      label: employee.name,
      value: employee.id,
    })) || [];

  // Update form schemas with employee options
  const createFormSchema = CreatePayrollFormSchema();
  const updateFormSchema = UpdatePayrollFormSchema();
  
  createFormSchema.find(
    (field) => field.name === "employeeId"
  )!.autoCompleteProps!.options = employeeOptions;
  updateFormSchema.find(
    (field) => field.name === "employeeId"
  )!.autoCompleteProps!.options = employeeOptions;

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

        <div className="mb-4 flex gap-4 flex-wrap">
          <Input
            placeholder="Search payroll..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder={t("filters.all_employees")}
            value={employeeFilter}
            onChange={setEmployeeFilter}
            allowClear
            style={{ width: 200 }}
          >
            {employeeOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder={t("filters.all_status")}
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="pending">{t("status_options.pending")}</Select.Option>
            <Select.Option value="paid">{t("status_options.paid")}</Select.Option>
            <Select.Option value="cancelled">{t("status_options.cancelled")}</Select.Option>
          </Select>

          <RangePicker
            value={monthRange}
            onChange={setMonthRange}
            picker="month"
            placeholder={[t("filters.month_range"), t("filters.month_range")]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={payrollData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: payrollData?.total || 0,
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
        confirmLoading={createPayrollMutation.isPending}
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
          setSelectedPayroll(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updatePayrollMutation.isPending}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedPayroll || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default PayrollPage;
