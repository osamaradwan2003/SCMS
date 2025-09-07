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
import type { QueryParams, Student, Subject } from "@/types/api";
import CreateForm from "@/components/Form/CreateForm";
import {
  CreateWeeklyReportFormSchema,
  UpdateWeeklyReportFormSchema,
} from "@/forms/WeeklyReports.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

interface WeeklyReport {
  id: string;
  studentId: string;
  subjectId: string;
  week: string;
  score: number;
  strengths: string;
  weaknesses: string;
  adherence?: string;
  student?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const WeeklyReportsPage: React.FC = () => {
  const t = useTranslate("weeklyreports");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [studentFilter, setStudentFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [weekRange, setWeekRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch weekly reports
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["weeklyreports", currentPage, pageSize, searchText, studentFilter, subjectFilter, weekRange],
    queryFn: async () => {
      const params: QueryParams = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) params.q = searchText;
      if (studentFilter) params.studentId = studentFilter;
      if (subjectFilter) params.subjectId = subjectFilter;
      if (weekRange) {
        params.startDate = weekRange[0].format("YYYY-MM-DD");
        params.endDate = weekRange[1].format("YYYY-MM-DD");
      }
      
      if (searchText) {
        return httpClient.get(`/weeklyreports/search?${new URLSearchParams(params as Record<string, string>)}`);
      }
      
      return httpClient.get(`/weeklyreports/paginate?${new URLSearchParams(params as Record<string, string>)}`);
    },
  });

  // Fetch students for selection
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => httpClient.get("/students"),
  });

  // Fetch subjects for selection
  const { data: subjectsData } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => httpClient.get("/subjects"),
  });

  // Create weekly report mutation
  const createReportMutation = useMutation({
    mutationFn: (data: Partial<WeeklyReport>) => httpClient.post("/weeklyreports", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["weeklyreports"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update weekly report mutation
  const updateReportMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WeeklyReport> }) =>
      httpClient.put(`/weeklyreports/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedReport(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["weeklyreports"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete weekly report mutation
  const deleteReportMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/weeklyreports/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["weeklyreports"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  const handleCreate = (values: Partial<WeeklyReport>) => {
    createReportMutation.mutate(values);
  };

  const handleUpdate = (values: Partial<WeeklyReport>) => {
    if (selectedReport) {
      updateReportMutation.mutate({ id: selectedReport.id, data: values });
    }
  };

  const handleDelete = (report: WeeklyReport) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteReportMutation.mutate(report.id),
    });
  };

  const handleEdit = (report: WeeklyReport) => {
    setSelectedReport(report);
    setIsUpdateModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "green";
    if (score >= 80) return "blue";
    if (score >= 70) return "orange";
    if (score >= 60) return "yellow";
    return "red";
  };

  const columns = [
    {
      title: t("table.student"),
      dataIndex: "student",
      key: "student",
      render: (student: WeeklyReport["student"]) => student?.name || "-",
    },
    {
      title: t("table.subject"),
      dataIndex: "subject",
      key: "subject",
      render: (subject: WeeklyReport["subject"]) => subject?.name || "-",
    },
    {
      title: t("table.week"),
      dataIndex: "week",
      key: "week",
      render: (week: string) => dayjs(week).format("YYYY-MM-DD"),
    },
    {
      title: t("table.score"),
      dataIndex: "score",
      key: "score",
      render: (score: number) => (
        <Tag color={getScoreColor(score)}>
          {score}%
        </Tag>
      ),
    },
    {
      title: t("table.strengths"),
      dataIndex: "strengths",
      key: "strengths",
      render: (strengths: string) => (
        <div style={{ maxWidth: 150 }}>
          {strengths.length > 50 ? `${strengths.substring(0, 50)}...` : strengths}
        </div>
      ),
    },
    {
      title: t("table.weaknesses"),
      dataIndex: "weaknesses",
      key: "weaknesses",
      render: (weaknesses: string) => (
        <div style={{ maxWidth: 150 }}>
          {weaknesses.length > 50 ? `${weaknesses.substring(0, 50)}...` : weaknesses}
        </div>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: undefined, record: WeeklyReport) => (
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

  // Prepare options for form
  const studentOptions: SelectOption[] =
    studentsData?.data?.map((student: Student) => ({
      label: student.name,
      value: student.id,
    })) || [];

  const subjectOptions: SelectOption[] =
    subjectsData?.data?.map((subject: Subject) => ({
      label: subject.name,
      value: subject.id,
    })) || [];

  // Update form schemas with options
  const createFormSchema = CreateWeeklyReportFormSchema();
  const updateFormSchema = UpdateWeeklyReportFormSchema();
  
  createFormSchema.find(
    (field) => field.name === "studentId"
  )!.autoCompleteProps!.options = studentOptions;
  createFormSchema.find(
    (field) => field.name === "subjectId"
  )!.autoCompleteProps!.options = subjectOptions;

  updateFormSchema.find(
    (field) => field.name === "studentId"
  )!.autoCompleteProps!.options = studentOptions;
  updateFormSchema.find(
    (field) => field.name === "subjectId"
  )!.autoCompleteProps!.options = subjectOptions;

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
            placeholder="Search reports..."
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
            {studentOptions.map((option: SelectOption) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder={t("filters.all_subjects")}
            value={subjectFilter}
            onChange={setSubjectFilter}
            allowClear
            style={{ width: 200 }}
          >
            {subjectOptions.map((option: { label: string; value: string }) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>

          <RangePicker
            value={weekRange}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setWeekRange([dates[0], dates[1]]);
              } else {
                setWeekRange(null);
              }
            }}
            placeholder={[t("filters.week_range"), t("filters.week_range")]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={reportsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: reportsData?.data?.total || 0,
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
        confirmLoading={createReportMutation.isPending}
        width={700}
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
          setSelectedReport(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updateReportMutation.isPending}
        width={700}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedReport || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default WeeklyReportsPage;
