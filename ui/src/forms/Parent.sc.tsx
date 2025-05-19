import { type FormSchema } from "@/@types";

export const ParentFormSchema: FormSchema[] = [
  {
    name: "p_name",
    type: "text",
    inputProps: { placeholder: "Parent Name" },
  },
  {
    name: "p_email",
    type: "email",
    inputProps: { placeholder: "Parent Email" },
  },
  {
    name: "p_phone",
    type: "tel",
    inputProps: { placeholder: "Parent Phone" },
  },
  {
    name: "p_addr",
    type: "text",
    inputProps: { placeholder: "Parent address" },
  },
  {
    name: "p_id",
    type: "upload",
    inputProps: { placeholder: "Parent DOC ID" },
  },
  {
    name: "submit",
    type: "button",
    buttonProps: { htmlType: "submit", children: "Add Parent" },
  },
];
