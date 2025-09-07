import React, { useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { Guardian, UpdateGuardianData } from "@/types/api";

const EditGuardianPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("guardians");
  const [form] = Form.useForm();

  const { data: guardian, isLoading } = useQuery({
    queryKey: ["guardian", id],
    queryFn: async () => {
      const response = await httpClient.get(`/guardians/${id}`);
      return response.data.data as Guardian;
    },
    enabled: !!id,
  });

  const updateGuardianMutation = useMutation({
    mutationFn: (data: UpdateGuardianData) =>
      httpClient.put(`/guardians/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      navigate("/guardians");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.update_error"));
    },
  });

  useEffect(() => {
    if (guardian) {
      form.setFieldsValue({
        name: guardian.name,
        phone: guardian.phone,
        relationDegree: guardian.relationDegree,
      });
    }
  }, [guardian, form]);

  const handleSubmit = (values: UpdateGuardianData) => {
    updateGuardianMutation.mutate(values);
  };

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
      <Card title={t("edit_guardian")} className="max-w-2xl mx-auto">
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

          <Form.Item
            name="phone"
            label={t("phone")}
            rules={[
              { required: true, message: t("validation.phone_required") },
              {
                pattern: /^\+?[\d\s-()]+$/,
                message: t("validation.phone_invalid"),
              },
            ]}
          >
            <Input placeholder={t("placeholders.phone")} />
          </Form.Item>

          <Form.Item
            name="relationDegree"
            label={t("relation_degree")}
            rules={[
              { required: true, message: t("validation.relation_required") },
            ]}
          >
            <Input placeholder={t("placeholders.relation_degree")} />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex gap-3 justify-end">
              <Button onClick={() => navigate("/guardians")}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateGuardianMutation.isPending}
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

export default EditGuardianPage;
