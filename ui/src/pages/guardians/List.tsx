import React, { useState } from "react";
import {
  Button,
  Table,
  Space,
  message,
  Input,
  Card,
  Popconfirm,
  Divider,
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
import type { Guardian, ApiResponse } from "@/types/api";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const GuardiansListPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("guardians");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  // Fetch guardians
  const { data: guardiansData, isLoading } = useQuery({
    queryKey: ["guardians", currentPage, pageSize, searchText],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchText && { q: searchText }),
      });

      const endpoint = searchText ? "/guardians/search" : "/guardians/paginate";
      const response = await httpClient.get(`${endpoint}?${params}`);
      return response.data as ApiResponse<Guardian>;
    },
  });

  // Delete guardian mutation
  const deleteGuardianMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/guardians/${id}`),
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["guardians"] });
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.delete_error"));
    },
  });

  const handleDelete = (id: string) => {
    deleteGuardianMutation.mutate(id);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const columns: ColumnsType<Guardian> = [
    {
      title: t("fields.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("fields.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("fields.relationship"),
      dataIndex: "relationDegree",
      key: "relationDegree",
    },
    {
      title: t("fields.students"),
      key: "studentsCount",
      render: (record: Guardian) => record.Student?.length || 0,
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
      render: (record: Guardian) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/guardians/${record.id}`)}
          >
            {t("view")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/guardians/${record.id}/edit`)}
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
              loading={deleteGuardianMutation.isPending}
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
          <h1 className="text-2xl font-semibold">{t("guardians_list")}</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/guardians/create")}
          >
            {t("create_guardian")}
          </Button>
        </div>
        <Divider />
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
        <Divider />
        <Table
          columns={columns}
          dataSource={guardiansData?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: guardiansData?.total || 0,
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

export default GuardiansListPage;
