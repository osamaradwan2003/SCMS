import React from "react";
import { Form, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { CreateClassData } from "@/types/api";
import { CreateClassFormSchema } from "@/forms/Classes.sc";
import CreateField from "@/components/Form/CreateField";

const CreateClassPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("classes");
  const [form] = Form.useForm<CreateClassData>();

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
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          {CreateClassFormSchema().map((f) => (
            <React.Fragment key={String(f.name)}>{CreateField(f)}</React.Fragment>
          ))}

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
