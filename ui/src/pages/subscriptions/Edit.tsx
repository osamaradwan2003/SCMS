import React from "react";
import { Card, Button, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/api/subscriptions";
import CreateForm from "@/components/Form/CreateForm";
import { UpdateSubscriptionFormSchema } from "@/forms/Subscriptions.sc";

interface UpdateSubscriptionFormValues {
  name: string;
  value: number;
  notes?: string;
}

const EditSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("subscriptions");
  const queryClient = useQueryClient();

  // Fetch subscription data
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscriptions", id],
    queryFn: async () => {
      if (!id) throw new Error("Subscription ID is required");
      const response = await subscriptionsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: (data: UpdateSubscriptionFormValues) => {
      if (!id) throw new Error("Subscription ID is required");
      return subscriptionsApi.update(id, data);
    },
    onSuccess: () => {
      message.success(t("messages.update_success"));
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      navigate(`/subscriptions/${id}`);
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.update_error"));
    },
  });

  const handleSubmit = (values: UpdateSubscriptionFormValues) => {
    updateSubscriptionMutation.mutate(values);
  };

  const formSchema = UpdateSubscriptionFormSchema();

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <h2>{t("messages.not_found")}</h2>
            <Button onClick={() => navigate("/subscriptions")}>
              {t("buttons.back_to_list")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/subscriptions/${id}`)}
          >
            {t("buttons.back")}
          </Button>
          <h1 className="text-2xl font-semibold m-0">
            {t("edit")} - {subscription.name}
          </h1>
        </div>

        <div className="max-w-2xl">
          <CreateForm
            formSchema={formSchema}
            onFinish={handleSubmit}
            initialValues={{
              name: subscription.name,
              value: subscription.value,
              notes: subscription.notes,
            }}
          >
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateSubscriptionMutation.isPending}
              block
            >
              {t("buttons.update")}
            </Button>
          </CreateForm>
        </div>
      </Card>
    </div>
  );
};

export default EditSubscriptionPage;
