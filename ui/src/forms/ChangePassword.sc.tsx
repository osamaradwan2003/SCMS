import { type FormSchema } from "@/@types";
import * as yup from "yup";
import i18n from "@/i18n";
const t = i18n.t;

const ChangePasswordForm: FormSchema[] = [
  {
    name: "currentPassword",
    type: "password",
    inputProps: { placeholder: t("auth:current_password_placeholder", { defaultValue: "Current password" }) },
    rules: new yup.StringSchema()
      .required(t("auth:current_password_required", { defaultValue: "Current password is required" }))
      .min(6, t("auth:password_min", { defaultValue: "Minimum 6 characters" }))
      .max(72, t("auth:password_max", { defaultValue: "Maximum 72 characters" })),
  },
  {
    name: "newPassword",
    type: "password",
    inputProps: { placeholder: t("auth:new_password_placeholder", { defaultValue: "New password" }) },
    rules: new yup.StringSchema()
      .required(t("auth:new_password_required", { defaultValue: "New password is required" }))
      .min(6, t("auth:password_min", { defaultValue: "Minimum 6 characters" }))
      .max(72, t("auth:password_max", { defaultValue: "Maximum 72 characters" })),
  },
  {
    name: "confirmNewPassword",
    type: "password",
    inputProps: { placeholder: t("auth:confirm_new_password_placeholder", { defaultValue: "Confirm new password" }) },
    rules: new yup.StringSchema()
      .required(t("auth:confirm_new_password_required", { defaultValue: "Please confirm your new password" }))
      .min(6, t("auth:password_min", { defaultValue: "Minimum 6 characters" })),
  },
];

export default ChangePasswordForm;
