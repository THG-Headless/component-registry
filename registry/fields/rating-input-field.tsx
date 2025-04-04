import React from "react";
import type { InputHTMLAttributes } from "react";
import RatingInput from "@/registry/rating-input/rating-input";
import FieldWrapper from "@/registry/field-wrapper/field-wrapper";
import type { FieldProps } from "@/registry/field-wrapper/field-wrapper";

// Define the specific props for RatingInput
type RatingInputSpecificProps = {
  numberOfOptions?: number;
  defaultValue?: number | null;
  value?: number | null;
  onChange?: (value: number | null) => void;
};

// Combine FieldProps with RatingInput specific props
interface RatingInputFieldProps
  extends FieldProps,
    RatingInputSpecificProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | "id"
      | "name"
      | "disabled"
      | "required"
      | "aria-invalid"
      | "onChange"
      | "value"
      | "defaultValue"
    > {}

const RatingInputField: React.FC<RatingInputFieldProps> = ({
  id,
  name,
  label,
  helperText,
  errorMessage,
  required = false,
  "aria-invalid": ariaInvalid = false,
  disabled = false,
  numberOfOptions = 5,
  defaultValue,
  value,
  onChange,
  ...restProps
}) => {
  return (
    <div className="w-full">
      <FieldWrapper
        id={id}
        name={name}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        required={required}
        aria-invalid={ariaInvalid}
        disabled={disabled}
      >
        <RatingInput
          disabled={disabled}
          required={required}
          numberOfOptions={numberOfOptions}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          className="ml-2"
          {...restProps}
        />
      </FieldWrapper>
    </div>
  );
};

export default RatingInputField;
