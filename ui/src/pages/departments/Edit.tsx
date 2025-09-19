import React, { useEffect } from "react";
import { Form, Button, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { departmentsApi } from "@/api/departments";
import { useTranslate } from "@/hooks/locales";
import type { UpdateDepartmentData } from "@/api/departments";
import { UpdateDepartmentFormSchema } from "@/forms/Departments.sc";
import CreateField from "@/components/Form/CreateField";
import type { ApiError } from "@/types/api";

const EditDepartmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("departments");
  const [form] = Form.useForm<UpdateDepartmentData>();

  // Fetch department details
  const { data: department, isLoading } = useQuery({
    queryKey: ["departments", id],
    queryFn: async () => {
      if (!id) throw new Error("Department ID is required");
      const res = await departmentsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutationFn: (data: UpdateDepartmentData) => {
      if (!id) throw new Error("Department ID is required");
      return departmentsApi.update(id, data);
    },
    onSuccess: () => {
      message.success(t("messages.update_success"));
      navigate(`/departments/${id}`);
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || t("messages.update_error");
      message.error(errorMessage);
    },
  });

  // Set form values when department data is loaded
  useEffect(() => {
    if (department) {
      form.setFieldsValue({
        name: department.name,
        description: department.description,
        managerId: department.managerId,
      });
    }
  }, [department, form]);

  const handleSubmit = (values: UpdateDepartmentData) => {
    updateDepartmentMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card loading />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <h3>{t("messages.not_found")}</h3>
            <Button onClick={() => navigate("/departments")}>
              {t("actions.back_to_list")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card title={t("edit_department")} className="max-w-2xl mx-auto">
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          {UpdateDepartmentFormSchema().map((f) => (
            <React.Fragment key={String(f.name)}>{CreateField(f)}</React.Fragment>
          ))}

          <Form.Item className="mb-0">
            <div className="flex gap-3 justify-end">
              <Button onClick={() => navigate(`/departments/${id}`)}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateDepartmentMutation.isPending}
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

export default EditDepartmentPage;
