import { type FormSchema } from "@/@types";
import { AutoComplete, Button, Form, Input, Select, Switch, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { yupValidator } from "../../utils/helpers.ts";
import { type ReactNode } from "react";

export default function CreateField(field: FormSchema) {
  const form = Form.useFormInstance();

  // Compose rules: yup validation + optional confirm password validator
  const composeRules = () => {
    const rules: { validator: (rule: object, value: string) => Promise<void> }[] = [];
    if (field.rules) rules.push(yupValidator(field.rules));
    // Special case: confirmNewPassword should match newPassword
    if (field.name === "confirmNewPassword") {
      rules.push({
        validator: (_: object, value: string) => {
          const target = form?.getFieldValue?.("newPassword");
          if (!value || value === target) return Promise.resolve();
          return Promise.reject(new Error("Passwords must match"));
        },
      });
    }
    return rules;
  };
  if (field.type == "autoComplete") {
    return (
      <Form.Item
        name={field.name}
        {...field.fieldProps}
        rules={composeRules()}
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
  } else if (field.type == "switch") {
    return (
      <Form.Item
        name={field.name}
        {...field.fieldProps}
        {...(field.rules && { rules: [yupValidator(field.rules)] })}
        valuePropName="checked"
      >
        <Switch {...field.switchProps} />
        {field?.fieldProps?.children as ReactNode}
      </Form.Item>
    );
  }
  return (
    <Form.Item
      name={field.name}
      {...field.fieldProps}
      rules={composeRules()}
    >
      <Input type={field.type} {...field.inputProps}></Input>
      {field?.fieldProps?.children as ReactNode}
    </Form.Item>
  );
}
