import { X } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
};

const Modal = (props: Props) => {
  const { children, isOpen, onClose, modalTitle } = props;

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="overflow-y fixed inset-0 z-50 flex h-full w-full items-center justify-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-md bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-800">
            {modalTitle}
          </div>
          <button
            onClick={onClose}
            className="hover: bg-gray-100 hover:bg-gray-200 hover:text-black"
          >
            <X className="h-5 w-5 font-semibold text-gray-800" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
