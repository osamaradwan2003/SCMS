import * as yup from "yup";
import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const CreateGuardianFormSchema = (): FormSchema[] => {
  const t = useTranslate("guardians");
  return [
    {
      name: "name",
      type: "input",
      rules: yup.string().required(t("validation.guardiansName_required")),
      inputProps: {
        placeholder: t("placeholders.name"),
      },
    },
    {
      name: "phone",
      type: "input",
      rules: yup.string().required(t("validation.phone_required")),
      inputProps: {
        placeholder: t("placeholder.phone"),
      },
    },
    {
      name: "email",
      type: "input",
      rules: yup.string().email(t("validation.email_invalid")),
      inputProps: {
        placeholder: t("placeholder.email"),
        type: "email",
      },
    },
    {
      name: "address",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.address"),
        rows: 3,
      },
    },
    {
      name: "profile_photo",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "profile_photo",
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
        label: t("fields.profile_photo"),
        help: t("help.profile_photo"),
        className: "item-file-upload",
      },
    },
    {
      name: "documents",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        children: t("buttons.upload"),
        name: "documents",
        listType: "picture",
        maxCount: 5,
        multiple: true,
        accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
        beforeUpload: () => false, // Prevent auto upload
        showUploadList: {
          showPreviewIcon: false,
          showRemoveIcon: true,
        },
      },
      fieldProps: {
        label: t("fields.documents"),
        help: t("help.documents"),
        className: "item-file-upload",
      },
    },
  ];
};

export const UpdateGuardianFormSchema = (): FormSchema[] => {
  const t = useTranslate("guardians");
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
      name: "phone",
      type: "input",
      rules: yup.string().required(t("validation.phone_required")),
      inputProps: {
        placeholder: t("placeholder.phone"),
      },
    },
    {
      name: "email",
      type: "input",
      rules: yup.string().email(t("validation.email_invalid")),
      inputProps: {
        placeholder: t("placeholder.email"),
        type: "email",
      },
    },
    {
      name: "address",
      type: "textarea",
      rules: yup.string().nullable().notRequired(),
      textareaProps: {
        placeholder: t("placeholder.address"),
        rows: 3,
      },
    },
    {
      name: "profile_photo",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        name: "profile_photo",
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
        label: t("fields.profile_photo"),
        help: t("help.profile_photo"),
        className: "item-file-upload",
      },
    },
    {
      name: "documents",
      type: "upload",
      rules: yup.mixed().nullable().notRequired(),
      uploadProp: {
        children: t("buttons.upload"),
        name: "documents",
        listType: "picture",
        maxCount: 5,
        multiple: true,
        accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
        beforeUpload: () => false, // Prevent auto upload
        showUploadList: {
          showPreviewIcon: false,
          showRemoveIcon: true,
        },
      },
      fieldProps: {
        label: t("fields.documents"),
        help: t("help.documents"),
        className: "item-file-upload",
      },
    },
  ];
};
