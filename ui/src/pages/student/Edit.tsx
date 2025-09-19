import React from "react";
import { Button, Typography, message, Card } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslate } from "@/hooks/locales";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi, type UpdateStudentData } from "@/api/students";
import { UpdateStudentFormSchema } from "@/forms/Student.sc";
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

const EditStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const t = useTranslate("students");
  const queryClient = useQueryClient();

  // Fetch student data for editing
  const { data: student, isLoading } = useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      if (!id) throw new Error("Student ID is required");
      const res = await studentsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (data: UpdateStudentData) => {
      if (!id) throw new Error("Student ID is required");
      return studentsApi.update(id, data);
    },
    onSuccess: () => {
      message.success(t("messages.update_success"));
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
      navigate(`/students/${id}`);
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      message.error(apiError.response?.data?.message || apiError.message || t("messages.update_error"));
    },
  });

  const studentFormSchema = UpdateStudentFormSchema();

  const handleForm = (values: StudentFormValues) => {
    // Transform form data to match API expectations
    const formData: UpdateStudentData = {
      name: values.name,
      dob: values.dob ? new Date(values.dob).toISOString() : undefined,
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

    updateStudentMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card loading />
      </div>
    );
  }

  if (!student) {
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

  // Prepare initial values for the form
  const initialValues = {
    name: student.name,
    dob: student.dob,
    phone: student.phone || "",
    gender: student.gender || undefined,
    address: student.address,
    classId: student.classId || undefined,
    guardianId: student.guardianId,
    guradianDegree: student.guradianDegree,
    subscriptionsId: student.subscriptionsId,
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/students/${id}`)}
        >
          {t("buttons.back")}
        </Button>
      </div>

      <Card>
        <Typography.Title level={2} className="text-center mb-6">
          {t("edit")}
        </Typography.Title>
        
        <CreateForm
          onFinish={handleForm}
          encType="multipart/form-data"
          className="default-form-style"
          formSchema={studentFormSchema}
          initialValues={initialValues}
        >
          <div className="flex gap-4 justify-end">
            <Button 
              onClick={() => navigate(`/students/${id}`)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateStudentMutation.isPending}
            >
              {t("buttons.save")}
            </Button>
          </div>
        </CreateForm>
      </Card>
    </div>
  );
};

export default EditStudentPage;
