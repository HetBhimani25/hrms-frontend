import React, { createContext, useContext, useState, useCallback } from "react";
import "../styles/toast.css";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="toast-wrapper">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card ${t.type}`}>
            <div className={`toast-indicator ${t.type}`} />
            <span className="toast-text">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
