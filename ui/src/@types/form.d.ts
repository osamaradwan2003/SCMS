import { Schema } from "yup";
import {
  AutoCompleteProps,
  FormItemProps,
  InputProps,
  UploadProps,
  SelectProps,
  ButtonProps,
} from "antd";

/*
 *FormSchema Data type for Create Form Component
 *
 *
 */
declare type FormSchema = {
  name: string;
  type:
    | string
    | "autoComplete"
    | "upload"
    | "button"
    | "field"
    | "select"
    | "field"
    | "input";
  rules?: Schema;
  fieldProps?: FormItemProps;
  inputProps?: InputProps;
  uploadProp?: UploadProps;
  autoCompleteProps?: AutoCompleteProps;
  selectProps?: SelectProps;
  buttonProps?: ButtonProps;
};

export { FormSchema };
