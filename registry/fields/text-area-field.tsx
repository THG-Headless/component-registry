import React from "react";
import type { TextareaHTMLAttributes } from "react";
import TextArea from "@/registry/text-area/text-area";
import InputWrapper from "@/registry/field-wrapper/field-wrapper";
import type { FieldProps } from "@/registry/field-wrapper/field-wrapper";

type TextAreaFieldProps = FieldProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "id" | "name" | "placeholder" | "disabled" | "required" | "aria-invalid"
  >;

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  name,
  label,
  helperText,
  errorMessage,
  placeholder,
  required = false,
  "aria-invalid": ariaInvalid = false,
  disabled = false,
  maxlength,
  ...restProps
}) => {
  return (
    <div className="w-full">
      <InputWrapper
        id={id}
        name={name}
        label={label}
        helperText={helperText}
        errorMessage={errorMessage}
        placeholder={placeholder}
        required={required}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        maxlength={maxlength}
      >
        <TextArea {...restProps} />
      </InputWrapper>
    </div>
  );
};

export default TextAreaField;
