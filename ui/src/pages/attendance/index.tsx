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
  DatePicker,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import type { QueryParams, Attendance, ApiResponse, Student } from "@/types/api";
import CreateForm from "@/components/Form/CreateForm";
import {
  CreateAttendanceFormSchema,
  UpdateAttendanceFormSchema,
} from "@/forms/Attendance.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;


const AttendancePage: React.FC = () => {
  const t = useTranslate("attendance");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch attendance records
  const { data: attendanceData, isLoading } = useQuery<ApiResponse<Attendance>>({
    queryKey: ["attendance", currentPage, pageSize, searchText, statusFilter, dateRange],
    queryFn: async (): Promise<ApiResponse<Attendance>> => {
      const params: QueryParams = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) params.q = searchText;
      if (statusFilter) params.status = statusFilter;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].format("YYYY-MM-DD");
        params.endDate = dateRange[1].format("YYYY-MM-DD");
      }
      
      const response = searchText 
        ? await httpClient.get(`/attendance/search?${new URLSearchParams(params as Record<string, string>)}`)
        : await httpClient.get(`/attendance/paginate?${new URLSearchParams(params as Record<string, string>)}`);
      
      return response.data;
    },
  });

  // Fetch students for selection
  const { data: studentsData } = useQuery<ApiResponse<Student>>({
    queryKey: ["students"],
    queryFn: async (): Promise<ApiResponse<Student>> => {
      const response = await httpClient.get("/students");
      return response.data;
    },
  });

  // Create attendance mutation
  const createAttendanceMutation = useMutation({
    mutationFn: (data: Partial<Attendance>) => httpClient.post("/attendance", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update attendance mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Attendance> }) =>
      httpClient.put(`/attendance/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedAttendance(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete attendance mutation
  const deleteAttendanceMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/attendance/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: Partial<Attendance>) => {
    createAttendanceMutation.mutate(values);
  };

  const handleUpdate = (values: Partial<Attendance>) => {
    if (selectedAttendance) {
      updateAttendanceMutation.mutate({ id: selectedAttendance.id, data: values });
    }
  };

  const handleDelete = (attendance: Attendance) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteAttendanceMutation.mutate(attendance.id),
    });
  };

  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsUpdateModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "green";
      case "absent":
        return "red";
      case "late":
        return "orange";
      case "excused":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: t("table.student"),
      dataIndex: "student",
      key: "student",
      render: (student: Attendance["student"]) => student?.name || "-",
    },
    {
      title: t("table.date"),
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
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
      render: (notes: string) => notes || "-",
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: unknown, record: Attendance) => (
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
    studentsData?.data?.map((student: Student) => ({
      label: student.name,
      value: student.id,
    })) || [];

  // Update form schemas with student options
  const createFormSchema = CreateAttendanceFormSchema();
  const updateFormSchema = UpdateAttendanceFormSchema();
  
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
            placeholder="Search attendance..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder={t("filters.all_status")}
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="present">{t("status_options.present")}</Select.Option>
            <Select.Option value="absent">{t("status_options.absent")}</Select.Option>
            <Select.Option value="late">{t("status_options.late")}</Select.Option>
            <Select.Option value="excused">{t("status_options.excused")}</Select.Option>
          </Select>

          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
            placeholder={[t("filters.date_range"), t("filters.date_range")]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={attendanceData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: attendanceData?.total || 0,
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
        confirmLoading={createAttendanceMutation.isPending}
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
          setSelectedAttendance(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updateAttendanceMutation.isPending}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedAttendance || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default AttendancePage;
