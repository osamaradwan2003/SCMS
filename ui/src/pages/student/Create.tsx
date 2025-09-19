import React from "react";
import { Button, Typography, message, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi, type CreateStudentData } from "@/api/students";
import { CreateStudentFormSchema } from "@/forms/Student.sc";
import CreateForm from "@/components/Form/CreateForm";

interface StudentFormValues {
  name: string;
  dob: string;
  phone?: string;
  gender?: string;
  address: string;
  classId?: string;
  guardianId: string;
  guradianDegree: string;
  subscriptionsId: string;
  image?: File[];
  docs?: File[];
}

const CreateStudent: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslate("students");
  const queryClient = useQueryClient();

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),
    onSuccess: (response) => {
      message.success(t("messages.create_success"));
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate(`/students/${response.data.id}`);
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.create_error"));
    },
  });

  const studentFormSchema = CreateStudentFormSchema();

  const handleForm = (values: StudentFormValues) => {
    // Transform form data to match API expectations
    const formData: CreateStudentData = {
      name: values.name,
      dob: new Date(values.dob).toISOString(),
      phone: values.phone || undefined,
      gender: values.gender || undefined,
      address: values.address,
      classId: values.classId || undefined,
      guardianId: values.guardianId,
      guradianDegree: values.guradianDegree,
      subscriptionsId: values.subscriptionsId,
    };

    // Handle file uploads if present
    if (values.image && values.image.length > 0) {
      // For now, we'll handle file uploads separately
      // This would typically involve uploading to a file service first
      console.log("Image files:", values.image);
    }

    if (values.docs && values.docs.length > 0) {
      console.log("Document files:", values.docs);
    }

    createStudentMutation.mutate(formData);
  };

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

      <Card>
        <Typography.Title level={2} className="text-center mb-6">
          {t("create")}
        </Typography.Title>
        
        <CreateForm
          onFinish={handleForm}
          encType="multipart/form-data"
          className="default-form-style"
          formSchema={studentFormSchema}
        >
          <div className="flex gap-4 justify-end">
            <Button onClick={() => navigate("/students")}>
              {t("buttons.cancel")}
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={createStudentMutation.isPending}
            >
              {t("buttons.create")}
            </Button>
          </div>
        </CreateForm>
      </Card>
    </div>
  );
};

export default CreateStudent;
