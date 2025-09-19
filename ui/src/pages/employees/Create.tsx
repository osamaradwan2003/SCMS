import React from "react";
import { Button, Form, message, Grid } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useTranslate } from "@/hooks/locales";
import { CreateEmployeeFormSchema } from "@/forms/Employees.sc";
import CreateForm from "@/components/Form/CreateForm";
import { employeesApi, type CreateEmployeeFormData } from "@/api/employees";
import ResponsiveContainer from "@/components/utils/ResponsiveContainer";
import ResponsiveForm from "@/components/utils/ResponsiveForm";

const { useBreakpoint } = Grid;

// Form values as produced by the schema form
type CreateEmployeeFormValues = CreateEmployeeFormData;

const CreateEmployeePage: React.FC = () => {
  const t = useTranslate("employees");
  const screens = useBreakpoint();

  const createMutation = useMutation({
    mutationFn: (data: CreateEmployeeFormData) => {
      return employeesApi.create(data);
    },
    onSuccess: () => {
      message.success(t("messages.create_success"));
      window.location.reload();
    },
    onError: (error: unknown) => {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      const apiMessage = e?.response?.data?.message || e?.message;
      message.error(apiMessage || t("messages.create_error"));
    },
  });

  const handleSubmit = (values: CreateEmployeeFormValues) => {
    const toISO = (val: string | Date | undefined): string => {
      if (!val) return new Date().toISOString(); // Default to current date if undefined
      if (typeof val === "string") return val;
      return (val as Date).toISOString();
    };

    const formData: CreateEmployeeFormData = {
      ...values,
      is_teacher:
        values.is_teacher === undefined || values.is_teacher === null
          ? undefined
          : values.is_teacher,
      hireDate: toISO(values.hireDate),
      classId: values.classId ?? null,
    };
    
    createMutation.mutate(formData);
  };

  return (
    <ResponsiveContainer>
      <ResponsiveForm 
        title={t("create")} 
        onFinish={handleSubmit}
        layout={screens.xs ? "vertical" : "horizontal"}
      >
        <CreateForm formSchema={CreateEmployeeFormSchema()} onFinish={handleSubmit}>
          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              block={screens.xs} 
              type="primary" 
              htmlType="submit" 
              loading={createMutation.isPending}
              size={screens.xs ? 'middle' : 'large'}
            >
              {t("create")}
            </Button>
          </Form.Item>
        </CreateForm>
      </ResponsiveForm>
    </ResponsiveContainer>
  );
};

export default CreateEmployeePage;
