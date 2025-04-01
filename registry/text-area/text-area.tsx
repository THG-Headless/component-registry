import React, { useCallback } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import FieldProvider from "../form/FieldProvider";
import type { FieldValidator } from "../form/types";
import { useFieldValue } from "../utils/formFieldUtils";
import ErrorBoundary from "../utils/ErrorBoundary";

interface TextAreaProps {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  requiredText?: string;
  optionalText?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  spellcheck?: boolean;
  value?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validator?: FieldValidator;
}

export const TextArea: React.FC<TextAreaProps> = ({
  id = "basic-textarea",
  name = "basic-textarea",
  label = "Label",
  required = false,
  requiredText = "(Required)",
  optionalText = "(Optional)",
  placeholder = "Placeholder text",
  helperText = "Helper text",
  errorMessage = "Error message",
  isInvalid = false,
  disabled = false,
  autocomplete = "off",
  spellcheck = true,
  value = "",
  minLength = 0,
  maxLength = 500,
  rows = 3,
  onChange,
  onBlur,
  validator,
}) => {
  return (
    <ErrorBoundary>
      <FieldProvider name={name} initialValue={value} validator={validator}>
        {(field) => {
          // If validator.isRequired() returns true, override the required prop
          const isRequired = field.isRequired || required;

          // Use utility hook for field value management
          const [inputValue, setInputValue] = useFieldValue(value, field.value);

          // Create specialized change handler for HTMLTextAreaElement
          const handleChange = useCallback(
            (e: ChangeEvent<HTMLTextAreaElement>) => {
              const newValue = e.target.value;
              setInputValue(newValue);
              field.setValue(newValue);
              onChange && onChange(e);
            },
            [setInputValue, field, onChange]
          );

          // Create specialized blur handler for HTMLTextAreaElement
          const handleBlur = useCallback(
            (e: FocusEvent<HTMLTextAreaElement>) => {
              field.setTouched(true);
              onBlur && onBlur(e);
            },
            [field, onBlur]
          );

          const helperId = `${id}-helper`;
          const charLimitId = `${id}-char-limit`;
          const errorId = `${id}-error`;

          const fieldIsInvalid = isInvalid || !!field.error;
          const showError =
            fieldIsInvalid && (field.touched || field.isSubmitting);
          const displayErrorMessage = field.error || errorMessage;

          return (
            <div className="skin-form input-wrapper w-full wrapper group">
              <div className="input-label-wrapper">
                <label
                  className="input-label text-body font-semi-bold"
                  htmlFor={id}
                >
                  {label}
                </label>
                <span
                  className="input-status text-sm font-light soft"
                  aria-hidden="true"
                >
                  {isRequired ? requiredText : optionalText}
                </span>
              </div>
              <div className="input-field-wrapper">
                <textarea
                  className="input-field !text-body placeholder:soft interactive"
                  id={id}
                  name={name}
                  placeholder={placeholder}
                  aria-invalid={showError ? "true" : "false"}
                  aria-describedby={`${helperId} ${charLimitId}`}
                  aria-errormessage={errorId}
                  autoComplete={autocomplete}
                  spellCheck={spellcheck}
                  minLength={minLength}
                  maxLength={maxLength}
                  rows={rows}
                  value={inputValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={disabled}
                  required={isRequired}
                ></textarea>
                <svg
                  className="resize-handle"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
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
              <div className="input-helper-wrapper">
                <div className="input-helper-content">
                  {!showError && (
                    <p className="input-helper text-sm soft" id={helperId}>
                      {helperText}
                    </p>
                  )}
                  {showError && (
                    <div className="skin-error input-error-content">
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
                        {displayErrorMessage}
                      </p>
                    </div>
                  )}
                </div>
                <p
                  className="input-char-limit text-sm soft"
                  id={charLimitId}
                  aria-hidden="true"
                >
                  {inputValue.length}/{maxLength}
                </p>
              </div>
            </div>
          );
        }}
      </FieldProvider>
    </ErrorBoundary>
  );
};

export default TextArea;
