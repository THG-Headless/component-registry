import Form from "@/registry/form/form";
import TextInputField from "@/registry/fields/text-input-field";
import RatingInputField from "@/registry/fields/rating-input-field";
import TextAreaField from "@/registry/fields/text-area-field";
import DropdownField from "@/registry/fields/dropdown-field";

export const SampleForm = () => {
  const handleSubmit = (data: Record<string, any>) => {
    console.warn(
      "This is a placeholder for the form submission logic. You can replace this with your own implementation.\n\nData submitted:\n",
      data
    );
  };
  return (
    <Form
      title="Submit A Review"
      description="We value your honest feedback about your experience with our product. Please be specific about what you liked or disliked, including any features that stood out to you. If applicable, mention how long you've been using our product, any issues you encountered, and suggestions for improvement. Detailed reviews help us enhance our offerings and assist other customers in making informed decisions. Thank you for taking the time to share your thoughts!"
      onSubmit={handleSubmit}
      submitText="Submit Review"
      submittedText="Review Submitted Successfully!"
      splitLayout={true}
    >
      <RatingInputField
        id="satisfaction"
        name="satisfaction"
        label="Rating"
        errorMessage="Please rate your satisfaction"
        numberOfOptions={5}
        required={true}
      />
      <TextInputField
        id="title"
        name="title"
        label="Review Title"
        errorMessage="Name is required"
        required={true}
      />
      <TextAreaField
        id="message"
        name="message"
        label="Your Review"
        errorMessage="Please provide a review"
        required={true}
        maxlength={5000}
      />
      <TextInputField
        id="nickname"
        name="nickname"
        label="Nickname"
        placeholder="Review Title"
        errorMessage="Name is required"
        required={true}
      />
      <DropdownField
        id="age"
        name="age"
        label="Age Range"
        options={["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]}
        placeholder="Select your age range"
        errorMessage="Please select a category"
        required={false}
      />
      <DropdownField
        id="gender"
        name="gender"
        label="Gender"
        options={["Male", "Female", "Other"]}
        placeholder="Select your gender"
        errorMessage="Please select a category"
        required={false}
      />
    </Form>
  );
};

export default SampleForm;
