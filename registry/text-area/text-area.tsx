import React, { useState } from "react";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  id = "basic-textarea",
  name = "basic-textarea",
  label,
  placeholder,
  helperText,
  errorMessage,
  isInvalid = false,
  disabled = false,
  autoComplete = "off",
  spellCheck = true,
  value = "",
  minLength = 0,
  maxLength = 500,
  rows = 3,
  onChange,
  required,
  ...restProps
}) => {
  const [inputValue, setInputValue] = useState<string>(String(value));

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  const helperId = `${id}-helper`;
  const charLimitId = `${id}-char-limit`;
  const errorId = `${id}-error`;

  return (
    <div className="skin-form input-wrapper w-full wrapper group">
      <div className="input-label-wrapper">
        <label className="input-label text-body font-semi-bold" htmlFor={id}>
          {label}
        </label>
        {required && (
          <span
            className="input-status text-sm font-light soft"
            aria-hidden="true"
          >
            Required
          </span>
        )}
      </div>
      <div className="input-field-wrapper">
        <textarea
          className="input-field !text-body placeholder:soft interactive"
          id={id}
          name={name}
          placeholder={placeholder}
          aria-invalid={isInvalid ? "true" : "false"}
          aria-describedby={`${helperId} ${charLimitId}`}
          aria-errormessage={errorId}
          autoComplete={autoComplete}
          spellCheck={spellCheck}
          minLength={minLength}
          maxLength={maxLength}
          rows={rows}
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          {...restProps} // Spread remaining native textarea attributes
        ></textarea>
        <svg className="resize-handle" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M12.9627 2L2 12.9843L3.01375 14L13.9764 3.01575L12.9627 2Z"
            fill="#666666"
          />
          <path
            d="M6.50295 12.9843L12.9862 6.48819L14 7.50394L7.5167 14L6.50295 12.9843Z"
            fill="#666666"
          />
          <path
            d="M11.0766 12.937L12.9862 11.0236L14 12.0394L12.0904 13.9528L11.0766 12.937Z"
            fill="#666666"
          />
        </svg>
      </div>
      {isInvalid && (
        <div className="skin-error input-error-content py-3">
          <svg
            className="input-error-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p
            className="input-error text-sm font-bold"
            id={errorId}
            role="alert"
          >
            {errorMessage}
          </p>
        </div>
      )}
      <div className="input-helper-wrapper">
        <div className="input-helper-content">
          {!isInvalid && (
            <p className="input-helper text-sm soft" id={helperId}>
              {helperText}
            </p>
          )}
        </div>
        <p
          className="input-char-limit text-sm soft"
          id={charLimitId}
          aria-hidden="true"
        >
          {String(inputValue).length}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
