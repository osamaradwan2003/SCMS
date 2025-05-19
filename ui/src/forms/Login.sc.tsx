import { type FormSchema } from "@/@types";
import * as yup from "yup";

const LoginForm: FormSchema[] = [
  {
    name: "username",
    type: "username",
    inputProps: { placeholder: "Username" },
    rules: new yup.StringSchema()
      .min(4, "username to short")
      .max(36, "username to long"),
  },
  {
    name: "password",
    type: "password",
    inputProps: { placeholder: "Password" },
    rules: new yup.StringSchema()
      .min(8, "password to short")
      .max(36, "password to long"),
  },
  {
    name: "submit",
    type: "button",
    buttonProps: { children: "Login", type: "primary", block: true },
  },
];

export default LoginForm;
