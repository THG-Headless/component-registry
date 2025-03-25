/**
 * Functions for managing shadow layer UI controls and interactions
 */

/**
 * Helper debounce function for UI operations
 */
function debounce(func: Function, wait = 100) {
  let timeout: number | undefined;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as unknown as number;
  };
}

/**
 * Set up toggle functionality for shadow layer expansion with improved event delegation
 */
export function setupShadowLayerToggles(): void {
  // Use event delegation for toggle buttons
  document.addEventListener("click", (e) => {
    const button = (e.target as Element).closest(".toggle-expand");
    if (!button) return;

    const layer = button.closest(".shadow-layer");
    if (!layer) return;

    const details = layer.querySelector(".shadow-details");
    const expandIcon = button.querySelector(".expand-icon");
    const collapseIcon = button.querySelector(".collapse-icon");

    if (!details || !expandIcon || !collapseIcon) return;

    const isHidden = details.classList.contains("hidden");

    if (isHidden) {
      details.classList.remove("hidden");
      expandIcon.classList.add("hidden");
      collapseIcon.classList.remove("hidden");
    } else {
      details.classList.add("hidden");
      expandIcon.classList.remove("hidden");
      collapseIcon.classList.add("hidden");
    }
  });
}

/**
 * Set up toggle functionality for a single shadow layer
 */
export function setupSingleLayerToggles(layer: Element): void {
  const toggleButton = layer.querySelector(".toggle-expand");
  if (!toggleButton) return;

  toggleButton.addEventListener("click", (e) => {
    // Prevent event propagation to avoid triggering the global handler
    e.stopPropagation();

    const details = layer.querySelector(".shadow-details");
    const expandIcon = toggleButton.querySelector(".expand-icon");
    const collapseIcon = toggleButton.querySelector(".collapse-icon");

    if (!details || !expandIcon || !collapseIcon) return;

    const isHidden = details.classList.contains("hidden");

    if (isHidden) {
      details.classList.remove("hidden");
      expandIcon.classList.add("hidden");
      collapseIcon.classList.remove("hidden");
    } else {
      details.classList.add("hidden");
      expandIcon.classList.remove("hidden");
      collapseIcon.classList.add("hidden");
    }
  });
}

/**
 * Setup visibility toggle functionality with improved efficiency
 */
export function setupShadowVisibilityToggles(): void {
  // Use event delegation for visibility toggles
  document.addEventListener("click", (e) => {
    const button = (e.target as Element).closest("[data-shadow-visibility]");
    if (!button || !(button instanceof HTMLElement)) return;

    // Find the parent shadow layer
    const layer = button.closest(".shadow-layer");
    if (!layer) return;

    // Get the visibility icons
    const visibleIcon = button.querySelector(".visible-icon");
    const hiddenIcon = button.querySelector(".hidden-icon");
    if (!visibleIcon || !hiddenIcon) return;

    // Toggle visibility state
    const isVisible = layer.getAttribute("data-shadow-visible") !== "false";
    const newState = !isVisible;

    // Update the layer's visibility attribute
    layer.setAttribute("data-shadow-visible", newState ? "true" : "false");

    // Toggle icon visibility
    if (newState) {
      visibleIcon.classList.remove("hidden");
      hiddenIcon.classList.add("hidden");
    } else {
      visibleIcon.classList.add("hidden");
      hiddenIcon.classList.remove("hidden");
    }

    // Get all form controls in this layer
    const controls = layer.querySelectorAll("input, select");

    // Toggle controls enabled/disabled state based on visibility
    controls.forEach((control) => {
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLSelectElement
      ) {
        control.disabled = !newState;
        if (!newState) {
          // Store the current value/checked state
          if (control.type === "checkbox" || control.type === "radio") {
            control.setAttribute(
              "data-last-checked",
              control.checked ? "true" : "false"
            );
          } else {
            control.setAttribute("data-last-value", control.value);
          }
        }
      }
    });

    // Update the preview with only visible shadows
    if (typeof (window as any).updateShadowPreview === "function") {
      setTimeout(() => (window as any).updateShadowPreview(), 0);
    }
  });

  // Initial setup - ensure correct disabled state for all controls
  document.querySelectorAll(".shadow-layer").forEach((layer) => {
    const isVisible = layer.getAttribute("data-shadow-visible") !== "false";
    if (!isVisible) {
      const controls = layer.querySelectorAll("input, select");
      controls.forEach((control) => {
        if (
          control instanceof HTMLInputElement ||
          control instanceof HTMLSelectElement
        ) {
          control.disabled = true;
        }
      });
    }
  });
}

/**
 * Setup range sliders with optimized updates
 */
export function setupRangeSliders(layer: Element): void {
  // Setup range slider fill effect
  const rangeInputs = layer.querySelectorAll('input[type="range"]');
  rangeInputs.forEach((input) => {
    if (!(input instanceof HTMLInputElement)) return;

    const updateRangeFill = debounce((e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target) return;

      const min = target.min || "0";
      const max = target.max || "100";
      const val = target.value || "0";

      try {
        const percentage =
          ((parseInt(val) - parseInt(min)) * 100) /
          (parseInt(max) - parseInt(min));
        target.style.backgroundSize = `${
          isNaN(percentage) ? 0 : percentage
        }% 100%`;
      } catch (err) {
        console.warn("Error updating range fill:", err);
      }

      // Update display value if there's a corresponding display element
      if (target.dataset.param) {
        const param = target.dataset.param;
        const displayElement = layer.querySelector(
          `[data-${param.toLowerCase()}-value]`
        );
        if (displayElement) {
          displayElement.textContent = `${target.value}${
            param.includes("opacity") ? "%" : "px"
          }`;
        }
      }
    }, 10);

    // Add listener and set initial state
    input.addEventListener("input", updateRangeFill);

    // Set initial background size
    try {
      const min = input.min || "0";
      const max = input.max || "100";
      const val = input.value || "0";
      const percentage =
        ((parseInt(val) - parseInt(min)) * 100) /
        (parseInt(max) - parseInt(min));
      if (!isNaN(percentage)) {
        input.style.backgroundSize = `${percentage}% 100%`;
      }
    } catch (err) {
      console.warn("Error setting initial slider appearance:", err);
    }
  });
}
