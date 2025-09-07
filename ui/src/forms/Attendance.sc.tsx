import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateAttendanceFormSchema = (): FormSchema[] => {
  const t = useTranslate("attendance");
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
      name: "date",
      type: "date",
      rules: yup.date().required(t("validation.date_required")),
      inputProps: {
        placeholder: t("placeholder.date"),
      },
    },
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.present"), value: "present" },
          { label: t("status_options.absent"), value: "absent" },
          { label: t("status_options.late"), value: "late" },
          { label: t("status_options.excused"), value: "excused" },
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

export const UpdateAttendanceFormSchema = (): FormSchema[] => {
  const t = useTranslate("attendance");
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
      name: "date",
      type: "date",
      rules: yup.date().required(t("validation.date_required")),
      inputProps: {
        placeholder: t("placeholder.date"),
      },
    },
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.present"), value: "present" },
          { label: t("status_options.absent"), value: "absent" },
          { label: t("status_options.late"), value: "late" },
          { label: t("status_options.excused"), value: "excused" },
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
