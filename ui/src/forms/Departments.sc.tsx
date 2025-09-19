import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";
import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "@/api/employees";
import type { Employee } from "@/api/employees";

export const CreateDepartmentFormSchema = (): FormSchema[] => {
  const t = useTranslate("departments");
  
  // Managers options (employees who can be managers)
  const { data: employeesRes } = useQuery({
    queryKey: ["employees", "managers"],
    queryFn: async () => {
      const res = await employeesApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const managerOptions = (Array.isArray(employeesRes) ? (employeesRes as Employee[]) : []).map(
    (e: Employee) => ({ label: e.name, value: e.id })
  );

  return [
    // name (required)
    {
      name: "name",
      type: "input",
      rules: yup.string().required(t("validation.name_required")),
      inputProps: {
        placeholder: t("placeholder.name"),
      },
    },
    // description (optional)
    {
      name: "description",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
      },
    },
    // managerId (optional)
    {
      name: "managerId",
      type: "select",
      rules: yup.string().nullable().notRequired(),
      selectProps: {
        placeholder: t("placeholder.manager"),
        options: managerOptions,
        allowClear: true,
        showSearch: true,
      },
    },
  ];
};

export const UpdateDepartmentFormSchema = (): FormSchema[] => {
  const t = useTranslate("departments");
  
  // Managers options (employees who can be managers)
  const { data: employeesRes } = useQuery({
    queryKey: ["employees", "managers"],
    queryFn: async () => {
      const res = await employeesApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const managerOptions = (Array.isArray(employeesRes) ? (employeesRes as Employee[]) : []).map(
    (e: Employee) => ({ label: e.name, value: e.id })
  );

  return [
    // name (required)
    {
      name: "name",
      type: "input",
      rules: yup.string().required(t("validation.name_required")),
      inputProps: {
        placeholder: t("placeholder.name"),
      },
    },
    // description (optional)
    {
      name: "description",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.description"),
        rows: 3,
      },
    },
    // managerId (optional)
    {
      name: "managerId",
      type: "select",
      rules: yup.string().nullable().notRequired(),
      selectProps: {
        placeholder: t("placeholder.manager"),
        options: managerOptions,
        allowClear: true,
        showSearch: true,
      },
    },
  ];
};
