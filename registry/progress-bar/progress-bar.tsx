import React from "react";

interface ProgressBarProps {
  value?: number;
  maxValue?: number;
  variant?: "primary" | "secondary" | "tertiary";
  labelId?: string;
  label?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 50,
  maxValue = 100,
  variant = "primary",
  label = "Progress",
}) => {
  const progressValue = Math.max(0, Math.min(value / maxValue, 1));

  return (
    <div
      className={`skin-${variant} progress`}
      style={{ "--progress-value": progressValue } as React.CSSProperties}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuenow={value}
      aria-label={label}
    ></div>
  );
};

export default ProgressBar;
