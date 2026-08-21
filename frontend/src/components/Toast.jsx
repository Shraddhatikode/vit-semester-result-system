import React, { useEffect, useRef } from 'react';

const Toast = ({ toastConfig, onClose }) => {
  const { show, message, type } = toastConfig;
  const toastRef = useRef(null);

  useEffect(() => {
    if (show && window.bootstrap && toastRef.current) {
      const toastInstance = new window.bootstrap.Toast(toastRef.current, { delay: 4000 });
      toastInstance.show();
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, toastConfig, onClose]);

  if (!show) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        ref={toastRef}
        className={`toast align-items-center text-white border-0 bg-${type === 'success' ? 'success' : 'danger'}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
