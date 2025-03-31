import type { FieldValidator } from "./types";

export function createValidator(schema: any): FieldValidator {
  return {
    safeParse: (value: any) => {
      try {
        const result = schema.safeParse(value);
        return {
          success: result.success,
          error: result.success
            ? undefined
            : result.error?.issues?.[0]?.message || "Validation failed",
        };
      } catch (error) {
        console.error("Validation error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Invalid input",
        };
      }
    },
    isRequired: () => {
      // Determine if schema requires a value
      try {
        return typeof schema.isOptional === "function"
          ? !schema.isOptional()
          : true;
      } catch (error) {
        console.error("Error checking if field is required:", error);
        return false;
      }
    },
  };
}

export function validateField(
  validator: FieldValidator | undefined,
  value: any
): { isValid: boolean; error?: string } {
  if (!validator) return { isValid: true };

  const result = validator.safeParse(value);
  return {
    isValid: result.success,
    error: result.error,
  };
}

export function validateAllFields(
  values: Record<string, any>,
  validators: Record<string, FieldValidator>
): Record<string, string | undefined> {
  const errors: Record<string, string | undefined> = {};

  Object.entries(validators).forEach(([name, validator]) => {
    const value = values[name];
    const { isValid, error } = validateField(validator, value);
    if (!isValid) {
      errors[name] = error;
    }
  });

  return errors;
}
