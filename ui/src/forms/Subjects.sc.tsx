import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateSubjectFormSchema = (): FormSchema[] => {
  const t = useTranslate("subjects");
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
      name: "code",
      type: "input",
      rules: yup.string().required(t("validation.code_required")),
      inputProps: {
        placeholder: t("placeholder.code"),
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
      name: "credits",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.credits_required"))
        .min(1, t("validation.credits_min"))
        .max(10, t("validation.credits_max")),
      inputProps: {
        placeholder: t("placeholder.credits"),
        min: 1,
        max: 10,
      },
    },
    {
      name: "classId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.class_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.classId"),
        options: [],
      },
    },
  ];
};

export const UpdateSubjectFormSchema = (): FormSchema[] => {
  const t = useTranslate("subjects");
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
      name: "code",
      type: "input",
      rules: yup.string().required(t("validation.code_required")),
      inputProps: {
        placeholder: t("placeholder.code"),
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
      name: "credits",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.credits_required"))
        .min(1, t("validation.credits_min"))
        .max(10, t("validation.credits_max")),
      inputProps: {
        placeholder: t("placeholder.credits"),
        min: 1,
        max: 10,
      },
    },
    {
      name: "classId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.class_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.classId"),
        options: [],
      },
    },
  ];
};
