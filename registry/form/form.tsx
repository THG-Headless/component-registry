import React, {
  useState,
  useRef,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import type { FormEvent, ReactElement } from "react";
import Button from "@registry/button/button";
import Alert from "@registry/alert/alert";

interface FormProps {
  title: string;
  description?: string;

  onSubmit: (data: Record<string, any>) => void;
  submitText: string;
  submittedText?: string;

  children?: React.ReactNode;

  className?: string;
  splitLayout?: boolean;
}

export const Form: React.FC<FormProps> = ({
  title,
  description,
  onSubmit,
  submitText = "Submit",
  submittedText,
  children,
  className = "",
  splitLayout = false,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInvalidFields(new Set());

    const form = e.currentTarget;
    const formElements = Array.from(form.elements) as HTMLElement[];
    const newInvalidFields = new Set<string>();

    formElements.forEach((el) => {
      const input = el as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;

      if (input.name && !input.checkValidity()) {
        newInvalidFields.add(input.name);
      }

      if (input.type === "radio" && input.required) {
        const radioInput = input as HTMLInputElement;
        const radioGroup = form.elements.namedItem(
          radioInput.name
        ) as RadioNodeList;

        if (radioGroup && radioGroup[0] === radioInput) {
          const isAnyChecked = Array.from(radioGroup).some(
            (radio) => (radio as HTMLInputElement).checked
          );

          if (!isAnyChecked) {
            newInvalidFields.add(radioInput.name);
          }
        }
      }
    });

    if (newInvalidFields.size > 0) {
      setInvalidFields(newInvalidFields);

      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const formDataObj: Record<string, any> = {};

      formData.forEach((value, key) => {
        if (formDataObj[key]) {
          if (!Array.isArray(formDataObj[key])) {
            formDataObj[key] = [formDataObj[key]];
          }
          formDataObj[key].push(value);
        } else {
          formDataObj[key] = value;
        }
      });

      let isEmptyFunction = false;

      if (typeof onSubmit === "function") {
        const fnString = onSubmit.toString();
        if (fnString) {
          isEmptyFunction = fnString.replace(/\s/g, "") === "()=>{}";
        }
      }

      if (isEmptyFunction || typeof onSubmit !== "function") {
        console.log("Form submitted with empty data:", formDataObj);
        setIsSubmitted(true);
      } else {
        await onSubmit(formDataObj);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const enhanceChildrenWithValidation = (
    children: React.ReactNode
  ): React.ReactNode => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const childElement = child as ReactElement;
      const props = childElement.props as any;

      if (props.name && invalidFields.has(props.name)) {
        const componentType = childElement.type as any;
        const isDropdown =
          componentType &&
          (componentType.name === "Dropdown" ||
            componentType.displayName === "Dropdown" ||
            props.id?.includes("dropdown"));

        const isRatingInput =
          componentType &&
          (componentType.name === "RatingInput" ||
            componentType.displayName === "RatingInput" ||
            props.id?.includes("rating"));

        if (isDropdown) {
          return cloneElement(childElement, {
            ...props,
            error: true,
          } as any);
        } else if (isRatingInput) {
          return cloneElement(childElement, {
            ...props,
            "aria-invalid": true,
          } as any);
        } else {
          return cloneElement(childElement, {
            ...props,
            "aria-invalid": true,
          } as any);
        }
      }

      if (props.children) {
        const newChildren = enhanceChildrenWithValidation(props.children);
        return cloneElement(childElement, props, newChildren);
      }

      return childElement;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`${
          splitLayout ? "flex flex-col md:flex-row md:gap-20" : ""
        }`}
      >
        <div className={`${splitLayout ? "md:w-1/2 mb-6 md:mb-0" : "mb-6"}`}>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          {description && <p>{description}</p>}
        </div>

        <div className={splitLayout ? "md:w-1/2" : ""}>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="skin-form"
            noValidate={true}
          >
            <div className={`${splitLayout ? "space-y-2" : "space-y-4"}`}>
              {enhanceChildrenWithValidation(children)}
            </div>

            <div className={`mt-6 ${!splitLayout ? "flex gap-4" : ""}`}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`skin-primary-emphasised interactive ${
                  splitLayout ? "w-full" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : submitText}
              </Button>
            </div>

            {isSubmitted && submittedText && (
              <div className={splitLayout ? "mt-2" : "mt-4"}>
                {splitLayout ? (
                  <Alert type="success" message="Form successfully submitted" />
                ) : (
                  <div className="p-3 skin-success rounded-site" role="alert">
                    {submittedText}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
