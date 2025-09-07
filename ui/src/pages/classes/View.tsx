import React from "react";
import { Card, Descriptions, Button, Spin, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { Class } from "@/types/api";
import dayjs from "dayjs";

const ViewClassPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("classes");

  const { data: classData, isLoading } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const response = await httpClient.get(`/classes/${id}`);
      return response.data.data as Class;
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

  if (!classData) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <p>{t("class_not_found")}</p>
            <Button onClick={() => navigate("/classes")}>
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
            onClick={() => navigate("/classes")}
          >
            {t("back_to_list")}
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/classes/${id}/edit`)}
          >
            {t("edit")}
          </Button>
        </div>

        <Card title={t("class_details")}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label={t("name")} span={2}>
              {classData.name}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("created_at")}>
              {dayjs(classData.created_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            
            <Descriptions.Item label={t("updated_at")}>
              {dayjs(classData.updated_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>

            {classData.created_by && (
              <Descriptions.Item label={t("created_by")} span={2}>
                {classData.created_by.name} ({classData.created_by.username})
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {classData.students && classData.students.length > 0 && (
          <Card title={t("students")} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {classData.students.map((student) => (
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

        {classData.subjects && classData.subjects.length > 0 && (
          <Card title={t("subjects")} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {classData.subjects.map((subject) => (
                <Tag
                  key={subject.id}
                  color="green"
                  className="cursor-pointer"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  {subject.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {classData.teachers && classData.teachers.length > 0 && (
          <Card title={t("teachers")} className="mt-6">
            <div className="flex flex-wrap gap-2">
              {classData.teachers.map((teacher) => (
                <Tag
                  key={teacher.id}
                  color="orange"
                  className="cursor-pointer"
                  onClick={() => navigate(`/employees/${teacher.id}`)}
                >
                  {teacher.name}
                </Tag>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewClassPage;
