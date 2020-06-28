import React, { useEffect, useRef } from "react";

const Alert = ({ alert, clearAlert, className }) => {
  const timeout = useRef();

  useEffect(() => {
    if (alert) {
      timeout.current = setTimeout(() => {
        clearAlert();
      }, 4000);
    }
  }, [alert]);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return alert ? (
    <div className={`alert alert--${alert.type} ${className}`}>
      <p className="alert__text">{alert.msg}</p>
      <i
        className="fas fa-times alert-close"
        onClick={clearAlert}
        aria-hidden="true"></i>
    </div>
  ) : null;
};
export default Alert;
