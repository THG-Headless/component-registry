import { useState, useEffect, useCallback } from "react";
import type { FieldValidator } from "../form/types";

export function useFieldValue(
  externalValue: any,
  fieldValue: any,
  initialValue: any = ""
) {
  const [value, setValue] = useState(
    externalValue || fieldValue || initialValue
  );

  // Update from external props when they change
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  // Update from field value on initial mount
  useEffect(() => {
    if (fieldValue !== undefined && fieldValue !== externalValue) {
      setValue(fieldValue);
    }
  }, []);

  return [value, setValue] as const;
}

export function validateValue(
  validator: FieldValidator | undefined,
  value: any,
  setError?: (error: string | undefined) => void
): boolean {
  if (!validator) return true;

  try {
    const result = validator.safeParse(value);

    if (setError) {
      setError(result.success ? undefined : result.error);
    }

    return result.success;
  } catch (error) {
    console.error("Validation error:", error);

    if (setError) {
      setError(error instanceof Error ? error.message : "Invalid input");
    }

    return false;
  }
}

export function createSetValueHandler(
  setValue: (value: any) => void,
  validator?: FieldValidator,
  setError?: (error: string | undefined) => void
) {
  return useCallback(
    (newValue: any) => {
      setValue(newValue);
      if (validator) {
        validateValue(validator, newValue, setError);
      }
    },
    [setValue, validator, setError]
  );
}

export function createSetTouchedHandler(
  setTouched: (touched: boolean) => void,
  validator?: FieldValidator,
  value?: any,
  setError?: (error: string | undefined) => void
) {
  return useCallback(
    (isTouched: boolean) => {
      setTouched(isTouched);
      if (isTouched && validator && value !== undefined) {
        validateValue(validator, value, setError);
      }
    },
    [setTouched, validator, value, setError]
  );
}

export function createChangeHandler(
  setValue: (value: any) => void,
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
) {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onChange && onChange(e);
    },
    [setValue, onChange]
  );
}

export function createBlurHandler(
  setTouched: (touched: boolean) => void,
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) {
  return useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched(true);
      onBlur && onBlur(e);
    },
    [setTouched, onBlur]
  );
}
