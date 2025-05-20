import CreateForm from "@/components/Form/CreateForm";
import { useLogin } from "@/hooks/auth";
import { useTranslate } from "@/hooks/locales";
import { Button, Typography } from "antd";
import LoginSchema from "@/forms/Login.sc";
export default function Login() {
  const mutateFunc = useLogin();
  const t = useTranslate();
  return (
    <>
      <Typography.Title className="text-center">
        {" "}
        {t("auth:welcome")}{" "}
      </Typography.Title>
      <CreateForm
        onFinish={(values) => {
          mutateFunc.mutate(values);
        }}
        formSchema={LoginSchema}
        className="padding-2"
      >
        <Button type="primary" htmlType="submit" block>
          {t("auth:login")}
        </Button>
      </CreateForm>
    </>
  );
}
