import Dropdown from "@registry/dropdown/dropdown";
import FieldWrapper from "@registry/field-wrapper/field-wrapper";
import type { FieldProps } from "@registry/field-wrapper/field-wrapper";

import type { SelectHTMLAttributes } from "react";
import type { DropdownProps as BaseDropdownProps } from "@registry/dropdown/types";

// Extract dropdown-specific props that aren't in FieldProps
type DropdownSpecificProps = {
  options?: string[];
  enableSearch?: boolean;
  noOptionsMessage?: string;
  searchPlaceholder?: string;
  value?: string;
  error?: boolean;
};

interface DropdownFieldProps
  extends FieldProps,
    DropdownSpecificProps,
    Omit<
      SelectHTMLAttributes<HTMLSelectElement>,
      | "id"
      | "name"
      | "placeholder"
      | "disabled"
      | "required"
      | "aria-invalid"
      | "onChange"
      | "value"
    > {
  onChange?: (e: any) => void;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  id,
  name,
  label,
  helperText,
  errorMessage,
  placeholder,
  required = false,
  "aria-invalid": ariaInvalid = false,
  disabled = false,
  options = [],
  enableSearch = false,
  noOptionsMessage = "No options available",
  searchPlaceholder = "Search...",
  onChange,
  value,
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
        placeholder={placeholder}
        required={required}
        aria-invalid={ariaInvalid}
        disabled={disabled}
      >
        <Dropdown
          options={options}
          disabled={disabled}
          required={required}
          error={ariaInvalid}
          errorMessage={errorMessage}
          enableSearch={enableSearch}
          noOptionsMessage={noOptionsMessage}
          searchPlaceholder={searchPlaceholder}
          onChange={onChange}
          value={value}
          className="w-full"
          {...restProps}
        />
      </FieldWrapper>
    </div>
  );
};

export default DropdownField;
