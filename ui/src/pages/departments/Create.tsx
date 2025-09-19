import React from "react";
import { Form, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { departmentsApi } from "@/api/departments";
import { useTranslate } from "@/hooks/locales";
import type { CreateDepartmentData } from "@/api/departments";
import { CreateDepartmentFormSchema } from "@/forms/Departments.sc";
import CreateField from "@/components/Form/CreateField";
import type { ApiError } from "@/types/api";

const CreateDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("departments");
  const [form] = Form.useForm<CreateDepartmentData>();

  const createDepartmentMutation = useMutation({
    mutationFn: (data: CreateDepartmentData) => departmentsApi.create(data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      navigate("/departments");
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || t("messages.create_error");
      message.error(errorMessage);
    },
  });

  const handleSubmit = (values: CreateDepartmentData) => {
    createDepartmentMutation.mutate(values);
  };

  return (
    <div className="p-6">
      <Card title={t("create_department")} className="max-w-2xl mx-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          {CreateDepartmentFormSchema().map((f) => (
            <React.Fragment key={String(f.name)}>{CreateField(f)}</React.Fragment>
          ))}

          <Form.Item className="mb-0">
            <div className="flex gap-3 justify-end">
              <Button onClick={() => navigate("/departments")}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createDepartmentMutation.isPending}
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

export default CreateDepartmentPage;
