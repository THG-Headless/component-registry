import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { FormContextType, FieldValidator, FormStateType } from "./types";
import { validateField, validateAllFields } from "./FormValidation";

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useSafeFormContext() {
  const context = useContext(FormContext);
  return context; // Returns undefined if not in a FormProvider
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}

interface FormProviderProps {
  children: React.ReactNode;
  initialValues?: Record<string, any>;
  onReset?: () => void;
}

export function FormProvider({
  children,
  initialValues = {},
  onReset,
}: FormProviderProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validators, setValidators] = useState<Record<string, FieldValidator>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormStateType>({ status: "idle" });

  const validateAndUpdateField = useCallback(
    (name: string, value: any) => {
      if (!validators[name]) return true;

      const { isValid, error } = validateField(validators[name], value);
      setErrors((prev) => ({ ...prev, [name]: isValid ? undefined : error }));
      return isValid;
    },
    [validators]
  );

  const setFieldValue = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      validateAndUpdateField(name, value);
    },
    [validateAndUpdateField]
  );

  const getFieldValue = useCallback((name: string) => values[name], [values]);

  const setFieldTouched = useCallback(
    (name: string, isTouched: boolean) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));

      if (isTouched) {
        validateAndUpdateField(name, values[name]);
      }
    },
    [validateAndUpdateField, values]
  );

  const getFieldTouched = useCallback(
    (name: string) => touched[name] || false,
    [touched]
  );

  const getFieldError = useCallback((name: string) => errors[name], [errors]);

  const registerValidator = useCallback(
    (name: string, validator: FieldValidator) => {
      setValidators((prev) => ({ ...prev, [name]: validator }));
    },
    [setValidators]
  );

  const validateFieldByName = useCallback(
    (name: string, value: any) => {
      return validateAndUpdateField(name, value);
    },
    [validateAndUpdateField]
  );

  const validateAllFieldsInForm = useCallback(() => {
    const validationErrors = validateAllFields(values, validators);
    const hasErrors = Object.values(validationErrors).some((error) => !!error);

    setErrors(validationErrors);
    return !hasErrors;
  }, [values, validators]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setFormState({ status: "idle" });
    setIsSubmitting(false);

    if (onReset) {
      onReset();
    }
  }, [initialValues, onReset]);

  const fieldState = useMemo(
    () => ({
      values,
      errors,
      touched,
      isSubmitting,
      isValid: formState.status === "valid",
      formState,
      validators,
    }),
    [values, errors, touched, isSubmitting, formState, validators]
  );

  const fieldOperations = useMemo(
    () => ({
      setFieldValue,
      getFieldValue,
      setFieldTouched,
      getFieldTouched,
      getFieldError,
      registerValidator,
      validateField: validateFieldByName,
      validateAllFields: validateAllFieldsInForm,
    }),
    [
      setFieldValue,
      getFieldValue,
      setFieldTouched,
      getFieldTouched,
      getFieldError,
      registerValidator,
      validateFieldByName,
      validateAllFieldsInForm,
    ]
  );

  const formOperations = useMemo(
    () => ({
      resetForm,
      setIsSubmitting,
      setFormState,
      setErrors,
    }),
    [resetForm, setIsSubmitting, setFormState, setErrors]
  );

  const contextValue = useMemo(
    () => ({
      ...fieldState,
      ...fieldOperations,
      ...formOperations,
    }),
    [fieldState, fieldOperations, formOperations]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}
