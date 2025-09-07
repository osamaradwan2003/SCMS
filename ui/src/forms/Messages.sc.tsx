import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateMessageFormSchema = (): FormSchema[] => {
  const t = useTranslate("messages");
  return [
    {
      name: "content",
      type: "textarea",
      rules: yup.string().required(t("validation.content_required")),
      textareaProps: {
        placeholder: t("placeholder.content"),
        rows: 5,
      },
    },
    {
      name: "recipientId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.recipient"),
        options: [],
        allowClear: true,
      },
    },
    {
      name: "type",
      type: "select",
      rules: yup.string().required(t("validation.type_required")),
      selectProps: {
        placeholder: t("placeholder.type"),
        options: [
          { label: t("type_options.private"), value: "private" },
          { label: t("type_options.bulk"), value: "bulk" },
          { label: t("type_options.report"), value: "report" },
        ],
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

export const UpdateMessageFormSchema = (): FormSchema[] => {
  const t = useTranslate("messages");
  return [
    {
      name: "content",
      type: "textarea",
      rules: yup.string().required(t("validation.content_required")),
      textareaProps: {
        placeholder: t("placeholder.content"),
        rows: 5,
      },
    },
    {
      name: "recipientId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.recipient"),
        options: [],
        allowClear: true,
      },
    },
    {
      name: "type",
      type: "select",
      rules: yup.string().required(t("validation.type_required")),
      selectProps: {
        placeholder: t("placeholder.type"),
        options: [
          { label: t("type_options.private"), value: "private" },
          { label: t("type_options.bulk"), value: "bulk" },
          { label: t("type_options.report"), value: "report" },
        ],
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
