import { type FormSchema } from "@/@types";
import { AutoComplete, Button, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { yupValidator } from "../../utils/helpers.ts";
import { type ReactNode } from "react";

export default function CreateField(field: FormSchema) {
  if (field.type == "autoComplete") {
    return (
      <Form.Item
        name={field.name}
        {...field.fieldProps}
        {...(field.rules && { rules: [yupValidator(field.rules)] })}
      >
        <AutoComplete {...field.autoCompleteProps}>
          <Input {...field.inputProps}></Input>
        </AutoComplete>
        {field?.fieldProps?.children as ReactNode}
      </Form.Item>
    );
  } else if (field.type == "upload") {
    return (
      <Form.Item
        name={field.name}
        {...field.fieldProps}
        {...(field.rules && { rules: [yupValidator(field.rules)] })}
      >
        <Upload {...field.uploadProp}>
          <Button icon={<UploadOutlined />}>
            {field?.inputProps?.placeholder}
          </Button>
        </Upload>
        {field?.fieldProps?.children as ReactNode}
      </Form.Item>
    );
  } else if (field.type == "select") {
    return (
      <Form.Item
        name={field.name}
        {...field.fieldProps}
        {...(field.rules && { rules: [yupValidator(field.rules)] })}
      >
        <Select {...field.selectProps} />
        {field?.fieldProps?.children as ReactNode}
      </Form.Item>
    );
  } else if (field.type == "button") {
    return (
      <Form.Item>
        <Button {...field.buttonProps} />
        {field?.fieldProps?.children as ReactNode}
      </Form.Item>
    );
  } else if (field.type == "field") {
    return (
      <Form.Item
        name={field.name}
        {...field.fieldProps}
        {...(field.rules && { rules: [yupValidator(field.rules)] })}
      >
        {field?.fieldProps?.children as ReactNode}
      </Form.Item>
    );
  } else if (field.type == "textarea") {
    return (
      <Form.Item name={field.name} {...field.fieldProps}>
        <Input.TextArea {...field.textareaProps} />
      </Form.Item>
    );
  }
  return (
    <Form.Item
      name={field.name}
      {...field.fieldProps}
      {...(field.rules && { rules: [yupValidator(field.rules)] })}
    >
      <Input type={field.type} {...field.inputProps}></Input>
      {field?.fieldProps?.children as ReactNode}
    </Form.Item>
  );
}
