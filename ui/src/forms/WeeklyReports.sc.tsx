import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateWeeklyReportFormSchema = (): FormSchema[] => {
  const t = useTranslate("weeklyreports");
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
      name: "subjectId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.subject_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.subject"),
        options: [],
      },
    },
    {
      name: "week",
      type: "date",
      rules: yup.date().required(t("validation.week_required")),
      inputProps: {
        placeholder: t("placeholder.week"),
      },
    },
    {
      name: "score",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.score_required"))
        .min(0, t("validation.score_min"))
        .max(100, t("validation.score_max")),
      inputProps: {
        placeholder: t("placeholder.score"),
        min: 0,
        max: 100,
      },
    },
    {
      name: "strengths",
      type: "textarea",
      rules: yup.string().required(t("validation.strengths_required")),
      textareaProps: {
        placeholder: t("placeholder.strengths"),
        rows: 3,
      },
    },
    {
      name: "weaknesses",
      type: "textarea",
      rules: yup.string().required(t("validation.weaknesses_required")),
      textareaProps: {
        placeholder: t("placeholder.weaknesses"),
        rows: 3,
      },
    },
    {
      name: "adherence",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.adherence"),
        rows: 2,
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

export const UpdateWeeklyReportFormSchema = (): FormSchema[] => {
  const t = useTranslate("weeklyreports");
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
      name: "subjectId",
      type: "autoComplete",
      rules: yup.string().required(t("validation.subject_required")),
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.subject"),
        options: [],
      },
    },
    {
      name: "week",
      type: "date",
      rules: yup.date().required(t("validation.week_required")),
      inputProps: {
        placeholder: t("placeholder.week"),
      },
    },
    {
      name: "score",
      type: "number",
      rules: yup
        .number()
        .required(t("validation.score_required"))
        .min(0, t("validation.score_min"))
        .max(100, t("validation.score_max")),
      inputProps: {
        placeholder: t("placeholder.score"),
        min: 0,
        max: 100,
      },
    },
    {
      name: "strengths",
      type: "textarea",
      rules: yup.string().required(t("validation.strengths_required")),
      textareaProps: {
        placeholder: t("placeholder.strengths"),
        rows: 3,
      },
    },
    {
      name: "weaknesses",
      type: "textarea",
      rules: yup.string().required(t("validation.weaknesses_required")),
      textareaProps: {
        placeholder: t("placeholder.weaknesses"),
        rows: 3,
      },
    },
    {
      name: "adherence",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.adherence"),
        rows: 2,
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
