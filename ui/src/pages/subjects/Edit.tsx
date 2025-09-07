import React, { useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { Subject, UpdateSubjectData } from "@/types/api";

const EditSubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("subjects");
  const [form] = Form.useForm();

  const { data: subject, isLoading } = useQuery({
    queryKey: ["subject", id],
    queryFn: async () => {
      const response = await httpClient.get(`/subjects/${id}`);
      return response.data.data as Subject;
    },
    enabled: !!id,
  });

  const updateSubjectMutation = useMutation({
    mutationFn: (data: UpdateSubjectData) => 
      httpClient.put(`/subjects/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      navigate("/subjects");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.update_error"));
    },
  });

  useEffect(() => {
    if (subject) {
      form.setFieldsValue({
        name: subject.name,
      });
    }
  }, [subject, form]);

  const handleSubmit = (values: UpdateSubjectData) => {
    updateSubjectMutation.mutate(values);
  };

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
      <Card title={t("edit_subject")} className="max-w-2xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={t("name")}
            rules={[
              { required: true, message: t("validation.name_required") },
              { min: 2, message: t("validation.name_min_length") },
            ]}
          >
            <Input placeholder={t("placeholders.name")} />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex gap-3 justify-end">
              <Button onClick={() => navigate("/subjects")}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateSubjectMutation.isPending}
              >
                {t("update")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditSubjectPage;
