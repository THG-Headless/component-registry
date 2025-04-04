import React from "react";

export type AlertType = "info" | "success" | "error";

interface AlertProps {
  type: AlertType;
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const getAlertType = (type: AlertType) => {
    switch (type) {
      case "info":
        return "skin-attention";
      case "success":
        return "skin-success";
      case "error":
        return "skin-error";
      default:
        return "skin-error";
    }
  };
  return (
    <div className={`alert space-x-2 pr-3 ${getAlertType(type)}`}>
      {type === "success" && (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="size-6"
            aria-hidden="true"
          >
            <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
          </svg>
        </div>
      )}
      {type === "info" && (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="size-6"
            aria-hidden="true"
          >
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
          </svg>
        </div>
      )}
      {type === "error" && (
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />{" "}
          </svg>
        </div>
      )}
      <p className="flex items-center text-left" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default Alert;
