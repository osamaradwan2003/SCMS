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
import type { Class, ApiResponse } from "@/types/api";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const ClassesListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("classes");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const { data: classesData, isLoading } = useQuery({
    queryKey: ["classes", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchText && { q: searchText }),
      });
      
      const endpoint = searchText ? "/classes/search" : "/classes/paginate";
      const response = await httpClient.get(`${endpoint}?${params}`);
      return response.data as ApiResponse<Class>;
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/classes/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.delete_error"));
    },
  });

  const handleDelete = (id: string) => {
    deleteClassMutation.mutate(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const columns: ColumnsType<Class> = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("students_count"),
      key: "studentsCount",
      render: (record: Class) => record.students?.length || 0,
    },
    {
      title: t("subjects_count"),
      key: "subjectsCount",
      render: (record: Class) => record.subjects?.length || 0,
    },
    {
      title: t("teachers_count"),
      key: "teachersCount",
      render: (record: Class) => record.teachers?.length || 0,
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
      render: (record: Class) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/classes/${record.id}`)}
          >
            {t("view")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/classes/${record.id}/edit`)}
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
              loading={deleteClassMutation.isPending}
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
          <h1 className="text-2xl font-semibold">{t("classes_list")}</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/classes/create")}
          >
            {t("create_class")}
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
          dataSource={classesData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: classesData?.total || 0,
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

export default ClassesListPage;
