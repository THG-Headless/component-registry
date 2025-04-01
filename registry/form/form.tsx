import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import type { FormEvent } from "react";
import { FormProvider, useFormContext } from "./FormContext";
import { handleFormSubmission } from "./FormSubmission";
import type { FormProps, FormRef, ErrorSummaryProps } from "./types";
import ErrorBoundary from "../utils/ErrorBoundary";

const ErrorSummary: React.FC<ErrorSummaryProps> = ({
  errors,
  errorMessage,
  onErrorClick,
}) => {
  const hasErrors = Object.values(errors).some((error) => !!error);

  if (!hasErrors) return null;

  return (
    <div className="form-error-summary mb-4" role="alert" aria-live="assertive">
      <div className="skin-error input-error-content">
        <svg
          className="input-error-icon"
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
        <p
          className="input-error text-sm font-bold"
          onClick={onErrorClick}
          tabIndex={onErrorClick ? 0 : undefined}
          role="button"
          aria-pressed="false"
        >
          {errorMessage}
        </p>
      </div>
    </div>
  );
};

const FormComponent = forwardRef<
  FormRef,
  Omit<FormProps, "initialValues" | "onReset">
>(
  (
    {
      children,
      onSubmit,
      className = "",
      disabled = false,
      id = "form",
      errorMessage = "There was an error with your submission. Please check the form and try again.",
      showError = false,
      title,
      description,
      submitText = "Submit",
      submittedText = "Form Submitted",
      transformData,
    },
    ref
  ) => {
    const formRef = useRef<HTMLFormElement>(null);
    const firstErrorRef = useRef<HTMLDivElement>(null);

    const context = useFormContext();
    const {
      errors,
      isSubmitting,
      formState,
      resetForm,
      values,
      setFieldValue,
    } = context;

    useImperativeHandle(
      ref,
      () => ({
        reset: resetForm,
        getFormValues: () => values,
        setFormValues: (newValues: Record<string, any>) => {
          Object.entries(newValues).forEach(([key, value]) => {
            setFieldValue(key, value);
          });
        },
      }),
      [values, resetForm, setFieldValue]
    );

    useEffect(() => {
      if (formState.status === "invalid" && firstErrorRef.current) {
        firstErrorRef.current.focus();
      }
    }, [formState]);

    const buttonText = isSubmitting
      ? "Submitting..."
      : formState.status === "valid"
      ? submittedText
      : submitText;

    const buttonClass =
      formState.status === "valid" ? "skin-success" : "skin-primary";

    // Add loading spinner to button when submitting
    const ButtonContent = () => {
      if (isSubmitting) {
        return (
          <>
            <span className="spinner mr-2"></span>
            {buttonText}
          </>
        );
      }
      return buttonText;
    };

    return (
      <div className="skin-form form-wrapper w-full wrapper group space-y-8">
        {title && (
          <div className="form-header">
            <h2
              id={`form-title-${id}`}
              className="form-title text-xl font-bold"
            >
              {title}
            </h2>
            {description && (
              <p className="form-description text-sm soft">{description}</p>
            )}
          </div>
        )}

        <form
          ref={formRef}
          id={id}
          className={`form ${className}`}
          onSubmit={(e) =>
            handleFormSubmission(e, context, {
              disabled,
              errorMessage,
              onSubmit,
              transformData,
            })
          }
          noValidate={true}
          aria-disabled={disabled}
          aria-labelledby={title ? `form-title-${id}` : undefined}
        >
          {formState.status === "invalid" && (
            <ErrorSummary
              errors={errors}
              errorMessage={errorMessage}
              onErrorClick={() => {
                if (firstErrorRef.current) {
                  firstErrorRef.current.focus();
                }
              }}
            />
          )}

          <div className="form-content space-y-4">{children}</div>

          <div className="form-actions mt-6">
            <button
              type="submit"
              className={`btn w-full ${buttonClass} ${
                isSubmitting ? "loading" : ""
              }`}
              disabled={disabled || isSubmitting}
              aria-busy={isSubmitting}
            >
              <ButtonContent />
            </button>
            {formState.status === "invalid" && (
              <div
                ref={firstErrorRef}
                className="form-error-message mb-4 text-left skin-error bg-transparent"
                role="alert"
                aria-live="assertive"
                tabIndex={-1}
              >
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
);

const Form = forwardRef<FormRef, FormProps>(
  ({ children, initialValues = {}, onReset, ...props }, ref) => {
    return (
      <ErrorBoundary
        fallback={
          <div className="form-error-fallback" role="alert">
            <h3>There was an error rendering this form.</h3>
            <p>
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        }
        onError={(error) => {
          console.error("Form error caught by ErrorBoundary:", error);
          // You could add error reporting here
        }}
      >
        <FormProvider initialValues={initialValues} onReset={onReset}>
          <FormComponent ref={ref} {...props}>
            {children}
          </FormComponent>
        </FormProvider>
      </ErrorBoundary>
    );
  }
);

Form.displayName = "Form";

export default Form;

export { useFormContext } from "./FormContext";
export { useFormField } from "./FormField";
export { createValidator } from "./FormValidation";
export type {
  FormContextType,
  FormProps,
  FormRef,
  FieldValidator,
} from "./types";
