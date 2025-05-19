import { FormSchema } from "../@types/index";
import * as yup from "yup";
import { InputButton } from "../components/utils/InputButton.tsx";
import { IoAdd } from "react-icons/io5";
import FormModal, {
  modalActions,
} from "../components/modals/formModals/FormModal.tsx";
import { ParentFormSchema } from "./Parent.sc.tsx";
import { FeeFormSchema } from "./Fee.sc.tsx";
import { GroupForm } from "./Group.sc.tsx";
import React from "react";

function parentHandel(dispatch: React.Dispatch<modalActions>) {
  dispatch("loading");
  setTimeout(() => {
    dispatch("loaded");
    dispatch("close");
  }, 3000);
}

export const StudentSchema: FormSchema[] = [
  {
    type: "text",
    name: "st_name",
    rules: yup
      .string()
      .required("Please enter ST. name")
      .min(4, "ST. name is Too Short")
      .max(50, "St. name is To long"),
    inputProps: {
      placeholder: "ST. name",
    },
  },
  {
    type: "autoComplete",
    name: "st_parent",
    rules: yup.string().required("Please add Valid Parent"),
    fieldProps: {
      children: (
        <FormModal
          handelFunc={parentHandel}
          button={<div></div>}
          formSchema={ParentFormSchema}
        ></FormModal>
      ),
    },
    autoCompleteProps: {
      placeholder: "ST. Parent",
      options: [
        {
          label: "Osama Amin",
          value: "ID",
        },
      ],
    },
  },
  {
    type: "email",
    name: "st_email",
    rules: yup.string().email("Please enter valid email"),
    inputProps: { placeholder: "ST. Email" },
  },
  {
    type: "tel",
    name: "st_phone",
    inputProps: { placeholder: "St. Phone" },
  },
  {
    type: "autoComplete",
    name: "payment_type",
    fieldProps: {
      children: (
        <FormModal
          handelFunc={parentHandel}
          button={<InputButton icon={<IoAdd />} />}
          formSchema={FeeFormSchema}
        ></FormModal>
      ),
    },
    autoCompleteProps: {
      placeholder: "Payment",
      options: [{ label: "Free", value: "ID" }],
    },
  },
  {
    type: "autoComplete",
    name: "st_group",
    fieldProps: {
      children: (
        <FormModal
          handelFunc={parentHandel}
          button={<IoAdd />}
          formSchema={GroupForm}
        ></FormModal>
      ),
    },
    autoCompleteProps: {
      placeholder: "St. Group",
      options: [{ label: "fajr", value: "ID" }],
    },
  },
  {
    type: "address",
    name: "st_address",
    inputProps: { placeholder: "St. address" },
  },
  { name: "", type: "field" },
  {
    type: "upload",
    name: "st_id_doc",
    inputProps: { placeholder: "National ID Document" },
    uploadProp: { accept: "Image/*", maxCount: 2, multiple: true },
  },
  {
    type: "upload",
    name: "st_photo",
    inputProps: { placeholder: "St. Image " },
    uploadProp: { accept: "Image/*", maxCount: 1, multiple: false },
  },
  {
    type: "button",
    name: "submit",
    fieldProps: { className: "flex justify-center" },
    buttonProps: {
      children: "Create Student",
      htmlType: "submit",
      type: "primary",
      block: true,
    },
  },
];
