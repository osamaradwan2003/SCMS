import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateClassFormSchema = (): FormSchema[] => {
  const t = useTranslate("classes");
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
      name: "capacity",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.capacity_required"))
        .min(1, t("validation.capacity_min"))
        .max(100, t("validation.capacity_max")),
      inputProps: {
        placeholder: t("placeholder.capacity"),
        min: 1,
        max: 100,
      },
    },
    {
      name: "teacherId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.teacher_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.teacherId"),
        options: [],
      },
    },
    {
      name: "subjects",
      type: "multiSelect",
      rules: yup.array().nullable().notRequired(),
      selectProps: {
        mode: "multiple",
        placeholder: t("placeholder.subjects"),
        options: [],
      },
    },
  ];
};

export const UpdateClassFormSchema = (): FormSchema[] => {
  const t = useTranslate("classes");
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
      name: "capacity",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.capacity_required"))
        .min(1, t("validation.capacity_min"))
        .max(100, t("validation.capacity_max")),
      inputProps: {
        placeholder: t("placeholder.capacity"),
        min: 1,
        max: 100,
      },
    },
    {
      name: "teacherId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.teacher_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.teacherId"),
        options: [],
      },
    },
    {
      name: "subjects",
      type: "multiSelect",
      rules: yup.array().nullable().notRequired(),
      selectProps: {
        mode: "multiple",
        placeholder: t("placeholder.subjects"),
        options: [],
      },
    },
  ];
};
