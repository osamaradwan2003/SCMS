import { type FormSchema } from "@/@types";

export const FeeFormSchema: FormSchema[] = [
  {
    name: "name",
    type: "text",
    inputProps: { placeholder: "Fee Name" },
  },
  {
    name: "value",
    type: "number",
    inputProps: {
      type: "number",
      min: 0,
      placeholder: "Price",
    },
  },
  {
    name: "submit",
    type: "button",
  },
];
