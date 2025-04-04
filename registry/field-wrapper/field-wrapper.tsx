import React, { useState, Children, cloneElement, isValidElement } from "react";
import Alert from "@/registry/alert/alert";

interface FieldProps {
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  placeholder?: string;
  required?: boolean;
  "aria-invalid"?: boolean;
  disabled?: boolean;
  maxlength?: number;
}

interface FieldWrapperProps extends FieldProps {
  children: React.ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({
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
  children,
  ...restProps
}) => {
  const [inputLength, setInputLength] = useState(0);

  const childWithProps = React.Children.map(children, (child) => {
    if (isValidElement<any>(child)) {
      const commonProps: any = {
        id,
        name,
        placeholder,
        disabled,
        required,
        "aria-invalid": ariaInvalid,
      };

      if (helperText && !ariaInvalid) {
        commonProps["aria-describedby"] = `${id}-helper`;
      }

      if (maxlength) {
        commonProps.maxLength = maxlength;
      }

      if (maxlength) {
        commonProps.onChange = (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          setInputLength(e.target.value.length);

          const originalOnChange = (child as any).props.onChange;
          if (typeof originalOnChange === "function") {
            originalOnChange(e);
          }
        };
      }

      const childProps = { ...(child.props as object) };

      return cloneElement(child, {
        ...commonProps,
        ...childProps,
        ...(maxlength ? { onChange: commonProps.onChange } : {}),
      });
    }
    return child;
  });

  return (
    <div
      className={`space-y-1 wrapper group ${
        disabled ? "skin-form-disabled" : "skin-form "
      }
      }`}
      {...restProps}
    >
      <div className="flex justify-between items-center mx-2 ">
        <div className="flex items-center space-x-2">
          <label className="text-body font-semi-bold" htmlFor={id}>
            {label}
          </label>
          {required && (
            <span className="text-sm font-light soft" aria-hidden="true">
              Required
            </span>
          )}
          {!required && (
            <span className="text-sm font-light soft" aria-hidden="true">
              Optional
            </span>
          )}
        </div>
        {maxlength && (
          <span
            className="text-sm soft "
            aria-hidden="true"
            id={`${id}-char-limit`}
          >
            {inputLength}/{maxlength}
          </span>
        )}
      </div>
      <div className="input-field-wrapper">{childWithProps}</div>
      <div className="input-helper-wrapper">
        {!ariaInvalid && helperText && (
          <p className="text-sm soft ml-2" id={`${id}-helper`}>
            {helperText}
          </p>
        )}
        {ariaInvalid && (
          <Alert
            type="error"
            message={errorMessage || "This field is required."}
          />
        )}
      </div>
    </div>
  );
};

export type { FieldProps };
export default FieldWrapper;
