import React, { useState } from "react";
import {
  Button,
  Table,
  Space,
  message,
  Input,
  Card,
  Popconfirm,
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
import { httpClient } from "@/api/httpClient";
import type { Subject, ApiResponse } from "@/types/api";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const SubjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("subjects");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const { data: subjectsData, isLoading } = useQuery({
    queryKey: ["subjects", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchText && { q: searchText }),
      });
      
      const endpoint = searchText ? "/subjects/search" : "/subjects/paginate";
      const response = await httpClient.get(`${endpoint}?${params}`);
      return response.data as ApiResponse<Subject>;
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/subjects/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.delete_error"));
    },
  });

  const handleDelete = (id: string) => {
    deleteSubjectMutation.mutate(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const columns: ColumnsType<Subject> = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("classes_count"),
      key: "classesCount",
      render: (record: Subject) => record.classes?.length || 0,
    },
    {
      title: t("reports_count"),
      key: "reportsCount",
      render: (record: Subject) => record.reports?.length || 0,
    },
    {
      title: t("created_at"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
      sorter: true,
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record: Subject) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/subjects/${record.id}`)}
          >
            {t("view")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/subjects/${record.id}/edit`)}
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
              loading={deleteSubjectMutation.isPending}
            >
              {t("delete")}
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
          <h1 className="text-2xl font-semibold">{t("subjects_list")}</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/subjects/create")}
          >
            {t("create_subject")}
          </Button>
        </div>

        <div className="mb-4">
          <Input.Search
            placeholder={t("search_placeholder")}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => !e.target.value && handleSearch("")}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={subjectsData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: subjectsData?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("of")} ${total} ${t("items")}`,
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

export default SubjectsListPage;
