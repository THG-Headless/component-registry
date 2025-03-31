import type { FormEvent } from "react";
import type { FormContextType } from "./types";

export function processFormData(
  form: HTMLFormElement,
  transformData?: (data: Record<string, any>) => Record<string, any>
): Record<string, any> {
  const formData = new FormData(form);
  const formDataObj: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (key.endsWith("[]")) {
      const arrayKey = key.slice(0, -2);
      if (!formDataObj[arrayKey]) {
        formDataObj[arrayKey] = [];
      }
      formDataObj[arrayKey].push(value);
    } else if (key.includes(".")) {
      const parts = key.split(".");
      let current = formDataObj;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;
    } else {
      formDataObj[key] = value;
    }
  }

  if (transformData) {
    return transformData(formDataObj);
  }

  return formDataObj;
}

interface HandleFormSubmissionOptions {
  disabled?: boolean;
  errorMessage?: string;
  onSubmit?: (
    data: Record<string, any>,
    event: FormEvent<HTMLFormElement>
  ) => any;
  transformData?: (data: Record<string, any>) => Record<string, any>;
}

export async function handleFormSubmission(
  event: FormEvent<HTMLFormElement>,
  formContext: FormContextType,
  options: HandleFormSubmissionOptions
) {
  event.preventDefault();

  const {
    disabled,
    errorMessage = "Form submission error",
    onSubmit,
    transformData,
  } = options;
  const {
    isSubmitting,
    setIsSubmitting,
    values,
    setFormState,
    validateAllFields,
    setErrors,
    setFieldTouched,
  } = formContext;

  if (disabled || isSubmitting) return;

  setIsSubmitting(true);

  const form = event.currentTarget;
  const formDataObj = processFormData(form, transformData);

  const formElements = Array.from(form.elements);
  formElements.forEach((element: any) => {
    if (element.name) {
      setFieldTouched(element.name, true);
    }
  });

  const isValid = validateAllFields();

  if (!isValid) {
    setFormState({ status: "invalid", errors: [errorMessage] });
    setIsSubmitting(false);
    return;
  }

  setFormState({ status: "submitting" });

  if (onSubmit) {
    try {
      const result = onSubmit(formDataObj, event);

      if (result instanceof Promise) {
        const resolvedResult = await result;

        if (
          resolvedResult &&
          typeof resolvedResult === "object" &&
          "success" in resolvedResult
        ) {
          if (resolvedResult.success) {
            setFormState({ status: "valid" });
          } else if (resolvedResult.errors) {
            setErrors(resolvedResult.errors);
            setFormState({
              status: "server_error",
              errors: resolvedResult.errors,
            });
          } else {
            setFormState({ status: "invalid", errors: [errorMessage] });
          }
        } else {
          setFormState({ status: "valid" });
        }
      } else {
        setFormState({ status: "valid" });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setFormState({ status: "invalid", errors: [errorMessage] });
    } finally {
      setIsSubmitting(false);
    }
  } else {
    setFormState({ status: "valid" });
    setIsSubmitting(false);
  }
}
