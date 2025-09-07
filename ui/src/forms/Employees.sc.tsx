import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateEmployeeFormSchema = (): FormSchema[] => {
  const t = useTranslate("employees");
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
      name: "email",
      type: "input",
      rules: yup
        .string()
        .email(t("validation.email_invalid"))
        .required(t("validation.email_required")),
      inputProps: {
        placeholder: t("placeholder.email"),
        type: "email",
      },
    },
    {
      name: "phone",
      type: "input",
      rules: yup
        .string()
        .matches(/^\+?\d{10,15}$/, t("validation.phone_invalid"))
        .nullable()
        .notRequired(),
      inputProps: {
        placeholder: t("placeholder.phone"),
      },
    },
    {
      name: "address",
      type: "input",
      rules: yup.string().required(t("validation.address_required")),
      inputProps: {
        placeholder: t("placeholder.address"),
      },
    },
    {
      name: "position",
      type: "input",
      rules: yup.string().required(t("validation.position_required")),
      inputProps: {
        placeholder: t("placeholder.position"),
      },
    },
    {
      name: "salary",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.salary_required"))
        .min(0.01, t("validation.salary_min")),
      inputProps: {
        placeholder: t("placeholder.salary"),
        min: 0,
        step: 0.01,
      },
    },
    {
      name: "hireDate",
      type: "date",
      rules: yup.date().required(t("validation.hire_date_required")),
      inputProps: {
        placeholder: t("placeholder.hireDate"),
      },
    },
    {
      name: "classId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.classId"),
        options: [],
        allowClear: true,
      },
    },
  ];
};

export const UpdateEmployeeFormSchema = (): FormSchema[] => {
  const t = useTranslate("employees");
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
      name: "email",
      type: "input",
      rules: yup
        .string()
        .email(t("validation.email_invalid"))
        .required(t("validation.email_required")),
      inputProps: {
        placeholder: t("placeholder.email"),
        type: "email",
      },
    },
    {
      name: "phone",
      type: "input",
      rules: yup
        .string()
        .matches(/^\+?\d{10,15}$/, t("validation.phone_invalid"))
        .nullable()
        .notRequired(),
      inputProps: {
        placeholder: t("placeholder.phone"),
      },
    },
    {
      name: "address",
      type: "input",
      rules: yup.string().required(t("validation.address_required")),
      inputProps: {
        placeholder: t("placeholder.address"),
      },
    },
    {
      name: "position",
      type: "input",
      rules: yup.string().required(t("validation.position_required")),
      inputProps: {
        placeholder: t("placeholder.position"),
      },
    },
    {
      name: "salary",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.salary_required"))
        .min(0.01, t("validation.salary_min")),
      inputProps: {
        placeholder: t("placeholder.salary"),
        min: 0,
        step: 0.01,
      },
    },
    {
      name: "hireDate",
      type: "date",
      rules: yup.date().required(t("validation.hire_date_required")),
      inputProps: {
        placeholder: t("placeholder.hireDate"),
      },
    },
    {
      name: "classId",
      type: "autoComplete",
      rules: yup.string().nullable().notRequired(),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.classId"),
        options: [],
        allowClear: true,
      },
    },
  ];
};
