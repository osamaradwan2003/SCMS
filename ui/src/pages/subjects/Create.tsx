import React from "react";
import { Form, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { useTranslate } from "@/hooks/locales";
import type { CreateSubjectData } from "@/types/api";
import { CreateSubjectFormSchema } from "@/forms/Subjects.sc";
import CreateField from "@/components/Form/CreateField";

const CreateSubjectPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("subjects");
  const [form] = Form.useForm<CreateSubjectData>();

  const createSubjectMutation = useMutation({
    mutationFn: (data: CreateSubjectData) => httpClient.post("/subjects", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      navigate("/subjects");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.create_error"));
    },
  });

  const handleSubmit = (values: CreateSubjectData) => {
    createSubjectMutation.mutate(values);
  };

  return (
    <div className="p-6">
      <Card title={t("create_subject")} className="max-w-2xl mx-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          {CreateSubjectFormSchema().map((f) => (
            <React.Fragment key={String(f.name)}>{CreateField(f)}</React.Fragment>
          ))}

          <Form.Item className="mb-0">
            <div className="flex gap-3 justify-end">
              <Button onClick={() => navigate("/subjects")}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createSubjectMutation.isPending}
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

export default CreateSubjectPage;
