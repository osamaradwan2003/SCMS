import { FormSchema } from "../../../@types";
import { Modal } from "antd";
import React, { cloneElement, ReactElement, useReducer } from "react";
import CreateForm from "../../Form/CreateForm.tsx";

export declare type FromModalProps = {
  formSchema: FormSchema[];
  handelFunc?: (
    dispatch: React.Dispatch<modalActions>,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
  button: ReactElement;
};
export declare type modalActions = "open" | "close" | "loading" | "loaded";

const modalStates = {
  isOpen: false,
  isLoading: false,
};

function reducer(state: typeof modalStates, action: modalActions) {
  switch (action) {
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "loading":
      return { ...state, isLoading: true };
    case "loaded":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
function FormModal({ formSchema, handelFunc, button }: FromModalProps) {
  const [modalReducer, dispatch] = useReducer(reducer, modalStates);
  const modalBtn = cloneElement(button, {
    onClick: () => {
      dispatch("open");
    },
  });
  return (
    <>
      {modalBtn}
      <Modal
        open={modalReducer.isOpen}
        confirmLoading={modalReducer.isLoading}
        onOk={(e) => {
          if (handelFunc) handelFunc(dispatch, e);
        }}
        onCancel={() => dispatch("close")}
        rootClassName="p-4"
      >
        <CreateForm
          className="mt-6"
          formSchema={formSchema.slice(0, formSchema.length - 1)}
        />
      </Modal>
    </>
  );
}

export default FormModal;
