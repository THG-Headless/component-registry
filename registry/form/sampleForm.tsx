import React, { useRef, useState } from "react";
import { z } from "zod";
import Form, { createValidator } from "./form";
import type { FormRef } from "./form";
import { TextInput } from "../text-input/text-input";
import { TextArea } from "../text-area/text-area";
import Dropdown from "../dropdown/dropdown";
import { FormRating } from "../ratings/form-rating";

import type { FormEvent } from "react";

interface ContactFormData {
  name: string;
  email: string;
  message?: string;
  category: string;
  rating?: number;
}

const nameSchema = z.string().min(1, "Name is required");
const emailSchema = z.string().email("Please enter a valid email address");
const messageSchema = z.string().optional();
const categorySchema = z.string().min(1, "Please select a category");
const ratingSchema = z.number().min(1, "Please select a rating").optional();

export const SampleForm: React.FC = () => {
  const formRef = useRef<FormRef>(null);

  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [formResult, setFormResult] = useState<Record<string, any> | null>(
    null
  );

  const handleSubmit = async (
    data: Record<string, any>,
    event: FormEvent<HTMLFormElement>
  ) => {
    const formData = data as ContactFormData;
    console.log("Form submitted with data:", formData);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setFormResult(formData);
    setSubmitted(true);

    return { success: true };
  };

  const handleReset = () => {
    setSubmitted(false);
    setRating(0);
    setFormResult(null);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="sample-form-container">
      {submitted && formResult && (
        <div className="skin-success p-4 mb-2 rounded">
          <h3 className="font-bold mb-2">Form Submitted Successfully!</h3>
          <p>Form data:</p>
          <pre className="bg-white p-2 mt-2 rounded text-sm overflow-auto">
            {JSON.stringify(formResult, null, 2)}
          </pre>
          <button
            className="btn skin-primary mt-4"
            onClick={() => {
              if (formRef.current) {
                formRef.current.reset();
                handleReset();
              }
            }}
          >
            Reset Form
          </button>
        </div>
      )}

      <Form
        ref={formRef}
        title="Sample Form with Zod Validation"
        description="This form uses Zod schemas for client-side validation. It validates on blur and prevents submission if any fields are invalid."
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitText="Submit Form"
        submittedText="Form Submitted Successfully!"
      >
        <div className="form-field-group">
          <TextInput
            id="name"
            name="name"
            label="Name"
            placeholder="Enter your name"
            helperText="Your full name"
            errorMessage="Name is required"
            required={true}
            requiredText="(Required)"
            optionalText="(Optional)"
            validator={createValidator(nameSchema)}
          />
        </div>

        <div className="form-field-group">
          <TextInput
            id="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            helperText="We'll use this to contact you"
            errorMessage="Please enter a valid email address"
            required={true}
            requiredText="(Required)"
            optionalText="(Optional)"
            validator={createValidator(emailSchema)}
          />
        </div>

        <div className="form-field-group">
          <TextArea
            id="message"
            name="message"
            label="Message"
            placeholder="Enter your message"
            helperText="Tell us what you think"
            errorMessage="Please enter a valid message"
            required={false}
            requiredText="(Required)"
            optionalText="(Optional)"
            validator={createValidator(messageSchema)}
          />
        </div>

        <div className="form-field-group">
          <Dropdown
            label="Category"
            id="category"
            name="category"
            options={["Feedback", "Question", "Support", "Other"]}
            placeholder="Select a category"
            helperText="What type of message is this?"
            errorMessage="Please select a category"
            required={true}
            requiredText="(Required)"
            optionalText="(Optional)"
            className="w-full"
            validator={createValidator(categorySchema)}
          />
        </div>

        <div className="form-field-group">
          <FormRating
            name="rating"
            label="Rating"
            required={false}
            maxRating={5}
            helperText="How would you rate your experience?"
            errorMessage="Please select a rating"
            requiredText="(Required)"
            optionalText="(Optional)"
            iconSize="14px"
            className="w-full"
            value={rating}
            onChange={handleRatingChange}
            validator={createValidator(ratingSchema)}
          />
        </div>
      </Form>
    </div>
  );
};

export default SampleForm;
