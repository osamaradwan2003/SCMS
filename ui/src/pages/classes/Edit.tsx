import React, { useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { Class, UpdateClassData } from "@/types/api";

const EditClassPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("classes");
  const [form] = Form.useForm();

  const { data: classData, isLoading } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const response = await httpClient.get(`/classes/${id}`);
      return response.data.data as Class;
    },
    enabled: !!id,
  });

  const updateClassMutation = useMutation({
    mutationFn: (data: UpdateClassData) => 
      httpClient.put(`/classes/${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      navigate("/classes");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.update_error"));
    },
  });

  useEffect(() => {
    if (classData) {
      form.setFieldsValue({
        name: classData.name,
      });
    }
  }, [classData, form]);

  const handleSubmit = (values: UpdateClassData) => {
    updateClassMutation.mutate(values);
  };

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
      <Card title={t("edit_class")} className="max-w-2xl mx-auto">
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
              <Button onClick={() => navigate("/classes")}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateClassMutation.isPending}
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

export default EditClassPage;
