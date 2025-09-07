import React from "react";
import { Card, Descriptions, Button, Spin, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { Subject } from "@/types/api";
import dayjs from "dayjs";

const ViewSubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("subjects");

  const { data: subject, isLoading } = useQuery({
    queryKey: ["subject", id],
    queryFn: async () => {
      const response = await httpClient.get(`/subjects/${id}`);
      return response.data.data as Subject;
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

  if (!subject) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <p>{t("subject_not_found")}</p>
            <Button onClick={() => navigate("/subjects")}>
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
            onClick={() => navigate("/subjects")}
          >
            {t("back_to_list")}
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/subjects/${id}/edit`)}
          >
            {t("edit")}
          </Button>
        </div>

        <Card title={t("subject_details")}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label={t("name")} span={2}>
              {subject.name}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("created_at")}>
              {dayjs(subject.created_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("updated_at")}>
              {dayjs(subject.updated_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>

            {subject.created_by && (
              <Descriptions.Item label={t("created_by")} span={2}>
                {subject.created_by.name} ({subject.created_by.username})
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {subject.classes && subject.classes.length > 0 && (
          <Card title={t("classes")} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {subject.classes.map((classItem) => (
                <Tag
                  key={classItem.id}
                  color="blue"
                  className="cursor-pointer"
                  onClick={() => navigate(`/classes/${classItem.id}`)}
                >
                  {classItem.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {subject.reports && subject.reports.length > 0 && (
          <Card title={t("weekly_reports")} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {subject.reports.map((report) => (
                <Tag
                  key={report.id}
                  color="green"
                  className="cursor-pointer"
                  onClick={() => navigate(`/weekly-reports/${report.id}`)}
                >
                  Week: {dayjs(report.week).format("YYYY-MM-DD")}
                </Tag>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewSubjectPage;
