import React, { useState, useRef, useEffect } from "react";
import type {
  InputHTMLAttributes,
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
} from "react";

interface RatingInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "defaultValue"
  > {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  numberOfOptions?: number;
  defaultValue?: number | null;
  value?: number | null;
  onChange?: (value: number | null) => void;
  className?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  id = "rating-input",
  name = "rating",
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  disabled = false,
  required,
  numberOfOptions = 5,
  defaultValue,
  value,
  className = "",
  onChange,
  ...restProps
}) => {
  const calculateDefaultValue = () => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return null;
  };

  const [selectedRating, setSelectedRating] = useState<number | null>(
    calculateDefaultValue()
  );

  useEffect(() => {
    if (value !== undefined && value !== selectedRating) {
      setSelectedRating(value);
    }
  }, [value]);

  const radioGroupRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSelectedRating(newValue);
    onChange && onChange(newValue);
  };

  const helperId = `${id}-helper`;
  const messageId = `${id}-message`;

  return (
    <div
      className={`skin-form input-wrapper  wrapper group ${className}`}
      role="group"
      aria-roledescription="star rating"
    >
      {label && (
        <div className="input-label-wrapper">
          <label
            className="input-label text-body font-semi-bold"
            id={`${id}-label`}
            htmlFor={`${id}-1`}
          >
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
      )}

      <div
        className="rating-input skin-primary wrapper ml-2 [--rating-icon-size:32px]"
        ref={radioGroupRef}
        role="radiogroup"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-invalid={
          isInvalid || (required && selectedRating === null) ? "true" : "false"
        }
        aria-describedby={helperId}
        aria-errormessage={isInvalid ? messageId : undefined}
      >
        {Array.from({ length: numberOfOptions }, (_, index) => {
          const ratingValue = index + 1;
          const optionId = `${id}-${ratingValue}`;

          return (
            <input
              key={optionId}
              type="radio"
              id={optionId}
              name={name}
              value={ratingValue}
              checked={selectedRating === ratingValue}
              onChange={handleChange}
              aria-label={`${ratingValue} ${
                ratingValue === 1 ? "star" : "stars"
              }`}
              disabled={disabled}
              required={required && selectedRating === null}
              aria-invalid={
                isInvalid || (required && selectedRating === null)
                  ? "true"
                  : "false"
              }
              aria-describedby={helperId}
              aria-errormessage={messageId}
              {...restProps}
            />
          );
        })}
      </div>

      <div className="input-helper-wrapper">
        {!isInvalid && helperText && (
          <p className="input-helper text-sm soft" id={helperId}>
            {helperText}
          </p>
        )}
        {isInvalid && (
          <div className="skin-error flex items-center space-x-1 py-3 px-2 mt-1 rounded-site">
            <svg
              className="w-5 h-5 "
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
            <p className=" text-sm font-bold" id={messageId} role="alert">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingInput;
