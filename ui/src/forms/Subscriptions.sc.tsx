import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateSubscriptionFormSchema = (): FormSchema[] => {
  const t = useTranslate("subscriptions");
  return [
    {
      name: "name",
      type: "input",
      rules: yup.string().required(t("validation.name_required")),
      inputProps: {
        placeholder: t("placeholder.name"),
      },
    },
    {
      name: "value",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.value_required"))
        .min(0.01, t("validation.value_min")),
      inputProps: {
        placeholder: t("placeholder.value"),
        min: 0,
        step: 0.01,
      },
    },
    {
      name: "notes",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.notes"),
        rows: 3,
      },
    },
  ];
};

export const UpdateSubscriptionFormSchema = (): FormSchema[] => {
  const t = useTranslate("subscriptions");
  return [
    {
      name: "name",
      type: "input",
      rules: yup.string().required(t("validation.name_required")),
      inputProps: {
        placeholder: t("placeholder.name"),
      },
    },
    {
      name: "value",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.value_required"))
        .min(0.01, t("validation.value_min")),
      inputProps: {
        placeholder: t("placeholder.value"),
        min: 0,
        step: 0.01,
      },
    },
    {
      name: "notes",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.notes"),
        rows: 3,
      },
    },
  ];
};
