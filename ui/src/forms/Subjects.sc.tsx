import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";
import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "@/api/employees";
import type { Employee } from "@/api/employees";

export const CreateSubjectFormSchema = (): FormSchema[] => {
  const t = useTranslate("subjects");

  // Teachers options (employees). We fetch a large page and map by name
  const { data: employeesRes } = useQuery({
    queryKey: ["employees", "dropdown"],
    queryFn: async () => {
      const res = await employeesApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const teacherOptions = (
    Array.isArray(employeesRes) ? (employeesRes as Employee[]) : []
  ).map((e: Employee) => ({ label: e.name, value: e.id }));
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
      name: "teachers",
      type: "select",
      rules: yup.array().nullable().notRequired(),
      selectProps: {
        mode: "multiple",
        placeholder: t("placeholder.teachers"),
        options: teacherOptions,
      },
    },
  ];
};

export const UpdateSubjectFormSchema = (): FormSchema[] => {
  const t = useTranslate("subjects");
  // Teachers options (employees)
  const { data: employeesRes } = useQuery({
    queryKey: ["employees", "dropdown"],
    queryFn: async () => {
      const res = await employeesApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const teacherOptions = (
    Array.isArray(employeesRes) ? (employeesRes as Employee[]) : []
  ).map((e: Employee) => ({ label: e.name, value: e.id }));
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
      name: "teachers",
      type: "select",
      rules: yup.array().nullable().notRequired(),
      selectProps: {
        mode: "multiple",
        placeholder: t("placeholder.teachers"),
        options: teacherOptions,
      },
    },
  ];
};
