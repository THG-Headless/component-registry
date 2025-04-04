import React, { useState, useRef, useEffect } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";

interface RatingInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value" | "type" | "defaultValue"
  > {
  numberOfOptions?: number;
  defaultValue?: number | null;
  value?: number | null;
  onChange?: (value: number | null) => void;
  className?: string;
}

export const RatingInput: React.FC<RatingInputProps> = ({
  id = "rating-input",
  name = "rating",
  disabled = false,
  required,
  numberOfOptions = 5,
  defaultValue,
  value,
  className = "",
  onChange,
  ...restProps
}) => {
  const calculateDefaultValue = () => {
    if (value !== undefined) return value;
    if (defaultValue !== undefined) return defaultValue;
    return null;
  };

  const [selectedRating, setSelectedRating] = useState<number | null>(
    calculateDefaultValue()
  );

  useEffect(() => {
    if (value !== undefined && value !== selectedRating) {
      setSelectedRating(value);
    }
  }, [value]);

  const radioGroupRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSelectedRating(newValue);
    onChange && onChange(newValue);
  };

  return (
    <div
      className={`rating-input skin-primary wrapper [--rating-icon-size:32px] ${className}`}
      ref={radioGroupRef}
      role="radiogroup"
      aria-required={required ? "true" : "false"}
    >
      {Array.from({ length: numberOfOptions }, (_, index) => {
        const ratingValue = index + 1;
        const optionId = `${id}-${ratingValue}`;

        return (
          <input
            key={optionId}
            type="radio"
            id={optionId}
            name={name}
            value={ratingValue}
            checked={selectedRating === ratingValue}
            onChange={handleChange}
            aria-label={`${ratingValue} ${
              ratingValue === 1 ? "star" : "stars"
            }`}
            disabled={disabled}
            required={required && selectedRating === null}
            {...restProps}
          />
        );
      })}
    </div>
  );
};

export default RatingInput;
