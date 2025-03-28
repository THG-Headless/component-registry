import React from "react";

interface ProgressBarProps {
  value?: number;
  maxValue?: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 50,
  maxValue = 100,
  label = "Progress",
  className,
}) => {
  const progressValue = Math.max(0, Math.min(value / maxValue, 1));

  return (
    <div
      className={`progress ${className}`}
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
