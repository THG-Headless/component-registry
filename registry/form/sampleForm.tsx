import React from "react";
import TextArea from "@registry/text-area/text-area";
import TextInput from "@registry/text-input/text-input";
import Dropdown from "@registry/dropdown/dropdown";
import Form from "@registry/form/form";

export const SampleForm = () => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted with data:", data);
  };
  return (
    <Form
      title="Form"
      description="This is a sample form"
      onSubmit={handleSubmit}
      submitText="Submit Form"
      submittedText="Form Submitted Successfully!"
    >
      <TextInput
        id="name"
        name="name"
        label="Name"
        placeholder="Enter your name"
        helperText="Your full name"
        errorMessage="Name is required"
        required={true}
      />

      <TextInput
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        helperText="We'll use this to contact you"
        errorMessage="Please enter a valid email address"
        required={true}
      />

      <Dropdown
        id="category"
        name="category"
        label="Category"
        options={["Support", "Feedback", "Feature Request", "Bug Report"]}
        placeholder="Select a category"
        helperText="What type of message is this?"
        errorMessage="Please select a category"
        required={true}
        className="w-full"
      />

      <TextArea
        id="message"
        name="message"
        label="Message"
        placeholder="Enter your message"
        helperText="Tell us what you think"
        errorMessage="Please enter a valid message"
      />
    </Form>
  );
};

export default SampleForm;
