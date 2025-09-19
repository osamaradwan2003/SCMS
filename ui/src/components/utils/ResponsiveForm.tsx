import React from 'react';
import { Form, Grid, Card } from 'antd';
import type { FormProps } from 'antd';

const { useBreakpoint } = Grid;

interface ResponsiveFormProps extends FormProps {
  children: React.ReactNode;
  title?: string;
  showCard?: boolean;
}

const ResponsiveForm: React.FC<ResponsiveFormProps> = ({
  children,
  title,
  showCard = true,
  ...formProps
}) => {
  const screens = useBreakpoint();

  const getFormLayout = () => {
    if (screens.xs) {
      return {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      };
    }
    
    if (screens.sm) {
      return {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      };
    }

    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
  };

  const formContent = (
    <Form
      {...formProps}
      {...getFormLayout()}
      size={screens.xs ? 'small' : screens.sm ? 'middle' : 'large'}
      className={`responsive-form ${formProps.className || ''}`}
    >
      {children}
    </Form>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card
      title={title}
      size={screens.xs ? 'small' : 'default'}
      style={{
        margin: screens.xs ? '8px 0' : '16px 0',
      }}
    >
      {formContent}
    </Card>
  );
};

export default ResponsiveForm;
