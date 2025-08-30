import { Button, ButtonProps } from "antd";

export const InputButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      className="p-0 w-10 h-5 flex justify-center items-center"
      {...props}
    ></Button>
  );
};
