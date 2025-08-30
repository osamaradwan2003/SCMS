import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { type UploadFile } from "antd";
import { useTranslate } from "@/hooks/locales";

export const CreateStudentFormSchema = (): FormSchema[] => {
  const t = useTranslate("student");
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
      name: "dob",
      type: "date",
      rules: yup.date().required(t("validation.dob_required")),
      inputProps: {
        placeholder: t("placeholder.dob"),
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
      name: "gender",
      type: "select",
      rules: yup
        .string()
        .required(t("validation.gender_required"))
        .oneOf(["male", "female"], t("validation.gender_invalid"))
        .nullable(),
      selectProps: {
        placeholder: t("placeholder.gender"),
        options: [
          { label: t("gender_options.male"), value: "male" },
          { label: t("gender_options.female"), value: "female" },
        ],
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
      name: "classId",
      type: "autoComplete",
      autoCompleteProps: {
        showSearch: true,
        placeholder: t("placeholder.classId"),
        options: [
          {
            label: "Osama",
            value: "id",
          },
          {
            label: "Khaled",
            value: "55",
          },
        ],
      },
    },
    {
      name: "guardianId",
      type: "autoComplete",
      autoCompleteProps: {
        placeholder: t("placeholder.guardianId"),
        options: [],
      },
    },
    {
      name: "subscriptionsId",
      type: "autoComplete",
      autoCompleteProps: {
        placeholder: t("placeholder.subscriptionsId"),
        options: [],
      },
    },
    {
      name: "image",
      type: "upload",
      uploadProp: {
        name: "file",
        listType: "picture",
        maxCount: 1,
        beforeUpload: () => false,
        accept: "image/*",
        fileList: [],
      },
      fieldProps: {
        label: t("image"),
        valuePropName: "fileList",
        getValueFromEvent: (e: { fileList: UploadFile[] }) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList || [];
        },
      },
    },
    {
      name: "docs",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "file",
        listType: "text",
        beforeUpload: () => false,
        multiple: true,
        className: "fileupload",
        fileList: [],
      },
      fieldProps: {
        label: t("docs"),
        valuePropName: "fileList",
        getValueFromEvent: (e: { fileList: UploadFile[] }) => {
          if (Array.isArray(e)) {
            return e;
          }
          return e?.fileList || [];
        },
      },
    },
  ];
};
