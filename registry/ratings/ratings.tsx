import React from "react";

interface RatingsProps {
  rating?: number;
  maxRating?: number;
  iconCount?: number;
  iconSize?: string;
  icon?: string;
  variant?: "primary" | "secondary" | "tertiary";
  ariaLabel?: string;
}

export const Ratings: React.FC<RatingsProps> = ({
  rating = 2.5,
  maxRating = 5,
  iconCount = 5,
  iconSize = "24px",
  icon = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='2 2 20 20'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E\")",
  variant = "secondary",
  ariaLabel,
}) => {
  // Calculate rating percentage (0-1 scale)
  const ratingPercentage = Math.max(0, Math.min(rating / maxRating, 1));

  // Generate default aria label if none provided
  const defaultAriaLabel = `Rating: ${rating} out of ${maxRating}`;
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  // Define styles with the four specific CSS variables
  const styles: React.CSSProperties = {
    "--rating-icon-count": iconCount,
    "--rating-icon-size": iconSize,
    "--rating-percentage": ratingPercentage,
    "--rating-icon": icon,
  } as React.CSSProperties;

  return (
    <div
      className={`skin-${variant} rating wrapper`}
      style={styles as React.CSSProperties}
      role="meter"
      aria-label={finalAriaLabel}
      aria-valuemin={0}
      aria-valuemax={maxRating}
      aria-valuenow={rating}
    ></div>
  );
};

export default Ratings;
