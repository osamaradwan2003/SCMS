import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";
import { useQuery } from "@tanstack/react-query";
import { classesApi } from "@/api/classes";
import { guardiansApi } from "@/api/guardians";
import { subscriptionsApi } from "@/api/subscriptions";
import type { Class } from "@/api/classes";
import type { Subscription } from "@/api/subscriptions";

export const CreateStudentFormSchema = (): FormSchema[] => {
  const t = useTranslate("students");

  // Classes options
  const { data: classesRes } = useQuery({
    queryKey: ["classes", "list"],
    queryFn: async () => {
      const res = await classesApi.getList();
      return res.data || [];
    },
  });
  const classOptions = (
    Array.isArray(classesRes) ? (classesRes as Class[]) : []
  ).map((c: Class) => ({ label: c.name, value: c.id }));

  // Guardians options
  const { data: guardiansRes } = useQuery({
    queryKey: ["guardians", "paginated"],
    queryFn: async () => {
      const res = await guardiansApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const guardianOptions = (
    Array.isArray(guardiansRes) ? guardiansRes : []
  ).map((g: { id: string; name: string }) => ({ 
    label: g.name, 
    value: g.id 
  }));

  // Subscriptions options
  const { data: subscriptionsRes } = useQuery({
    queryKey: ["subscriptions", "list"],
    queryFn: async () => {
      const res = await subscriptionsApi.getList();
      return res.data || [];
    },
  });
  const subscriptionOptions = (
    Array.isArray(subscriptionsRes) ? (subscriptionsRes as Subscription[]) : []
  ).map((s: Subscription) => ({ label: s.name, value: s.id }));

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
    // dob (required)
    {
      name: "dob",
      type: "date",
      rules: yup.date().required(t("validation.dob_required")),
      inputProps: {
        placeholder: t("placeholder.dob"),
      },
    },
    // phone (optional)
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
    // gender (optional, max 10 chars)
    {
      name: "gender",
      type: "select",
      rules: yup
        .string()
        .max(10, t("validation.gender_max_length"))
        .oneOf(["male", "female"], t("validation.gender_invalid"))
        .nullable()
        .notRequired(),
      selectProps: {
        placeholder: t("placeholder.gender"),
        options: [
          { label: t("gender_options.male"), value: "male" },
          { label: t("gender_options.female"), value: "female" },
        ],
        allowClear: true,
      },
    },
    // address (required)
    {
      name: "address",
      type: "textarea",
      rules: yup.string().required(t("validation.address_required")),
      textareaProps: {
        placeholder: t("placeholder.address"),
        rows: 2,
      },
    },
    // classId (optional)
    {
      name: "classId",
      type: "select",
      rules: yup.string().nullable().notRequired(),
      selectProps: {
        placeholder: t("placeholder.classId"),
        options: classOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    // guardianId (required)
    {
      name: "guardianId",
      type: "select",
      rules: yup.string().required(t("validation.guardianId_required")),
      selectProps: {
        placeholder: t("placeholder.guardianId"),
        options: guardianOptions,
        showSearch: true,
      },
    },
    // guradianDegree (required) - Note: schema has typo "guradianDegree"
    {
      name: "guradianDegree",
      type: "select",
      rules: yup.string().required(t("validation.relationship_required")),
      selectProps: {
        placeholder: t("placeholder.relationship"),
        options: [
          { label: t("relationship_options.father"), value: "Father" },
          { label: t("relationship_options.mother"), value: "Mother" },
          { label: t("relationship_options.grandfather"), value: "Grandfather" },
          { label: t("relationship_options.grandmother"), value: "Grandmother" },
          { label: t("relationship_options.uncle"), value: "Uncle" },
          { label: t("relationship_options.aunt"), value: "Aunt" },
          { label: t("relationship_options.brother"), value: "Brother" },
          { label: t("relationship_options.sister"), value: "Sister" },
          { label: t("relationship_options.other"), value: "Other" },
        ],
      },
    },
    // subscriptionsId (required)
    {
      name: "subscriptionsId",
      type: "select",
      rules: yup.string().required(t("validation.subscriptionsId_required")),
      selectProps: {
        placeholder: t("placeholder.subscriptionsId"),
        options: subscriptionOptions,
        showSearch: true,
      },
    },
    // image (optional)
    {
      name: "image",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "image",
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
        label: t("fields.image"),
        help: t("help.image"),
        className: "item-file-upload",
      },
      inputProps: {
        placeholder: t("buttons.upload"),
      },
    },
    // docs (optional)
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
  ];
};

export const UpdateStudentFormSchema = (): FormSchema[] => {
  const t = useTranslate("students");

  // Classes options
  const { data: classesRes } = useQuery({
    queryKey: ["classes", "list"],
    queryFn: async () => {
      const res = await classesApi.getList();
      return res.data || [];
    },
  });
  const classOptions = (
    Array.isArray(classesRes) ? (classesRes as Class[]) : []
  ).map((c: Class) => ({ label: c.name, value: c.id }));

  // Guardians options
  const { data: guardiansRes } = useQuery({
    queryKey: ["guardians", "paginated"],
    queryFn: async () => {
      const res = await guardiansApi.getAll({ page: 1, limit: 1000 });
      return res.data.data || [];
    },
  });
  const guardianOptions = (
    Array.isArray(guardiansRes) ? guardiansRes : []
  ).map((g: { id: string; name: string }) => ({ 
    label: g.name, 
    value: g.id 
  }));

  // Subscriptions options
  const { data: subscriptionsRes } = useQuery({
    queryKey: ["subscriptions", "list"],
    queryFn: async () => {
      const res = await subscriptionsApi.getList();
      return res.data || [];
    },
  });
  const subscriptionOptions = (
    Array.isArray(subscriptionsRes) ? (subscriptionsRes as Subscription[]) : []
  ).map((s: Subscription) => ({ label: s.name, value: s.id }));

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
    // dob (required)
    {
      name: "dob",
      type: "date",
      rules: yup.date().required(t("validation.dob_required")),
      inputProps: {
        placeholder: t("placeholder.dob"),
      },
    },
    // phone (optional)
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
    // gender (optional, max 10 chars)
    {
      name: "gender",
      type: "select",
      rules: yup
        .string()
        .max(10, t("validation.gender_max_length"))
        .oneOf(["male", "female"], t("validation.gender_invalid"))
        .nullable()
        .notRequired(),
      selectProps: {
        placeholder: t("placeholder.gender"),
        options: [
          { label: t("gender_options.male"), value: "male" },
          { label: t("gender_options.female"), value: "female" },
        ],
        allowClear: true,
      },
    },
    // address (required)
    {
      name: "address",
      type: "textarea",
      rules: yup.string().required(t("validation.address_required")),
      textareaProps: {
        placeholder: t("placeholder.address"),
        rows: 2,
      },
    },
    // classId (optional)
    {
      name: "classId",
      type: "select",
      rules: yup.string().nullable().notRequired(),
      selectProps: {
        placeholder: t("placeholder.classId"),
        options: classOptions,
        allowClear: true,
        showSearch: true,
      },
    },
    // guardianId (required)
    {
      name: "guardianId",
      type: "select",
      rules: yup.string().required(t("validation.guardianId_required")),
      selectProps: {
        placeholder: t("placeholder.guardianId"),
        options: guardianOptions,
        showSearch: true,
      },
    },
    // guradianDegree (required) - Note: schema has typo "guradianDegree"
    {
      name: "guradianDegree",
      type: "select",
      rules: yup.string().required(t("validation.relationship_required")),
      selectProps: {
        placeholder: t("placeholder.relationship"),
        options: [
          { label: t("relationship_options.father"), value: "Father" },
          { label: t("relationship_options.mother"), value: "Mother" },
          { label: t("relationship_options.grandfather"), value: "Grandfather" },
          { label: t("relationship_options.grandmother"), value: "Grandmother" },
          { label: t("relationship_options.uncle"), value: "Uncle" },
          { label: t("relationship_options.aunt"), value: "Aunt" },
          { label: t("relationship_options.brother"), value: "Brother" },
          { label: t("relationship_options.sister"), value: "Sister" },
          { label: t("relationship_options.other"), value: "Other" },
        ],
      },
    },
    // subscriptionsId (required)
    {
      name: "subscriptionsId",
      type: "select",
      rules: yup.string().required(t("validation.subscriptionsId_required")),
      selectProps: {
        placeholder: t("placeholder.subscriptionsId"),
        options: subscriptionOptions,
        showSearch: true,
      },
    },
    // image (optional)
    {
      name: "image",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "image",
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
        label: t("fields.image"),
        help: t("help.image"),
        className: "item-file-upload",
      },
      inputProps: {
        placeholder: t("buttons.upload"),
      },
    },
    // docs (optional)
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
  ];
};
