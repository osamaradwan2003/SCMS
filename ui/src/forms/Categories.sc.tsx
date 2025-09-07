import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateCategoryFormSchema = (): FormSchema[] => {
  const t = useTranslate("categories");
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
      name: "description",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
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
      name: "calculationMethod",
      type: "select",
      rules: yup.string().required(t("validation.calculation_method_required")),
      selectProps: {
        placeholder: t("placeholder.calculationMethod"),
        options: [
          { label: t("calculation_options.fixed"), value: "fixed" },
          { label: t("calculation_options.percentage"), value: "percentage" },
          { label: t("calculation_options.hourly"), value: "hourly" },
        ],
      },
    },
  ];
};

export const UpdateCategoryFormSchema = (): FormSchema[] => {
  const t = useTranslate("categories");
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
      name: "description",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
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
      name: "calculationMethod",
      type: "select",
      rules: yup.string().required(t("validation.calculation_method_required")),
      selectProps: {
        placeholder: t("placeholder.calculationMethod"),
        options: [
          { label: t("calculation_options.fixed"), value: "fixed" },
          { label: t("calculation_options.percentage"), value: "percentage" },
          { label: t("calculation_options.hourly"), value: "hourly" },
        ],
      },
    },
  ];
};
