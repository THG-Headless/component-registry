import TextArea from "@registry/text-area/text-area";
import TextInput from "@registry/text-input/text-input";
import Dropdown from "@registry/dropdown/dropdown";
import RatingInput from "@registry/rating-input/rating-input";
import Form from "@registry/form/form";

export const SampleForm = () => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted with data:", data);
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
      <RatingInput
        id="satisfaction"
        name="satisfaction"
        label="Rating"
        errorMessage="Please rate your satisfaction"
        numberOfOptions={5}
        required={true}
      />
      <TextInput
        id="title"
        name="title"
        label="Review Title"
        errorMessage="Name is required"
        required={true}
      />
      <TextArea
        id="message"
        name="message"
        label="Your Review"
        errorMessage="Please provide a review"
        required={true}
        maxLength={5000}
      />
      <TextInput
        id="nickname"
        name="nickname"
        label="Nickname"
        placeholder="Review Title"
        errorMessage="Name is required"
        required={true}
      />
      <Dropdown
        id="age"
        name="age"
        label="Age Range"
        options={["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]}
        placeholder="Select your age range"
        errorMessage="Please select a category"
        required={false}
        className="w-full"
      />
      <Dropdown
        id="gender"
        name="gender"
        label="Gender"
        options={["Male", "Female", "Other"]}
        placeholder="Select your gender"
        errorMessage="Please select a category"
        required={false}
        className="w-full"
      />
    </Form>
  );
};

export default SampleForm;
