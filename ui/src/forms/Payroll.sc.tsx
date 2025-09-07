import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreatePayrollFormSchema = (): FormSchema[] => {
  const t = useTranslate("payroll");
  return [
    {
      name: "employeeId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.employee_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.employee"),
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
      name: "month",
      type: "date",
      rules: yup.date().required(t("validation.month_required")),
      inputProps: {
        placeholder: t("placeholder.month"),
        picker: "month",
      },
    },
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.pending"), value: "pending" },
          { label: t("status_options.paid"), value: "paid" },
          { label: t("status_options.cancelled"), value: "cancelled" },
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

export const UpdatePayrollFormSchema = (): FormSchema[] => {
  const t = useTranslate("payroll");
  return [
    {
      name: "employeeId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.employee_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.employee"),
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
      name: "month",
      type: "date",
      rules: yup.date().required(t("validation.month_required")),
      inputProps: {
        placeholder: t("placeholder.month"),
        picker: "month",
      },
    },
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.pending"), value: "pending" },
          { label: t("status_options.paid"), value: "paid" },
          { label: t("status_options.cancelled"), value: "cancelled" },
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
