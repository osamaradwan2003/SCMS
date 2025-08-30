import { type FormSchema } from "../../@types";
import { Form, type FormProps } from "antd";
import CreateField from "./CreateField.tsx";

interface Props extends FormProps {
  formSchema: FormSchema[];
  children?: React.ReactNode;
}
/**
 *CreateForm component used to create form from FormSchema[]
 * @param FormSchema formSchema
 * @param JSX.Element children
 * @param FormProps ..props
 *  @example
 *  <CreateForm formSchema={[{name: 'user_name', type: 'text'}]}/>
 *
 * please make form button always in last element
 */
export default function CreateForm({ formSchema, children, ...props }: Props) {
  return (
    <Form {...props}>
      {formSchema.map((field) => {
        return (
          <CreateField
            key={window.crypto.randomUUID()}
            {...field}
          ></CreateField>
        );
      })}
      {children}
    </Form>
  );
}
