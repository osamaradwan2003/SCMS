import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateTransactionFormSchema = (): FormSchema[] => {
  const t = useTranslate("transactions");
  return [
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
      name: "description",
      type: "textarea",
      rules: yup.string().required(t("validation.description_required")),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
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
      name: "type",
      type: "select",
      rules: yup.string().required(t("validation.type_required")),
      selectProps: {
        placeholder: t("placeholder.type"),
        options: [
          { label: t("type_options.income"), value: "income" },
          { label: t("type_options.expense"), value: "expense" },
        ],
      },
    },
    {
      name: "bankId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.bank_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.bankId"),
        options: [],
      },
    },
    {
      name: "categoryId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.category_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.categoryId"),
        options: [],
      },
    },
    {
      name: "incomeTypeId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.incomeTypeId"),
        options: [],
        allowClear: true,
      },
    },
    {
      name: "expenseTypeId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.expenseTypeId"),
        options: [],
        allowClear: true,
      },
    },
  ];
};

export const UpdateTransactionFormSchema = (): FormSchema[] => {
  const t = useTranslate("transactions");
  return [
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
      name: "description",
      type: "textarea",
      rules: yup.string().required(t("validation.description_required")),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
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
      name: "type",
      type: "select",
      rules: yup.string().required(t("validation.type_required")),
      selectProps: {
        placeholder: t("placeholder.type"),
        options: [
          { label: t("type_options.income"), value: "income" },
          { label: t("type_options.expense"), value: "expense" },
        ],
      },
    },
    {
      name: "bankId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.bank_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.bankId"),
        options: [],
      },
    },
    {
      name: "categoryId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.category_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.categoryId"),
        options: [],
      },
    },
    {
      name: "incomeTypeId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.incomeTypeId"),
        options: [],
        allowClear: true,
      },
    },
    {
      name: "expenseTypeId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.expenseTypeId"),
        options: [],
        allowClear: true,
      },
    },
  ];
};
