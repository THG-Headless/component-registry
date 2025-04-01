import React, { useState, useEffect } from "react";
import { useSafeFormContext } from "./FormContext";
import { useFormField } from "./form";
import type { FieldValidator } from "./types";
import ErrorBoundary from "../utils/ErrorBoundary";
import {
  validateValue,
  createSetValueHandler,
  createSetTouchedHandler,
} from "../utils/formFieldUtils";

export interface FieldInterface {
  value: any;
  setValue: (value: any) => void;
  touched: boolean;
  setTouched: (touched: boolean) => void;
  error?: string;
  isSubmitting: boolean;
  isRequired: boolean;
  formControlled: boolean;
}

interface FieldProviderProps {
  name?: string;
  initialValue?: any;
  validator?: FieldValidator;
  children: (field: FieldInterface) => React.ReactNode;
}

export const FieldProvider: React.FC<FieldProviderProps> = ({
  name,
  initialValue = "",
  validator,
  children,
}) => {
  // Try to get form context without throwing
  const formContext = useSafeFormContext();

  // State for standalone mode
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Determine if we're in form mode or standalone mode
  const isFormMode = !!formContext && !!name;

  // Use utility functions for validation and state management
  const handleSetValue = createSetValueHandler(setValue, validator, setError);

  // Touched setter for standalone mode
  const handleSetTouched = createSetTouchedHandler(
    setTouched,
    validator,
    value,
    setError
  );

  // Initialize with initial value
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== value) {
      handleSetValue(initialValue);
    }
  }, [initialValue, handleSetValue, value]);

  // Create standalone field interface
  const standaloneField: FieldInterface = {
    value,
    setValue: handleSetValue,
    touched,
    setTouched: handleSetTouched,
    error,
    isSubmitting: false,
    isRequired: validator?.isRequired?.() || false,
    formControlled: false,
  };

  // If we're in form mode, use the form field
  if (isFormMode && name) {
    try {
      const formField = useFormField(name, validator);
      return <>{children(formField)}</>;
    } catch (error) {
      // If there's an error with the form field, fall back to standalone mode
      console.warn("Form field error, falling back to standalone mode:", error);
      return <>{children(standaloneField)}</>;
    }
  }

  // Wrap with ErrorBoundary and use standalone field
  return (
    <ErrorBoundary
      fallback={
        <div className="field-error-fallback" role="alert">
          <p>There was an error rendering this field component.</p>
        </div>
      }
    >
      {children(standaloneField)}
    </ErrorBoundary>
  );
};

export default FieldProvider;
