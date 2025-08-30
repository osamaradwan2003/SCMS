import { type FormSchema } from "@/@types";
export const EmployeeSchema: FormSchema[] = [
  {
    name: "ep_name",
    type: "name",
    inputProps: { placeholder: "Full Name" },
  },
  {
    name: "ep_email",
    type: "email",
    inputProps: { placeholder: "Email" },
  },
  {
    name: "ep_phone",
    type: "tel",
    inputProps: { placeholder: "Phone" },
  },
  {
    name: "ep_address",
    type: "address",
    inputProps: { placeholder: "Address" },
  },
  {
    name: "salary",
    type: "number",
    inputProps: { placeholder: "Salary" },
  },
  {
    name: "submit",
    type: "button",
    buttonProps: { children: "Add Employee", type: "primary", block: true },
  },
];
