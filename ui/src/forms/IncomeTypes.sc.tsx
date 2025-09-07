import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateIncomeTypeFormSchema = (): FormSchema[] => {
  const t = useTranslate("incometypes");
  return [
    {
      name: "name",
      type: "input",
      rules: yup
        .string()
        .required(t("validation.name_required"))
        .min(2, t("validation.name_min"))
        .max(50, t("validation.name_max")),
      inputProps: {
        placeholder: t("placeholder.name"),
      },
    },
    {
      name: "description",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
      },
    },
    {
      name: "submit",
      type: "button",
      buttonProps: {
        type: "primary",
        htmlType: "submit",
        children: t("submit"),
      },
    },
  ];
};

export const UpdateIncomeTypeFormSchema = (): FormSchema[] => {
  const t = useTranslate("incometypes");
  return [
    {
      name: "name",
      type: "input",
      rules: yup
        .string()
        .required(t("validation.name_required"))
        .min(2, t("validation.name_min"))
        .max(50, t("validation.name_max")),
      inputProps: {
        placeholder: t("placeholder.name"),
      },
    },
    {
      name: "description",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
      },
    },
    {
      name: "submit",
      type: "button",
      buttonProps: {
        type: "primary",
        htmlType: "submit",
        children: t("update"),
      },
    },
  ];
};
