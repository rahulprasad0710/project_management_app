import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  modalTitle?: string;
  modalTitleChildren?: React.ReactNode;
  size?: number;
};

const Modal = (props: Props) => {
  const { children, isOpen, onClose, modalTitle, modalTitleChildren, size } =
    props;

  const modalSize = size ? `max-w-${size}xl` : `max-w-4xl`;

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative z-10 w-full ${modalSize} transform rounded-sm bg-white p-4 shadow-lg transition-all duration-200 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          {modalTitle ? (
            <h2 className="text-xl font-semibold text-gray-800">
              {modalTitle}
            </h2>
          ) : (
            modalTitleChildren
          )}

          <button onClick={onClose} className="rounded p-1 hover:bg-gray-200">
            <X className="h-5 w-5 text-gray-800" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
