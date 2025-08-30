// import React from "react";
// import { Field, FieldProps, FastField, FastFieldProps } from "formik";
// import { Form } from "antd";
// import { FormItemProps } from "antd/lib/form";
// import { InputProps } from "antd/lib/input";

// type Props = (InputProps) & {
//   name: string;
//   fast?: boolean;
//   FormItemProps?: FormItemProps;
// };

// export const FormikInput: React.FC<Props> = ({
//                                                name,
//                                                fast,
//                                                onChange,
//                                                FormItemProps = {},
//                                                ...rest
//                                              }) => {
//   const FieldComponent = fast ? FastField : Field;

//     return (
//     <FieldComponent name={name}>
//       {({ field, meta, form }: FieldProps | FastFieldProps) => (

//         <Form.Item
//           name={name}
//           validateStatus={meta.touched && meta.error ? "error" : "success"}
//           help={meta.touched && meta.error}
//           {...FormItemProps}
//         >
//             <FormikAnt field={field}
//                        meta={meta}
//                        onChange={onChange}
//                        Form={form} {...rest}
//                        name={name}
//             >
//             </FormikAnt>
//         </Form.Item>
//       )}
//     </FieldComponent>
//   );
// };
