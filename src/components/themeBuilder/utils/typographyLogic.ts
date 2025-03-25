/**
 * Sets up typography controls and real-time preview functionality
 */
export function setupTypographyControls() {
  // Store the typography values for validation
  const typographyValues: Record<
    string,
    Record<string, { font_size: number; line_height: number }>
  > = {
    desktop: {},
    mobile: {},
  };

  // Initialize typographyValues from existing inputs
  document.querySelectorAll("[data-typography-field]").forEach((field) => {
    const target = field as HTMLInputElement;
    const fieldPath = target.getAttribute("data-typography-field");

    if (!fieldPath) return;

    // Parse the field path to get device, size, and property
    const [device, size, property] = fieldPath.split(".");

    if (!typographyValues[device][size]) {
      typographyValues[device][size] = { font_size: 0, line_height: 0 };
    }

    typographyValues[device][size][property as "font_size" | "line_height"] =
      Number(target.value);
  });

  // Add event listeners to all typography input fields
  const typographyFields = document.querySelectorAll("[data-typography-field]");

  typographyFields.forEach((field) => {
    field.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      handleTypographyChange(target);
    });

    // Add change event listeners for real-time JSON updates
    field.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const path = target.getAttribute("data-typography-field");
      const value = target.value;

      if (path) {
        // Dispatch an event for typography changes
        document.dispatchEvent(
          new CustomEvent("typographyChanged", {
            detail: {
              path,
              value,
            },
            bubbles: true,
          })
        );
      }
    });
  });

  // Set up increment and decrement buttons
  document.querySelectorAll("[data-inc-fontsize]").forEach((button) => {
    button.addEventListener("click", () => {
      const fieldPath = (button as HTMLElement).dataset.field;
      if (!fieldPath) return;

      const input = document.querySelector(
        `[data-typography-field="${fieldPath}"]`
      ) as HTMLInputElement;
      if (input) {
        input.value = String(Number(input.value) + 1);
        handleTypographyChange(input);
      }
    });
  });

  document.querySelectorAll("[data-dec-fontsize]").forEach((button) => {
    button.addEventListener("click", () => {
      const fieldPath = (button as HTMLElement).dataset.field;
      if (!fieldPath) return;

      const input = document.querySelector(
        `[data-typography-field="${fieldPath}"]`
      ) as HTMLInputElement;
      if (input) {
        const newValue = Math.max(1, Number(input.value) - 1); // Ensure min value is 1
        input.value = String(newValue);
        handleTypographyChange(input);
      }
    });
  });

  // Initial validation and setup
  updateLineHeightVisualizers();
  validateAllFontSizes();
  validateAllLineHeights();

  /**
   * Handles changes to typography inputs
   */
  function handleTypographyChange(target: HTMLInputElement) {
    const value = Number(target.value);
    const fieldPath = target.getAttribute("data-typography-field");

    if (!fieldPath) return;

    // Parse the field path to get device, size, and property
    const [device, size, property] = fieldPath.split(".");

    // Update our stored value
    if (typographyValues[device] && typographyValues[device][size]) {
      typographyValues[device][size][property as "font_size" | "line_height"] =
        value;
    }

    // Find the preview element to update
    const previewId = `${device}-${size}`;
    const previewElement = document.querySelector(
      `[data-preview-id="${previewId}"]`
    );

    if (previewElement) {
      if (property === "font_size") {
        (previewElement as HTMLElement).style.fontSize = `${value}px`;
        validateFontSize(device, size);
        validateLineHeight(device, size); // Re-validate line height when font size changes
      } else if (property === "line_height") {
        (previewElement as HTMLElement).style.lineHeight = `${value}px`;
        validateLineHeight(device, size);
      }
    }

    // Update line height visualizers
    updateLineHeightVisualizers();

    // Dispatch event for parent components - CHANGE THIS FORMAT
    document.dispatchEvent(
      new CustomEvent("typographyChanged", {
        detail: {
          path: fieldPath,
          value,
        },
        bubbles: true,
      })
    );
  }

  /**
   * Validates a font size against previous and next sizes in the same device
   */
  function validateFontSize(device: string, size: string) {
    // Get all sizes for this device
    const sizes = Object.keys(typographyValues[device]).sort((a, b) => {
      const orderA = getSizeOrder(a);
      const orderB = getSizeOrder(b);
      return orderA - orderB;
    });

    const currentIndex = sizes.indexOf(size);
    if (currentIndex === -1) return;

    const currentSize = typographyValues[device][size].font_size;
    const warningElement = document.querySelector(
      `[data-size-warning="${device}.${size}.font_size"]`
    );

    if (!warningElement) return;

    // Check if smaller than next smaller size
    if (currentIndex > 0) {
      const smallerSize = sizes[currentIndex - 1];
      const smallerValue = typographyValues[device][smallerSize].font_size;

      if (currentSize < smallerValue) {
        warningElement.textContent = `Warning: This size is smaller than ${smallerSize} (${smallerValue}px)`;
        warningElement.classList.remove("hidden");
        return;
      }
    }

    // Check if larger than next larger size
    if (currentIndex < sizes.length - 1) {
      const largerSize = sizes[currentIndex + 1];
      const largerValue = typographyValues[device][largerSize].font_size;

      if (currentSize > largerValue) {
        warningElement.textContent = `Warning: This size is larger than ${largerSize} (${largerValue}px)`;
        warningElement.classList.remove("hidden");
        return;
      }
    }

    // If we get here, there's no warning
    warningElement.textContent = "";
    warningElement.classList.add("hidden");
  }

  /**
   * Updates line height visualizers for all typography previews
   */
  function updateLineHeightVisualizers() {
    document.querySelectorAll(".typography-preview").forEach((preview) => {
      const previewId = (preview as HTMLElement).dataset.previewId;
      if (!previewId) return;

      const topLine = document.querySelector(
        `[data-lineheight-top="${previewId}"]`
      ) as HTMLElement;
      const bottomLine = document.querySelector(
        `[data-lineheight-bottom="${previewId}"]`
      ) as HTMLElement;

      if (topLine && bottomLine) {
        const lineHeight = parseFloat(getComputedStyle(preview).lineHeight);

        // Position top line at 0
        topLine.style.top = "0";

        // Position bottom line at lineHeight
        bottomLine.style.top = `${lineHeight}px`;
      }
    });
  }

  /**
   * Validates all font sizes for potential warnings
   */
  function validateAllFontSizes() {
    for (const device in typographyValues) {
      for (const size in typographyValues[device]) {
        validateFontSize(device, size);
      }
    }
  }

  /**
   * Validates that line height is not less than font size
   */
  function validateLineHeight(device: string, size: string) {
    if (!typographyValues[device] || !typographyValues[device][size]) return;

    const fontSize = typographyValues[device][size].font_size;
    const lineHeight = typographyValues[device][size].line_height;

    const warningElement = document.querySelector(
      `[data-lineheight-warning="${device}.${size}.line_height"]`
    );

    if (!warningElement) return;

    if (lineHeight < fontSize) {
      warningElement.textContent = `Warning: Line height (${lineHeight}px) is less than font size (${fontSize}px)`;
      warningElement.classList.remove("hidden");
    } else {
      warningElement.textContent = "";
      warningElement.classList.add("hidden");
    }
  }

  /**
   * Validates all line heights
   */
  function validateAllLineHeights() {
    for (const device in typographyValues) {
      for (const size in typographyValues[device]) {
        validateLineHeight(device, size);
      }
    }
  }

  /**
   * Gets the numerical order of a size name
   */
  function getSizeOrder(size: string): number {
    const sizeMap: Record<string, number> = {
      xs: 1,
      sm: 2,
      body: 3,
      md: 4,
      lg: 5,
      "2lg": 6,
      xl: 7,
      "2xl": 8,
    };

    return sizeMap[size] || 0;
  }

  // Add event listeners to font weight fields
  const weightFields = document.querySelectorAll("[data-weight-field]");

  weightFields.forEach((field) => {
    field.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const weight = target.getAttribute("data-weight-field");

      if (!weight) return;

      // Update the preview in the same container
      const container = target.closest(".mb-4");
      if (container) {
        const preview = container.querySelector("p.text-zinc-200");
        if (preview) {
          (preview as HTMLElement).style.fontWeight = value;
        }
      }

      // Dispatch event for parent components
      document.dispatchEvent(
        new CustomEvent("fontWeightChanged", {
          detail: { weight, value },
        })
      );
    });
  });

  // Listen for font weight changes from sliders
  document.addEventListener("fontWeightChanged", (e: Event) => {
    const customEvent = e as CustomEvent<{ weight: string; value: number }>;
    const { weight, value } = customEvent.detail;

    document.dispatchEvent(
      new CustomEvent("typographyChanged", {
        detail: {
          path: `weights.${weight}`,
          value,
        },
        bubbles: true,
      })
    );
  });
}
