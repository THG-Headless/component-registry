import React, { useState, useEffect } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import { useFormField } from "../form/form";
import type { FieldValidator } from "../form/types";

interface TextInputProps {
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
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validator?: FieldValidator;
}

export const TextInput: React.FC<TextInputProps> = ({
  id = "basic-input",
  name = "basic-input",
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
  value,
  onChange,
  onBlur,
  onClear,
  validateOnChange = false,
  validateOnBlur = true,
  validator,
}) => {
  const field = useFormField(name, validator);

  const isRequired = field.isRequired || required;

  const [inputValue, setInputValue] = useState(value || field.value || "");
  const [touched, setTouched] = useState(field.touched);

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  useEffect(() => {
    if (field.value !== undefined && !inputValue) {
      setInputValue(field.value);
    }
  }, []);

  useEffect(() => {
    setTouched(field.touched);
  }, [field.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    field.setValue(newValue);
    onChange && onChange(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    field.setTouched(true);
    onBlur && onBlur(e);
  };

  const handleClear = () => {
    setInputValue("");
    field.setValue("");
    onClear && onClear();
  };

  const helperId = `${id}-helper`;
  const statusId = `${id}-status`;
  const messageId = `${id}-message`;

  const fieldIsInvalid = isInvalid || !!field.error;
  const showError = fieldIsInvalid && (touched || field.isSubmitting);
  const displayErrorMessage = field.error || errorMessage;

  return (
    <div className="skin-form input-wrapper w-full wrapper group">
      <div className="input-label-wrapper">
        <label className="input-label text-body font-semi-bold" htmlFor={id}>
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
        <input
          type="text"
          className="input-field !text-body placeholder:soft interactive"
          id={id}
          name={name}
          placeholder={placeholder}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={`${helperId} ${statusId}`}
          aria-errormessage={messageId}
          autoComplete={autocomplete}
          spellCheck={spellcheck}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={isRequired}
        />
        {inputValue && !disabled && (
          <button
            className="skin-control input-clear"
            aria-label="Clear input"
            onClick={handleClear}
            type="button"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="input-helper-wrapper">
        <p className="input-helper text-sm soft" id={helperId}>
          {helperText}
        </p>
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
              id={messageId}
              role="alert"
            >
              {displayErrorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
