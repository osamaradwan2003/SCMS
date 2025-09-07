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
import type { QueryParams, ApiResponse, Subscription, Student } from "@/types/api";
import CreateForm from "@/components/Form/CreateForm";
import {
  CreateSubscriptionFormSchema,
  UpdateSubscriptionFormSchema,
} from "@/forms/Subscriptions.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface Subscription {
  id: string;
  studentId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  notes?: string;
  student?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface StudentOption {
  label: string;
  value: string;
}

const SubscriptionsPage: React.FC = () => {
  const t = useTranslate("subscriptions");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [studentFilter, setStudentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch subscriptions
  const { data: subscriptionsData, isLoading } = useQuery<ApiResponse<Subscription>>({
    queryKey: ["subscriptions", currentPage, pageSize, searchText, studentFilter, statusFilter, dateRange],
    queryFn: async (): Promise<ApiResponse<Subscription>> => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        limit: pageSize.toString(),
      };

      if (searchText) params.q = searchText;
      if (studentFilter) params.studentId = studentFilter;
      if (statusFilter) params.status = statusFilter;
      if (dateRange) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }
      
      const response = searchText 
        ? await httpClient.get(`/subscriptions/search?${new URLSearchParams(params)}`)
        : await httpClient.get(`/subscriptions/paginate?${new URLSearchParams(params)}`);
      
      return response.data;
    },
  });

  // Fetch students for selection
  const { data: studentsData } = useQuery<ApiResponse<{ id: string; name: string }>>({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await httpClient.get("/students");
      return response.data;
    },
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: (data: Partial<Subscription>) => httpClient.post("/subscriptions", data),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Subscription, 'id' | 'created_at' | 'updated_at'>> }) =>
      httpClient.put(`/subscriptions/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedSubscription(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete subscription mutation
  const deleteSubscriptionMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/subscriptions/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: any) => {
    createSubscriptionMutation.mutate(values);
  };

  const handleUpdate = (values: any) => {
    if (selectedSubscription) {
      updateSubscriptionMutation.mutate({ id: selectedSubscription.id, data: values });
    }
  };

  const handleDelete = (subscription: Subscription) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteSubscriptionMutation.mutate(subscription.id),
    });
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsUpdateModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "orange";
      case "expired":
        return "red";
      case "cancelled":
        return "gray";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: t("table.student"),
      dataIndex: "student",
      key: "student",
      render: (student: { name?: string }) => student?.name || "-",
    },
    {
      title: t("table.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: t("table.startDate"),
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: string) => dayjs(startDate).format("YYYY-MM-DD"),
    },
    {
      title: t("table.endDate"),
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate: string) => dayjs(endDate).format("YYYY-MM-DD"),
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
      title: t("table.notes"),
      dataIndex: "notes",
      key: "notes",
      render: (notes: string) => (
        <div style={{ maxWidth: 150 }}>
          {notes ? (notes.length > 30 ? `${notes.substring(0, 30)}...` : notes) : "-"}
        </div>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: undefined, record: Subscription) => (
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

  // Prepare student options for form
  const studentOptions =
    studentsData?.data?.map((student: any) => ({
      label: student.name,
      value: student.id,
    })) || [];

  // Update form schemas with student options
  const createFormSchema = CreateSubscriptionFormSchema();
  const updateFormSchema = UpdateSubscriptionFormSchema();
  
  createFormSchema.find(
    (field) => field.name === "studentId"
  )!.autoCompleteProps!.options = studentOptions;
  updateFormSchema.find(
    (field) => field.name === "studentId"
  )!.autoCompleteProps!.options = studentOptions;

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
            placeholder="Search subscriptions..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder={t("filters.all_students")}
            value={studentFilter}
            onChange={setStudentFilter}
            allowClear
            style={{ width: 200 }}
          >
            {studentOptions.map((option) => (
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
            <Select.Option value="active">{t("status_options.active")}</Select.Option>
            <Select.Option value="inactive">{t("status_options.inactive")}</Select.Option>
            <Select.Option value="expired">{t("status_options.expired")}</Select.Option>
            <Select.Option value="cancelled">{t("status_options.cancelled")}</Select.Option>
          </Select>

          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={[t("filters.date_range"), t("filters.date_range")]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={subscriptionsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: subscriptionsData?.total || 0,
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
        confirmLoading={createSubscriptionMutation.isPending}
        width={600}
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
          setSelectedSubscription(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updateSubscriptionMutation.isPending}
        width={600}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedSubscription || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;
