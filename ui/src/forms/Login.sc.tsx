import { type FormSchema } from "@/@types";
import * as yup from "yup";
import i18n from "@/i18n";
const t = i18n.t;

const LoginForm: FormSchema[] = [
  {
    name: "username",
    type: "username",
    inputProps: { placeholder: t("auth:username_placeholder") },
    rules: new yup.StringSchema()
      .required(t("auth:username_required"))
      .min(4, t("auth:username_min"))
      .max(36, t("auth:username_max")),
  },
  {
    name: "password",
    type: "password",
    inputProps: { placeholder: t("auth:password_placeholder") },
    rules: new yup.StringSchema()
      .required(t("auth:password_required"))
      .min(8, t("password_min"))
      .max(36, t("auth:password_max")),
  },
];

export default LoginForm;
