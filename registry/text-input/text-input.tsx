import React from "react";
import type { InputHTMLAttributes } from "react";

export const TextInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  return (
    <input
      {...props}
      className={`input-field skin-form !text-body placeholder:soft interactive ${
        props.className || ""
      }`}
    />
  );
};

export default TextInput;
