import React from "react";
import { Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import type { CreateGuardianData } from "@/api/guardians";
import { useTranslate } from "@/hooks/locales";
import { CreateGuardianFormSchema } from "@/forms/Guardians.sc";
import CreateForm from "@/components/Form/CreateForm";

const CreateGuardianPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("guardians");

  const createGuardianMutation = useMutation({
    mutationFn: (data: CreateGuardianData) =>
      httpClient.post("/guardians", data),
    onSuccess: () => {
      message.success(t("messages.create_success"));
      navigate("/guardians");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.create_error"));
    },
  });

  const handleSubmit = (values: CreateGuardianData) => {
    createGuardianMutation.mutate(values);
  };

  return (
    <CreateForm formSchema={CreateGuardianFormSchema()} onFinish={handleSubmit}>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          {t("create")}
        </Button>
      </Form.Item>
    </CreateForm>
  );
};

export default CreateGuardianPage;
