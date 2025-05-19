import { FormSchema } from "../@types";
import * as yup from "yup";

export const RoleSchema:FormSchema[] = [
  {
    name: "role_name",
    type: "text",
    rules: new yup.StringSchema().min(8,""),
    inputProps: {placeholder: "Role Name"}
  },
  {
    name:"submit",
    type:"button",
  }
];