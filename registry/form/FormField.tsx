import { useCallback, useEffect } from "react";
import { useFormContext } from "./FormContext";
import type { FieldValidator } from "./types";

export function useFormField(name: string, validator?: FieldValidator) {
  const context = useFormContext();

  const {
    getFieldValue,
    setFieldValue,
    getFieldTouched,
    setFieldTouched,
    getFieldError,
    isSubmitting,
    registerValidator,
  } = context;

  useEffect(() => {
    if (validator) {
      registerValidator(name, validator);
    }
  }, [name, validator, registerValidator]);

  const value = getFieldValue(name);
  const touched = getFieldTouched(name);
  const error = getFieldError(name);

  const setValue = useCallback(
    (newValue: any) => {
      setFieldValue(name, newValue);
    },
    [name, setFieldValue]
  );

  const setTouched = useCallback(
    (isTouched: boolean) => {
      setFieldTouched(name, isTouched);
    },
    [name, setFieldTouched]
  );

  const isRequired = validator?.isRequired?.() || false;

  return {
    value,
    setValue,
    touched,
    setTouched,
    error,
    isSubmitting,
    isRequired,
    formControlled: true,
  };
}
