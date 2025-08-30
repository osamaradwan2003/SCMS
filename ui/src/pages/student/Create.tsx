import CreateForm from "@/components/Form/CreateForm";
import { CreateStudentFormSchema } from "@/forms/Student.sc";
import { useTranslate } from "@/hooks/locales";
import { Button, Typography } from "antd";
const CreateStudent = () => {
  const t = useTranslate("student");
  const studentFormSchema = CreateStudentFormSchema();
  const handleForm = (values: unknown) => {
    console.log(values);
  };
  return (
    <>
      <Typography.Title className="text-center">{t("submit")}</Typography.Title>
      <CreateForm
        onFinish={handleForm}
        encType="multipart/form-data"
        className="default-form-style"
        formSchema={studentFormSchema}
      >
        <Button block type="primary" htmlType="submit" className="flex-grow">
          {t("submit")}
        </Button>
      </CreateForm>
    </>
  );
};

export default CreateStudent;
