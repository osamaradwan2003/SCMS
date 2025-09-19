import React from "react";
import {
  Card,
  Descriptions,
  Button,
  Space,
  message,
  Avatar,
  Tag,
  Divider,
  Row,
  Col,
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation } from "@tanstack/react-query";
import { studentsApi } from "@/api/students";
import dayjs from "dayjs";

const ViewStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("students");

  // Fetch student details
  const {
    data: student,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      if (!id) throw new Error("Student ID is required");
      const res = await studentsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Student ID is required");
      return studentsApi.delete(id);
    },
    onSuccess: () => {
      message.success(t("messages.delete_success"));
      navigate("/students");
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      message.error(
        apiError.response?.data?.message ||
          apiError.message ||
          t("messages.delete_error")
      );
    },
  });

  const handleDelete = () => {
    deleteStudentMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card loading />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center">
            <h3>{t("messages.not_found")}</h3>
            <Button onClick={() => navigate("/students")}>
              {t("buttons.back_to_list")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/students")}
        >
          {t("buttons.back")}
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Student Profile Card */}
        <Col xs={24} lg={8}>
          <Card className="text-center">
            <Avatar
              size={120}
              src={
                student.image
                  ? `${import.meta.env.VITE_API_STATIC_URL}${student.image}`
                  : undefined
              }
              icon={!student.image ? <UserOutlined /> : undefined}
              className="mb-4"
            />
            <h2 className="mb-2">{student.name}</h2>
            {student.gender && (
              <Tag
                color={student.gender === "male" ? "blue" : "pink"}
                className="mb-4"
              >
                {t(`gender_options.${student.gender}`)}
              </Tag>
            )}

            <Divider />

            <Space direction="vertical" className="w-full">
              {student.phone && (
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  <span>{student.phone}</span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarOutlined className="mr-2" />
                <span>{dayjs(student.dob).format("YYYY-MM-DD")}</span>
              </div>
              <div className="flex items-center">
                <HomeOutlined className="mr-2" />
                <span>{student.address}</span>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Student Details Card */}
        <Col xs={24} lg={16}>
          <Card
            title={t("view")}
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/students/${id}/edit`)}
                >
                  {t("buttons.edit")}
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleteStudentMutation.isPending}
                  onClick={() => {
                    if (window.confirm(t("messages.delete_description"))) {
                      handleDelete();
                    }
                  }}
                >
                  {t("buttons.delete")}
                </Button>
              </Space>
            }
          >
            <Descriptions column={1} bordered>
              <Descriptions.Item label={t("fields.name")}>
                {student.name}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.dob")}>
                {dayjs(student.dob).format("YYYY-MM-DD")}
                <span className="text-gray-500 ml-2">
                  ({dayjs().diff(dayjs(student.dob), "year")} {t("years_old")})
                </span>
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.gender")}>
                {student.gender ? (
                  <Tag color={student.gender === "male" ? "blue" : "pink"}>
                    {t(`gender_options.${student.gender}`)}
                  </Tag>
                ) : (
                  "-"
                )}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.phone")}>
                {student.phone || "-"}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.address")}>
                {student.address}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.classId")}>
                {student.class ? (
                  <Tag color="green">{student.class.name}</Tag>
                ) : (
                  <Tag color="default">{t("no_class")}</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.guardianId")}>
                {student.Guardian ? (
                  <div>
                    <div className="font-medium">{student.Guardian.name}</div>
                    <div className="text-sm text-gray-500">
                      {t("relationship")}: {student.guradianDegree}
                    </div>
                  </div>
                ) : (
                  <Tag color="default">{t("no_guardian")}</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.subscriptionsId")}>
                {student.Subscriptions ? (
                  <div>
                    <div className="font-medium">
                      {student.Subscriptions.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${student.Subscriptions.value}
                    </div>
                  </div>
                ) : (
                  <Tag color="default">{t("no_subscription")}</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.created_at")}>
                {dayjs(student.created_at).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>

              <Descriptions.Item label={t("fields.updated_at")}>
                {dayjs(student.updated_at).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Documents Section */}
      {student.docs && (
        <Row className="mt-6">
          <Col span={24}>
            <Card title={t("fields.docs")}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {student.docs.split(",").map((doc, index) => (
                  <div key={index} className="border rounded p-2">
                    <Image
                      src={`${
                        import.meta.env.VITE_API_STATIC_URL
                      }${doc.trim()}`}
                      alt={`Document ${index + 1}`}
                      className="w-full h-32 object-cover"
                      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ViewStudentPage;
