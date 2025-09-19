import { Schema } from "yup";
import {
  AutoCompleteProps,
  FormItemProps,
  InputProps,
  UploadProps,
  SelectProps,
  ButtonProps,
  SwitchProps,
} from "antd";
import type { TextAreaProps } from "antd/es/input";

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
    | "textarea"
    | "input"
    | "switch";
  rules?: Schema;
  fieldProps?: FormItemProps;
  inputProps?: InputProps;
  uploadProp?: UploadProps;
  autoCompleteProps?: AutoCompleteProps;
  textareaProps?: TextAreaProps;
  selectProps?: SelectProps;
  buttonProps?: ButtonProps;
  switchProps?: SwitchProps;
};

export { FormSchema };
