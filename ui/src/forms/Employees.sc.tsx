import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";
import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "@/api/employees";
import { departmentsApi } from "@/api/departments";
import type { Employee } from "@/api/employees";
import type { Department } from "@/api/departments";

export const CreateEmployeeFormSchema = (): FormSchema[] => {
  const t = useTranslate("employees");

  // Departments options
  const { data: departmentsRes } = useQuery({
    queryKey: ["departments", "list"],
    queryFn: async () => {
      const res = await departmentsApi.getList();
      return res.data || [];
    },
  });
  const departmentOptions = (
    Array.isArray(departmentsRes) ? (departmentsRes as Department[]) : []
  ).map((d: Department) => ({ label: d.name, value: d.id }));

  // Managers options (employees who can be managers)
  const { data: employeesRes } = useQuery({
    queryKey: ["employees", "managers"],
    queryFn: async () => {
      const res = await employeesApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const managerOptions = (
    Array.isArray(employeesRes) ? (employeesRes as Employee[]) : []
  ).map((e: Employee) => ({ label: e.name, value: e.id }));

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
    // email (optional)
    {
      name: "email",
      type: "input",
      rules: yup
        .string()
        .email(t("validation.email_invalid"))
        .nullable()
        .notRequired(),
      inputProps: {
        placeholder: t("placeholder.email"),
        type: "email",
      },
    },
    // phone (optional)
    {
      name: "phone",
      type: "input",
      rules: yup.string().nullable().notRequired(),
      inputProps: {
        placeholder: t("placeholder.phone"),
      },
    },
    // address (optional)
    {
      name: "address",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.address"),
        rows: 2,
      },
    },
    // position (required)
    {
      name: "position",
      type: "input",
      rules: yup.string().required(t("validation.position_required")),
      inputProps: {
        placeholder: t("placeholder.position"),
      },
    },
    // departmentId (optional)
    {
      name: "departmentId",
      type: "select",
      rules: yup.string().nullable().notRequired(),
      selectProps: {
        placeholder: t("placeholder.department"),
        options: departmentOptions,
        allowClear: true,
      },
    },
    // hireDate (required)
    {
      name: "hireDate",
      type: "date",
      rules: yup.date().required(t("validation.hireDate_required")),
      inputProps: {
        placeholder: t("placeholder.hireDate"),
      },
    },
    // status (required, enum)
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.active"), value: "active" },
          { label: t("status_options.inactive"), value: "inactive" },
          { label: t("status_options.terminated"), value: "terminated" },
          { label: t("status_options.on_leave"), value: "on_leave" },
        ],
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
    // salary (required, >= 0)
    {
      name: "salary",
      type: "number",
      rules: yup
        .number()
        .typeError(t("validation.salary_number"))
        .required(t("validation.salary_required"))
        .min(0, t("validation.salary_min")),
      inputProps: {
        placeholder: t("placeholder.salary"),
        min: 0,
        step: 0.01,
      },
    },
    // is_teacher (optional)
    // profile_image (optional)
    {
      name: "profile_image",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "profile_image",
        listType: "picture",
        maxCount: 1,
        multiple: false,
        accept: "image/*",
        beforeUpload: () => false, // Prevent auto upload
        showUploadList: {
          showPreviewIcon: true,
          showRemoveIcon: true,
        },
      },
      fieldProps: {
        label: t("fields.profile_image"),
        help: t("help.profile_image"),
        className: "item-file-upload",
      },
      inputProps: {
        placeholder: t("buttons.upload"),
      },
    },
    // docs (optional, multiple)
    {
      name: "docs",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        children: t("buttons.upload"),
        name: "docs",
        listType: "picture",
        maxCount: 10,
        multiple: true,
        accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
        beforeUpload: () => false, // Prevent auto upload
        showUploadList: {
          showPreviewIcon: false,
          showRemoveIcon: true,
        },
      },
      fieldProps: {
        label: t("fields.docs"),
        help: t("help.docs"),
        className: "item-file-upload",
      },
      inputProps: {
        placeholder: t("buttons.upload"),
      },
    },
    // is_teacher (optional)
    {
      name: "is_teacher",
      type: "switch",
      rules: yup.boolean().notRequired(),
      fieldProps: {
        label: t("fields.is_teacher"),
        help: t("help.is_teacher"),
      },
      switchProps: {
        checkedChildren: t("labels.yes"),
        unCheckedChildren: t("labels.no"),
      },
    },
  ];
};

export const UpdateEmployeeFormSchema = (): FormSchema[] => {
  const t = useTranslate("employees");

  // Departments options
  const { data: departmentsRes } = useQuery({
    queryKey: ["departments", "list"],
    queryFn: async () => {
      const res = await departmentsApi.getList();
      return res.data || [];
    },
  });
  const departmentOptions = (
    Array.isArray(departmentsRes) ? (departmentsRes as Department[]) : []
  ).map((d: Department) => ({ label: d.name, value: d.id }));

  // Managers options (employees who can be managers)
  const { data: employeesRes } = useQuery({
    queryKey: ["employees", "managers"],
    queryFn: async () => {
      const res = await employeesApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const managerOptions = (
    Array.isArray(employeesRes) ? (employeesRes as Employee[]) : []
  ).map((e: Employee) => ({ label: e.name, value: e.id }));
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
    // email (optional)
    {
      name: "email",
      type: "input",
      rules: yup
        .string()
        .email(t("validation.email_invalid"))
        .nullable()
        .notRequired(),
      inputProps: {
        placeholder: t("placeholder.email"),
        type: "email",
      },
    },
    // phone (optional)
    {
      name: "phone",
      type: "input",
      rules: yup.string().nullable().notRequired(),
      inputProps: {
        placeholder: t("placeholder.phone"),
      },
    },
    // address (optional)
    {
      name: "address",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.address"),
        rows: 2,
      },
    },
    // position (required)
    {
      name: "position",
      type: "input",
      rules: yup.string().required(t("validation.position_required")),
      inputProps: {
        placeholder: t("placeholder.position"),
      },
    },
    // departmentId (optional)
    {
      name: "departmentId",
      type: "select",
      rules: yup.string().nullable().notRequired(),
      selectProps: {
        placeholder: t("placeholder.department"),
        options: departmentOptions,
        allowClear: true,
      },
    },
    // hireDate (required)
    {
      name: "hireDate",
      type: "date",
      rules: yup.date().required(t("validation.hireDate_required")),
      inputProps: {
        placeholder: t("placeholder.hireDate"),
      },
    },
    // status (required, enum)
    {
      name: "status",
      type: "select",
      rules: yup.string().required(t("validation.status_required")),
      selectProps: {
        placeholder: t("placeholder.status"),
        options: [
          { label: t("status_options.active"), value: "active" },
          { label: t("status_options.inactive"), value: "inactive" },
          { label: t("status_options.terminated"), value: "terminated" },
          { label: t("status_options.on_leave"), value: "on_leave" },
        ],
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
    // salary (required, >= 0)
    {
      name: "salary",
      type: "number",
      rules: yup
        .number()
        .typeError(t("validation.salary_number"))
        .required(t("validation.salary_required"))
        .min(0, t("validation.salary_min")),
      inputProps: {
        placeholder: t("placeholder.salary"),
        min: 0,
        step: 0.01,
      },
    },
    // profile_image (optional)
    {
      name: "profile_image",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "profile_image",
        listType: "picture",
        maxCount: 1,
        multiple: false,
        accept: "image/*",
        beforeUpload: () => false,
        showUploadList: {
          showPreviewIcon: true,
          showRemoveIcon: true,
        },
      },
      fieldProps: {
        label: t("fields.profile_image"),
        help: t("help.profile_image"),
        className: "item-file-upload",
      },
      inputProps: {
        placeholder: t("buttons.upload"),
      },
    },
    // docs (optional, multiple)
    {
      name: "docs",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        children: t("buttons.upload"),
        name: "docs",
        listType: "picture",
        maxCount: 10,
        multiple: true,
        accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
        beforeUpload: () => false,
        showUploadList: {
          showPreviewIcon: false,
          showRemoveIcon: true,
        },
      },
      fieldProps: {
        label: t("fields.docs"),
        help: t("help.docs"),
        className: "item-file-upload",
      },
      inputProps: {
        placeholder: t("buttons.upload"),
      },
    },
    // is_teacher (optional)
    {
      name: "is_teacher",
      type: "switch",
      rules: yup.boolean().notRequired(),
      fieldProps: {
        label: t("fields.is_teacher"),
        help: t("help.is_teacher"),
      },
      switchProps: {
        checkedChildren: t("labels.yes"),
        unCheckedChildren: t("labels.no"),
      },
    },
  ];
};
