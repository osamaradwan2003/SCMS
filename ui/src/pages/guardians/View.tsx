import React from "react";
import { Card, Descriptions, Button, Spin, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { Guardian } from "@/types/api";
import dayjs from "dayjs";

const ViewGuardianPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("guardians");

  const { data: guardian, isLoading } = useQuery({
    queryKey: ["guardian", id],
    queryFn: async () => {
      const response = await httpClient.get(`/guardians/${id}`);
      return response.data.data as Guardian;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!guardian) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <p>{t("guardian_not_found")}</p>
            <Button onClick={() => navigate("/guardians")}>
              {t("back_to_list")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/guardians")}
          >
            {t("back_to_list")}
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/guardians/${id}/edit`)}
          >
            {t("edit")}
          </Button>
        </div>

        <Card title={t("guardian_details")}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label={t("name")} span={2}>
              {guardian.name}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("phone")}>
              {guardian.phone}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("relation_degree")}>
              {guardian.relationDegree}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("created_at")}>
              {dayjs(guardian.created_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("updated_at")}>
              {dayjs(guardian.updated_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>

            {guardian.created_by && (
              <Descriptions.Item label={t("created_by")} span={2}>
                {guardian.created_by.name} ({guardian.created_by.username})
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {guardian.Student && guardian.Student.length > 0 && (
          <Card title={t("associated_students")} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {guardian.Student.map((student) => (
                <Tag
                  key={student.id}
                  color="blue"
                  className="cursor-pointer"
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  {student.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewGuardianPage;
