import React, { useState } from "react";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

export const TextArea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = (
  props
) => {
  return (
    <div className="skin-form input-wrapper w-full">
      <textarea
        {...props}
        className={`input-field !text-body placeholder:soft interactive ${
          props.className || ""
        }`}
      />
      <svg
        className="resize-handle soft"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path d="M12.9627 2L2 12.9843L3.01375 14L13.9764 3.01575L12.9627 2Z" />
        <path d="M6.50295 12.9843L12.9862 6.48819L14 7.50394L7.5167 14L6.50295 12.9843Z" />
        <path d="M11.0766 12.937L12.9862 11.0236L14 12.0394L12.0904 13.9528L11.0766 12.937Z" />
      </svg>
    </div>
  );
};

export default TextArea;
