import CreateForm from "@/components/Form/CreateForm";
import { useLogin } from "@/hooks/auth";
import { useTranslate } from "@/hooks/locales";
import { Button, Typography, Alert, Space } from "antd";
import { useState, useEffect } from "react";
import LoginSchema from "@/forms/Login.sc";

interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      validationErrors?: ValidationError[];
    };
  };
  message?: string;
}

export default function Login() {
  const mutateFunc = useLogin();
  const t = useTranslate("auth");
  const [serverMessage, setServerMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Clear server message when mutation status changes
  useEffect(() => {
    if (mutateFunc.isIdle) {
      setServerMessage(null);
    }
  }, [mutateFunc.isIdle]);

  const handleLogin = (values: { username: string; password: string }) => {
    // Clear any previous messages
    setServerMessage(null);
    
    mutateFunc.mutate(values, {
      onSuccess: (response) => {
        // Display server success message
        if (response.data.message) {
          setServerMessage({
            type: 'success',
            message: response.data.message
          });
        }
      },
      onError: (error: ApiError) => {
        // Handle different types of server error responses
        let errorMessage = t("messages.login_error");
        
        if (error?.response?.data?.message) {
          // Use server error message if available
          errorMessage = error.response.data.message;
        } else if (error?.response?.data?.validationErrors) {
          // Handle validation errors
          const validationErrors = error.response.data.validationErrors;
          errorMessage = validationErrors.map((err: ValidationError) => err.message).join(', ');
        } else if (error?.message) {
          // Use generic error message
          errorMessage = error.message;
        }
        
        setServerMessage({
          type: 'error',
          message: errorMessage
        });
      }
    });
  };

  return (
    <>
      <Typography.Title className="text-center">
        {t("welcome_back")}
      </Typography.Title>
      
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {serverMessage && (
          <Alert
            message={serverMessage.message}
            type={serverMessage.type}
            showIcon
            closable
            onClose={() => setServerMessage(null)}
          />
        )}
        
        <CreateForm
          onFinish={handleLogin}
          formSchema={LoginSchema}
          className="padding-2"
        >
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            loading={mutateFunc.isPending}
            disabled={mutateFunc.isPending}
          >
            {mutateFunc.isPending ? t("buttons.login") + "..." : t("buttons.login")}
          </Button>
        </CreateForm>
      </Space>
    </>
  );
}
