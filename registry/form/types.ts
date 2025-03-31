import type { ReactNode, FormEvent } from "react";

export type FormValueType = any;

export type FormStateType =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "invalid"; errors: string[] }
  | { status: "valid" }
  | { status: "server_error"; errors: Record<string, string> };

export interface FormContextType<T = Record<string, FormValueType>> {
  values: T;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  formState: FormStateType;
  validators: Record<string, FieldValidator>;

  setFieldValue: (name: string, value: FormValueType) => void;
  getFieldValue: (name: string) => FormValueType;
  setFieldTouched: (name: string, touched: boolean) => void;
  getFieldTouched: (name: string) => boolean;
  getFieldError: (name: string) => string | undefined;
  registerValidator: (name: string, validator: FieldValidator) => void;
  validateField: (name: string, value: FormValueType) => boolean;
  validateAllFields: () => boolean;
  resetForm: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setFormState: (state: FormStateType) => void;
  setErrors: (errors: Record<string, string | undefined>) => void;
}

export interface FormProps<
  T extends Record<string, FormValueType> = Record<string, FormValueType>
> {
  children: ReactNode;
  onSubmit?: (
    formData: T,
    event: FormEvent<HTMLFormElement>
  ) =>
    | void
    | Promise<void>
    | Promise<{ success: boolean; errors?: Record<string, string> }>;
  className?: string;
  disabled?: boolean;
  id?: string;
  errorMessage?: string;
  showError?: boolean;
  title?: string;
  description?: string;
  submitText?: string;
  submittedText?: string;
  initialValues?: Partial<T>;
  onReset?: () => void;
  transformData?: (
    data: Record<string, FormValueType>
  ) => Record<string, FormValueType>;
}

export interface FormRef {
  reset: () => void;
  getFormValues: () => Record<string, FormValueType>;
  setFormValues: (values: Record<string, FormValueType>) => void;
}

export interface FieldValidator {
  safeParse: (value: FormValueType) => { success: boolean; error?: string };
  isRequired?: () => boolean;
}

export interface ErrorSummaryProps {
  errors: Record<string, string | undefined>;
  errorMessage: string;
  onErrorClick?: () => void;
}
