/**
 * Sets up event handlers for the "Other" tab controls (border radius, shadow, animation)
 */
export function setupOtherControls() {
  // Border Radius Field
  const radiusField = document.querySelector(
    "[data-radius-field]"
  ) as HTMLInputElement;
  const radiusPresets = document.querySelectorAll(".radius-preset");
  const radiusPreviewElements = document.querySelectorAll(".radius-preview");

  // Function to notify changes
  function notifyRadiusChanged(radius: string) {
    document.dispatchEvent(
      new CustomEvent("borderRadiusChanged", {
        detail: { value: radius },
        bubbles: true,
      })
    );
  }

  // Function to highlight the active preset using background color
  const highlightActivePreset = (activeValue: string) => {
    radiusPresets.forEach((preset) => {
      const presetValue = preset.getAttribute("data-radius") || "";
      if (presetValue === activeValue) {
        preset.classList.remove("bg-zinc-800");
        preset.classList.add("bg-zinc-700");
      } else {
        preset.classList.remove("bg-zinc-700");
        preset.classList.add("bg-zinc-800");
      }
    });
  };

  if (radiusField) {
    // Initialize highlighting for the initial value
    highlightActivePreset(radiusField.value);

    radiusField.addEventListener("input", (e) => {
      const radius = (e.target as HTMLInputElement).value;
      radiusPreviewElements.forEach((element) => {
        (element as HTMLElement).style.borderRadius = radius;
      });

      // Highlight matching preset if the input value matches a preset value
      highlightActivePreset(radius);

      // Notify about the radius change
      notifyRadiusChanged(radius);
    });
  }

  radiusPresets.forEach((preset) => {
    preset.addEventListener("click", () => {
      const radius = preset.getAttribute("data-radius") || "";
      if (radiusField) {
        (radiusField as HTMLInputElement).value = radius;

        // Update all preview elements
        radiusPreviewElements.forEach((element) => {
          (element as HTMLElement).style.borderRadius = radius;
        });

        // Highlight the active preset
        highlightActivePreset(radius);

        // Dispatch an input event to trigger any other listeners
        radiusField.dispatchEvent(new Event("input", { bubbles: true }));

        // Notify about the radius change
        notifyRadiusChanged(radius);
      }
    });
  });

  // Shadow Field
  const shadowField = document.querySelector(
    "[data-shadow-field]"
  ) as HTMLTextAreaElement;
  const shadowPreview = document.querySelector(
    ".shadow-preview"
  ) as HTMLElement;

  if (shadowField && shadowPreview) {
    shadowField.addEventListener("input", (e) => {
      const value = (e.target as HTMLTextAreaElement).value;
      shadowPreview.style.boxShadow = value;
      document.dispatchEvent(
        new CustomEvent("shadowChanged", {
          detail: { value },
          bubbles: true,
        })
      );
    });
  }

  // Handle old-style animation fields if they exist
  document.querySelectorAll("[data-animation-field]").forEach((field) => {
    field.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const name = target.dataset.animationField;
      const value = target.value;

      if (name !== undefined && value !== undefined) {
        // Update preview animation timing if old style buttons exist
        const previewButton = document.querySelector(
          `[data-animation-name="${name}"]`
        ) as HTMLElement;

        if (previewButton) {
          previewButton.style.transitionDuration = `${value}s`;
        }

        // Dispatch event to update data structure
        document.dispatchEvent(
          new CustomEvent("animationTimingChanged", {
            detail: { name, value },
            bubbles: true,
          })
        );
      }
    });

    // Also add change event for when inputs lose focus
    field.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const name = target.dataset.animationField;
      const value = target.value;

      if (name !== undefined && value !== undefined) {
        // Ensure numeric value
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          document.dispatchEvent(
            new CustomEvent("animationTimingChanged", {
              detail: { name, value: numValue },
              bubbles: true,
            })
          );
        }
      }
    });
  });
}
