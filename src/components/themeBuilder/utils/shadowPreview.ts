import { debounce } from "./debounce";
import { rebuildShadowFromInput } from "./shadowManagement";

/**
 * Functions for handling shadow preview updates
 */

/**
 * Get all visible shadow layers and their parameters
 */
function getVisibleShadowDefinitions(): string[] {
  const shadowLayers = document.querySelectorAll(".shadow-layer");
  const visibleShadows: string[] = [];

  shadowLayers.forEach((layer) => {
    if (layer.getAttribute("data-shadow-visible") !== "false") {
      // Get the shadow index
      const index = layer.getAttribute("data-shadow-index");
      if (index === null) return;

      try {
        // Find all parameter inputs in this layer
        const horizontalOffsetEl = layer.querySelector(
          `[data-param="horizontalOffset"]`
        );
        const verticalOffsetEl = layer.querySelector(
          `[data-param="verticalOffset"]`
        );
        const blurRadiusEl = layer.querySelector(`[data-param="blurRadius"]`);
        const spreadRadiusEl = layer.querySelector(
          `[data-param="spreadRadius"]`
        );
        const colorEl = layer.querySelector(`[data-param="color"]`);
        const isInsetEl = layer.querySelector(`[data-param="isInset"]`);

        // Get values with proper type checking
        const horizontalOffset =
          horizontalOffsetEl instanceof HTMLInputElement
            ? horizontalOffsetEl.value
            : "0";
        const verticalOffset =
          verticalOffsetEl instanceof HTMLInputElement
            ? verticalOffsetEl.value
            : "0";
        const blurRadius =
          blurRadiusEl instanceof HTMLInputElement ? blurRadiusEl.value : "0";
        const spreadRadius =
          spreadRadiusEl instanceof HTMLInputElement
            ? spreadRadiusEl.value
            : "0";
        const color =
          colorEl instanceof HTMLInputElement
            ? colorEl.value
            : "rgba(0,0,0,0.1)";
        const isInset =
          isInsetEl instanceof HTMLInputElement ? isInsetEl.checked : false;

        // Construct the shadow string
        const shadowDef = `${
          isInset ? "inset " : ""
        }${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px ${color}`;
        visibleShadows.push(shadowDef);
      } catch (err) {
        console.warn("Error building shadow definition:", err);
      }
    }
  });

  return visibleShadows;
}

/**
 * Apply shadow definitions to the preview and update the field
 */
function applyShadowToPreview(shadowDefinition: string): void {
  const preview = document.querySelector(".shadow-preview");
  const shadowField = document.querySelector("[data-shadow-field]");

  if (!preview || !shadowField) return;

  // Update the preview
  if (preview instanceof HTMLElement) {
    preview.style.boxShadow = shadowDefinition;
  }

  // Update the complete shadow value text
  if (shadowField instanceof HTMLTextAreaElement) {
    shadowField.value = shadowDefinition;
  }
}

/**
 * Sets up shadow preview updates and synchronization with the data structure
 */
export function setupShadowPreviewUpdates(): void {
  /**
   * Updates the shadow preview box and shadow value field
   */
  function updateShadowPreview() {
    try {
      // Get all shadow layers
      const shadowLayers = document.querySelectorAll(".shadow-layer");
      const shadowPreview = document.querySelector(
        ".shadow-preview"
      ) as HTMLElement;
      const shadowField = document.querySelector(
        "[data-shadow-field]"
      ) as HTMLTextAreaElement;

      if (!shadowPreview || !shadowField) return;

      // Build the shadow CSS string
      let shadowCSS = "";
      let activeLayers = 0;

      shadowLayers.forEach((layer) => {
        if (layer.getAttribute("data-shadow-visible") === "false") {
          return; // Skip hidden layers
        }

        const horizontalOffset =
          layer.querySelector("[data-param='horizontalOffset']")?.value || "0";
        const verticalOffset =
          layer.querySelector("[data-param='verticalOffset']")?.value || "0";
        const blurRadius =
          layer.querySelector("[data-param='blurRadius']")?.value || "0";
        const spreadRadius =
          layer.querySelector("[data-param='spreadRadius']")?.value || "0";
        const color =
          layer.querySelector("[data-param='color']")?.value ||
          "rgba(0,0,0,0.1)";
        const isInset = layer.querySelector("[data-param='isInset']")?.checked;

        // Update the summary text for each layer
        const shadowDetailText = layer.querySelector(
          ".shadow-summary .text-zinc-400"
        );
        if (shadowDetailText) {
          shadowDetailText.textContent = `${
            isInset ? "inset " : ""
          }${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px`;
        }

        // Add to shadow CSS
        if (shadowCSS) shadowCSS += ", ";
        shadowCSS += `${
          isInset ? "inset " : ""
        }${horizontalOffset}px ${verticalOffset}px ${blurRadius}px ${spreadRadius}px ${color}`;
        activeLayers++;
      });

      // If no active layers, use a default shadow
      if (activeLayers === 0) {
        shadowCSS = "none";
      }

      // Update the preview and field
      shadowPreview.style.boxShadow = shadowCSS;
      shadowField.value = shadowCSS;

      // Dispatch event to update the data structure
      document.dispatchEvent(
        new CustomEvent("shadowChanged", {
          detail: { value: shadowCSS },
          bubbles: true,
        })
      );
    } catch (error) {
      console.error("Error updating shadow preview:", error);
    }
  }

  // Create a debounced version of the function
  const debouncedUpdateShadowPreview = debounce(updateShadowPreview, 50);

  // Expose the debounced function globally so it can be called from other modules
  (window as any).updateShadowPreview = debouncedUpdateShadowPreview;

  // Make sure rebuildShadowFromInput is exposed globally
  (window as any).rebuildShadowFromInput = rebuildShadowFromInput;

  // No need for immediate initial update that would overwrite stored values
  // The styleManager's synchronizeUIWithStyles will handle the initial state
  // This ensures we don't accidentally overwrite the value from local storage

  // Instead, add a specific function for initial update based on stored values
  (window as any).initializeShadowPreviewFromStored = function (
    shadowValue: string
  ) {
    if (!shadowValue) return;

    const shadowPreview = document.querySelector(
      ".shadow-preview"
    ) as HTMLElement;
    const shadowField = document.querySelector(
      "[data-shadow-field]"
    ) as HTMLTextAreaElement;

    if (shadowPreview) {
      shadowPreview.style.boxShadow = shadowValue;
    }

    if (shadowField) {
      shadowField.value = shadowValue;
    }
  };

  // Use event delegation for all input events
  document.addEventListener("input", (e) => {
    if (!(e.target instanceof HTMLElement)) return;

    const shadowLayer = e.target.closest(".shadow-layer");
    if (!shadowLayer) return;

    // Check if this layer is currently visible
    const isVisible =
      shadowLayer.getAttribute("data-shadow-visible") !== "false";

    // If layer is visible, update the preview
    if (
      isVisible &&
      (e.target.hasAttribute("data-param") ||
        e.target.classList.contains("shadow-color-select") ||
        e.target.classList.contains("shadow-opacity"))
    ) {
      debouncedUpdateShadowPreview();
    }
  });

  // Use event delegation for checkbox changes
  document.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;

    const shadowLayer = e.target.closest(".shadow-layer");
    if (!shadowLayer) return;

    // Check if this layer is currently visible
    const isVisible =
      shadowLayer.getAttribute("data-shadow-visible") !== "false";

    // If layer is visible and this is the inset checkbox, update the preview
    if (isVisible && e.target.dataset.param === "isInset") {
      debouncedUpdateShadowPreview();
    }
  });
}
