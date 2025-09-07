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
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@/hooks/locales";
import type { QueryParams, ApiResponse, Message } from "@/types/api";
import CreateForm from "@/components/Form/CreateForm";
import {
  CreateMessageFormSchema,
  UpdateMessageFormSchema,
} from "@/forms/Messages.sc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import dayjs from "dayjs";

interface Message {
  id: string;
  content: string;
  type: string;
  isRead: boolean;
  sentAt: string;
  senderId: string;
  studentId?: string;
  guardianId?: string;
  sender?: {
    id: string;
    name: string;
    username: string;
  };
  student?: {
    id: string;
    name: string;
  };
  guardian?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

const MessagesPage: React.FC = () => {
  const t = useTranslate("messages");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [readFilter, setReadFilter] = useState<string>("");

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messagesData, isLoading } = useQuery<ApiResponse<Message>>({
    queryKey: ["messages", currentPage, pageSize, searchText, typeFilter, readFilter],
    queryFn: async (): Promise<ApiResponse<Message>> => {
      const params: QueryParams = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchText) params.q = searchText;
      if (typeFilter) params.type = typeFilter;
      if (readFilter !== "") params.isRead = readFilter === "read" ? "true" : "false";
      
      const response = searchText 
        ? await httpClient.get(`/messages/search?${new URLSearchParams(params as Record<string, string>)}`)
        : await httpClient.get(`/messages/paginate?${new URLSearchParams(params as Record<string, string>)}`);
      
      return response.data;
    },
  });

  // Fetch students and guardians for recipient selection
  const { data: studentsData } = useQuery({
    queryKey: ["students"],
    queryFn: () => httpClient.get("/students"),
  });

  const { data: guardiansData } = useQuery({
    queryKey: ["guardians"],
    queryFn: () => httpClient.get("/guardians"),
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: (data: Partial<Message>) => httpClient.post("/messages", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      setIsCreateModalOpen(false);
      createForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      message.error(t("messages.create_error"));
    },
  });

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Message> }) =>
      httpClient.put(`/messages/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      setIsUpdateModalOpen(false);
      setSelectedMessage(null);
      updateForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/messages/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      message.error(t("messages.delete_error"));
    },
  });

  // Mark as read/unread mutation
  const markReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      httpClient.put(`/messages/${id}/read`, { isRead }),
    onSuccess: (_, { isRead }) => {
      message.success(
        isRead 
          ? t("messages.mark_read_success") 
          : t("messages.mark_unread_success")
      );
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      message.error(t("messages.update_error"));
    },
  });

  const handleCreate = (values: Partial<Message>) => {
    createMessageMutation.mutate(values);
  };

  const handleUpdate = (values: Partial<Message>) => {
    if (selectedMessage) {
      updateMessageMutation.mutate({ id: selectedMessage.id, data: values });
    }
  };

  const handleDelete = (messageItem: Message) => {
    Modal.confirm({
      title: t("delete_confirm"),
      onOk: () => deleteMessageMutation.mutate(messageItem.id),
    });
  };

  const handleEdit = (messageItem: Message) => {
    setSelectedMessage(messageItem);
    setIsUpdateModalOpen(true);
  };

  const handleMarkRead = (messageItem: Message, isRead: boolean) => {
    markReadMutation.mutate({ id: messageItem.id, isRead });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "private":
        return "blue";
      case "bulk":
        return "green";
      case "report":
        return "orange";
      default:
        return "default";
    }
  };

  const getRecipientName = (messageItem: Message) => {
    if (messageItem.student) return messageItem.student.name;
    if (messageItem.guardian) return messageItem.guardian.name;
    return "All";
  };

  const columns = [
    {
      title: t("table.content"),
      dataIndex: "content",
      key: "content",
      render: (content: string) => (
        <div style={{ maxWidth: 200 }}>
          {content.length > 50 ? `${content.substring(0, 50)}...` : content}
        </div>
      ),
    },
    {
      title: t("table.recipient"),
      key: "recipient",
      render: (record: Message) => getRecipientName(record),
    },
    {
      title: t("table.type"),
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {t(`type_options.${type}`)}
        </Tag>
      ),
    },
    {
      title: t("table.sentAt"),
      dataIndex: "sentAt",
      key: "sentAt",
      render: (sentAt: string) => dayjs(sentAt).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: t("table.isRead"),
      dataIndex: "isRead",
      key: "isRead",
      render: (isRead: boolean) => (
        <Tag color={isRead ? "green" : "red"}>
          {t(`read_status.${isRead ? "read" : "unread"}`)}
        </Tag>
      ),
    },
    {
      title: t("table.actions"),
      key: "actions",
      render: (_: undefined, record: Message) => (
        <Space>
          <Tooltip title={record.isRead ? t("actions.mark_unread") : t("actions.mark_read")}>
            <Button
              type="default"
              icon={record.isRead ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              size="small"
              onClick={() => handleMarkRead(record, !record.isRead)}
            />
          </Tooltip>
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

  // Prepare recipient options for form
  const recipientOptions = [
    ...(studentsData?.data?.map((student: any) => ({
      label: `${student.name} (Student)`,
      value: student.id,
    })) || []),
    ...(guardiansData?.data?.map((guardian: any) => ({
      label: `${guardian.name} (Guardian)`,
      value: guardian.id,
    })) || []),
  ];

  // Update form schemas with recipient options
  const createFormSchema = CreateMessageFormSchema();
  const updateFormSchema = UpdateMessageFormSchema();
  
  createFormSchema.find(
    (field) => field.name === "recipientId"
  )!.autoCompleteProps!.options = recipientOptions;
  updateFormSchema.find(
    (field) => field.name === "recipientId"
  )!.autoCompleteProps!.options = recipientOptions;

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
            placeholder="Search messages..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          
          <Select
            placeholder={t("filters.all_types")}
            value={typeFilter}
            onChange={setTypeFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="private">{t("type_options.private")}</Select.Option>
            <Select.Option value="bulk">{t("type_options.bulk")}</Select.Option>
            <Select.Option value="report">{t("type_options.report")}</Select.Option>
          </Select>

          <Select
            placeholder={t("filters.read_status")}
            value={readFilter}
            onChange={setReadFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="read">{t("read_status.read")}</Select.Option>
            <Select.Option value="unread">{t("read_status.unread")}</Select.Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={messagesData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: messagesData?.total || 0,
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
        confirmLoading={createMessageMutation.isPending}
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
          setSelectedMessage(null);
        }}
        onOk={() => {
          updateForm.submit();
        }}
        confirmLoading={updateMessageMutation.isPending}
        width={600}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={selectedMessage || undefined}
        >
          <CreateForm formSchema={updateFormSchema.slice(0, -1)} />
        </Form>
      </Modal>
    </div>
  );
};

export default MessagesPage;
