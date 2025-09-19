import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "@/api/subjects";
import type { Subject as ApiSubject } from "@/api/subjects";

export const CreateClassFormSchema = (): FormSchema[] => {
  const t = useTranslate("classes");
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", "list"],
    queryFn: async () => {
      const res = await subjectsApi.getList();
      return res.data.data || [];
    },
  });
  const subjectOptions = subjects.map((s: ApiSubject) => ({
    label: `${s.name}`,
    value: s.id,
  }));
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
      name: "subjects",
      type: "select",
      rules: yup.array().nullable().notRequired(),
      selectProps: {
        mode: "multiple",
        placeholder: t("placeholder.subjects"),
        options: subjectOptions,
      },
    },
  ];
};

export const UpdateClassFormSchema = (): FormSchema[] => {
  const t = useTranslate("classes");
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", "list"],
    queryFn: async () => {
      const res = await subjectsApi.getList();
      return res.data.data || [];
    },
  });
  const subjectOptions = subjects.map((s: ApiSubject) => ({
    label: `${s.name} (${s.code})`,
    value: s.id,
  }));
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
      name: "subjects",
      type: "multiSelect",
      rules: yup.array().nullable().notRequired(),
      selectProps: {
        mode: "multiple",
        placeholder: t("placeholder.subjects"),
        options: subjectOptions,
      },
    },
  ];
};
