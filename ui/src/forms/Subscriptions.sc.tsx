import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateSubscriptionFormSchema = (): FormSchema[] => {
  const t = useTranslate("subscriptions");
  return [
    {
      name: "studentId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.student_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.student"),
        options: [],
      },
    },
    {
      name: "amount",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.amount_required"))
        .min(0.01, t("validation.amount_min")),
      inputProps: {
        placeholder: t("placeholder.amount"),
        min: 0,
        step: 0.01,
      },
    },
    {
      name: "startDate",
      type: "date",
      rules: yup.date().required(t("validation.startDate_required")),
      inputProps: {
        placeholder: t("placeholder.startDate"),
      },
    },
    {
      name: "endDate",
      type: "date",
      rules: yup.date().required(t("validation.endDate_required")),
      inputProps: {
        placeholder: t("placeholder.endDate"),
      },
    },
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.active"), value: "active" },
          { label: t("status_options.inactive"), value: "inactive" },
          { label: t("status_options.expired"), value: "expired" },
          { label: t("status_options.cancelled"), value: "cancelled" },
        ],
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

export const UpdateSubscriptionFormSchema = (): FormSchema[] => {
  const t = useTranslate("subscriptions");
  return [
    {
      name: "studentId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.student_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.student"),
        options: [],
      },
    },
    {
      name: "amount",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.amount_required"))
        .min(0.01, t("validation.amount_min")),
      inputProps: {
        placeholder: t("placeholder.amount"),
        min: 0,
        step: 0.01,
      },
    },
    {
      name: "startDate",
      type: "date",
      rules: yup.date().required(t("validation.startDate_required")),
      inputProps: {
        placeholder: t("placeholder.startDate"),
      },
    },
    {
      name: "endDate",
      type: "date",
      rules: yup.date().required(t("validation.endDate_required")),
      inputProps: {
        placeholder: t("placeholder.endDate"),
      },
    },
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.active"), value: "active" },
          { label: t("status_options.inactive"), value: "inactive" },
          { label: t("status_options.expired"), value: "expired" },
          { label: t("status_options.cancelled"), value: "cancelled" },
        ],
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
