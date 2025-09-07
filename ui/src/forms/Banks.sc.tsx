import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateBankFormSchema = (): FormSchema[] => {
  const t = useTranslate("banks");
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
      name: "accountNumber",
      type: "input",
      rules: yup.string().required(t("validation.account_number_required")),
      inputProps: {
        placeholder: t("placeholder.accountNumber"),
      },
    },
    {
      name: "balance",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.balance_required"))
        .min(0, t("validation.balance_min")),
      inputProps: {
        placeholder: t("placeholder.balance"),
        min: 0,
        step: 0.01,
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
  ];
};

export const UpdateBankFormSchema = (): FormSchema[] => {
  const t = useTranslate("banks");
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
      name: "accountNumber",
      type: "input",
      rules: yup.string().required(t("validation.account_number_required")),
      inputProps: {
        placeholder: t("placeholder.accountNumber"),
      },
    },
    {
      name: "balance",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.balance_required"))
        .min(0, t("validation.balance_min")),
      inputProps: {
        placeholder: t("placeholder.balance"),
        min: 0,
        step: 0.01,
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
  ];
};
