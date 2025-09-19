import React, { useEffect } from "react";
import { Button, Card, message, Spin, Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { guardiansApi } from "@/api/guardians";
import { useTranslate } from "@/hooks/locales";
import type { Guardian, UpdateGuardianData } from "@/api/guardians";
import CreateForm from "@/components/Form/CreateForm";
import { UpdateGuardianFormSchema } from "@/forms/Guardians.sc";

const EditGuardianPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("guardians");
  const [form] = Form.useForm();

  const { data: guardian, isLoading } = useQuery({
    queryKey: ["guardian", id],
    queryFn: async () => {
      const response = await guardiansApi.getById(`${id}`);
      return response.data.data as Guardian;
    },
    enabled: !!id,
  });

  const updateGuardianMutation = useMutation({
    mutationFn: (data: UpdateGuardianData) =>
      guardiansApi.update(`${id}`, data),
    onSuccess: () => {
      message.success(t("messages.update_success"));
      navigate("/guardians");
    },
    onError: (error: Error) => {
      message.error(error.message || t("messages.update_error"));
    },
  });

  const formSchema = UpdateGuardianFormSchema();

  useEffect(() => {
    if (guardian) {
      form.setFieldsValue({
        name: guardian.name,
        phone: guardian.phone,
        email: guardian.email,
        address: guardian.address,
        profile_photo: guardian.profile_photo,
        documents: guardian.documents,
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
        <CreateForm
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          formSchema={formSchema}
        >
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
        </CreateForm>
      </Card>
    </div>
  );
};

export default EditGuardianPage;
