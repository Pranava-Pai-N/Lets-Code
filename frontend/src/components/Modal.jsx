import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 dark:bg-zinc-800 rounded-lg shadow-lg max-w-lg w-full mx-4 p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
