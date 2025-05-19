import { type FormSchema } from "@/@types";
import * as yup from "yup";

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
    autoCompleteProps: {
      placeholder: "Payment",
      options: [{ label: "Free", value: "ID" }],
    },
  },
  {
    type: "autoComplete",
    name: "st_group",
    autoCompleteProps: {
      placeholder: "St. Class",
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
    inputProps: { placeholder: "Student Documents" },
    uploadProp: { accept: "Image/*", multiple: true },
  },
  {
    type: "upload",
    name: "st_photo",
    inputProps: { placeholder: "St. Image " },
    uploadProp: { accept: "Image/*", maxCount: 1, multiple: false },
  },
];
