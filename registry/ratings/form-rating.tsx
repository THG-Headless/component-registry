import React, { useState, useEffect } from "react";
import { Ratings } from "./ratings";
import { useFormField } from "../form/form";
import type { FieldValidator } from "../form/types";

interface FormRatingProps {
  name: string;
  label?: string;
  required?: boolean;
  maxRating?: number;
  helperText?: string;
  errorMessage?: string;
  requiredText?: string;
  optionalText?: string;
  iconSize?: string;
  className?: string;
  value?: number;
  onChange?: (rating: number) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validator?: FieldValidator;
}

export const FormRating: React.FC<FormRatingProps> = ({
  name,
  label = "Rating",
  required = false,
  maxRating = 5,
  helperText = "Please rate your experience",
  errorMessage = "Please select a rating",
  requiredText = "(Required)",
  optionalText = "(Optional)",
  iconSize = "24px",
  className = "",
  value,
  onChange,
  validator,
}) => {
  // Use the form field hook with validator
  const field = useFormField(name, validator);

  // If validator.isRequired() returns true, override the required prop
  const isRequired = field.isRequired || required;

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(
    value || (field.value ? Number(field.value) : 0)
  );

  useEffect(() => {
    // Only update selectedRating if the external value prop changes
    if (value !== undefined && value !== selectedRating) {
      setSelectedRating(value);
    }
  }, [value, selectedRating]);

  // Only update from field.value on initial mount
  useEffect(() => {
    if (field.value !== undefined && selectedRating === 0) {
      setSelectedRating(Number(field.value) || 0);
    }
  }, []);

  const handleRatingChange = (newRating: number) => {
    setSelectedRating(newRating);
    // The setValue will trigger validation in FormContext
    field.setValue(newRating);
    field.setTouched(true);
    onChange && onChange(newRating);
  };

  const fieldIsInvalid = !!field.error;
  const showError = fieldIsInvalid && (field.touched || field.isSubmitting);
  const displayErrorMessage = field.error || errorMessage;

  return (
    <div
      className={`skin-form rating-wrapper w-full wrapper group ${className}`}
    >
      <div className="input-label-wrapper">
        <label className="input-label text-body font-semi-bold">{label}</label>
        <span
          className="input-status text-sm font-light soft ml-2"
          aria-hidden="true"
        >
          {isRequired ? requiredText : optionalText}
        </span>
      </div>

      <div
        className="rating-options-wrapper flex flex-row justify-between w-full mt-2"
        role="radiogroup"
        aria-label={label}
      >
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
          <div key={value} className="rating-option flex-1 mx-1">
            <label
              className={`block w-full cursor-pointer ${
                selectedRating === value ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name={name}
                value={value}
                checked={selectedRating === value}
                onChange={() => handleRatingChange(value)}
                className="sr-only"
                aria-label={`Rate ${value} out of ${maxRating}`}
                required={isRequired}
              />
              <div
                className={`btn w-full border-2 ${
                  selectedRating === value
                    ? "active border-primary"
                    : "border-transparent"
                }`}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(null)}
              >
                <Ratings
                  rating={value}
                  maxRating={5}
                  iconSize={iconSize}
                  className="skin-secondary"
                />
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="input-helper-wrapper">
        {showError ? (
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
            <p className="input-error text-sm font-bold" role="alert">
              {displayErrorMessage}
            </p>
          </div>
        ) : (
          <p className="input-helper text-sm soft">{helperText}</p>
        )}
      </div>

      <input type="hidden" name={name} value={selectedRating || ""} />
    </div>
  );
};

export default FormRating;
