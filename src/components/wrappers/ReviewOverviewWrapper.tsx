import { ReviewOverview } from "../../../registry/review-overview/review-overview";

export const ReviewOverviewWrapper = () => {
  const onCreate = (type: "CREATE") => {
    console.log(type);
  };
  return (
    <ReviewOverview
      averageRating={3.7}
      ratings={{ 1: 40, 2: 70, 3: 400, 4: 700, 5: 1045 }}
      onCreate={onCreate}
    />
  );
};

export default ReviewOverviewWrapper;
