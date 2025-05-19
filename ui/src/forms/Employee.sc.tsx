import { FormSchema } from "../@types";
import FormModal from "../components/modals/formModals/FormModal";
import { RoleSchema } from "./Role.sc";
import { InputButton } from "../components/utils/InputButton";
import { IoAdd } from "react-icons/io5";
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
    name: "role",
    type: "autoComplate",
    fieldProps: {
      children: (
        <FormModal
          formSchema={RoleSchema}
          button={<InputButton icon={<IoAdd />}></InputButton>}
        />
      ),
    },
    inputProps: { placeholder: "Role" },
  },
  {
    name: "submit",
    type: "button",
    buttonProps: { children: "Add Employee", type: "primary", block: true },
  },
];
