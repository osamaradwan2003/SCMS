import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { CreateClassData } from "@/types/api";

const CreateClassPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("classes");
  const [form] = Form.useForm();

  const createClassMutation = useMutation({
    mutationFn: (data: CreateClassData) => httpClient.post("/classes", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      navigate("/classes");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.create_error"));
    },
  });

  const handleSubmit = (values: CreateClassData) => {
    createClassMutation.mutate(values);
  };

  return (
    <div className="p-6">
      <Card title={t("create_class")} className="max-w-2xl mx-auto">
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
                loading={createClassMutation.isPending}
              >
                {t("create")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateClassPage;
