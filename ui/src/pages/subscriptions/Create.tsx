import React from "react";
import { Card, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useMutation } from "@tanstack/react-query";
import { subscriptionsApi } from "@/api/subscriptions";
import CreateForm from "@/components/Form/CreateForm";
import { CreateSubscriptionFormSchema } from "@/forms/Subscriptions.sc";

interface CreateSubscriptionFormValues {
  name: string;
  value: number;
  notes?: string;
}

const CreateSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("subscriptions");

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: (data: CreateSubscriptionFormValues) => subscriptionsApi.create(data),
    onSuccess: (response) => {
      message.success(t("messages.create_success"));
      navigate(`/subscriptions/${response.data.id}`);
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.create_error"));
    },
  });

  const handleSubmit = (values: CreateSubscriptionFormValues) => {
    createSubscriptionMutation.mutate(values);
  };

  const formSchema = CreateSubscriptionFormSchema();

  return (
    <div className="p-6">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/subscriptions")}
          >
            {t("buttons.back")}
          </Button>
          <h1 className="text-2xl font-semibold m-0">{t("create")}</h1>
        </div>

        <div className="max-w-2xl">
          <CreateForm
            formSchema={formSchema}
            onFinish={handleSubmit}
          >
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={createSubscriptionMutation.isPending}
              block
            >
              {t("buttons.create")}
            </Button>
          </CreateForm>
        </div>
      </Card>
    </div>
  );
};

export default CreateSubscriptionPage;
