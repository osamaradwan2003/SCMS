import React from "react";
import { Card, Button, Descriptions, message, Spin, Popconfirm, Tag } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation } from "@tanstack/react-query";
import { subscriptionsApi } from "@/api/subscriptions";
import dayjs from "dayjs";


const ViewSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("subscriptions");

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

  // Delete subscription mutation
  const deleteSubscriptionMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Subscription ID is required");
      return subscriptionsApi.delete(id);
    },
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      navigate("/subscriptions");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.delete_error"));
    },
  });

  const handleDelete = () => {
    deleteSubscriptionMutation.mutate();
  };


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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/subscriptions")}
            >
              {t("buttons.back")}
            </Button>
            <h1 className="text-2xl font-semibold m-0">{subscription.name}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/subscriptions/${id}/edit`)}
            >
              {t("buttons.edit")}
            </Button>
            <Popconfirm
              title={t("messages.delete_confirm")}
              description={t("messages.delete_description")}
              onConfirm={handleDelete}
              okText={t("buttons.yes")}
              cancelText={t("buttons.no")}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={deleteSubscriptionMutation.isPending}
              >
                {t("buttons.delete")}
              </Button>
            </Popconfirm>
          </div>
        </div>

        {/* Subscription Details */}
        <Card title={t("details.subscription_info")} className="mb-6">
          <Descriptions bordered column={2}>
            <Descriptions.Item label={t("fields.name")}>
              <span className="font-medium">{subscription.name}</span>
            </Descriptions.Item>
            <Descriptions.Item label={t("fields.value")}>
              <span className="font-medium text-green-600 text-lg">
                ${typeof subscription.value === 'number' 
                  ? subscription.value.toFixed(2) 
                  : parseFloat(subscription.value).toFixed(2)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={t("fields.notes")} span={2}>
              {subscription.notes || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("fields.created_at")}>
              {dayjs(subscription.created_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label={t("fields.updated_at")}>
              {dayjs(subscription.updated_at).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Students with this subscription - Note: This would require a separate API call */}
        <Card 
          title={
            <div className="flex items-center gap-2">
              <span>{t("details.students_with_subscription")}</span>
              <Tag color="blue">0</Tag>
            </div>
          }
        >
          <div className="text-center py-8 text-gray-500">
            {t("messages.no_students")}
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default ViewSubscriptionPage;
