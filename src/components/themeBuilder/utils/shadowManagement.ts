/**
 * Functions for managing shadow layers (add/remove/update)
 */
import {
  type Shadow,
  themeColorArray,
  generateRgbaColor,
  parseShadow,
  splitShadows,
} from "./shadowUtils.ts";
import {
  setupSingleLayerToggles,
  setupRangeSliders,
  setupShadowVisibilityToggles,
} from "./shadowLayerControls";

/**
 * Add functionality for adding and removing shadow layers with event delegation
 */
export function setupAddRemoveShadowButtons(): void {
  // Add button functionality
  const addButton = document.querySelector("[data-add-shadow]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      addNewShadowLayer();
    });
  }

  // Remove button functionality with event delegation
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    const removeButton = e.target.closest("[data-remove-shadow]");
    if (removeButton) {
      const indexToRemove = removeButton.getAttribute("data-remove-shadow");
      if (indexToRemove !== null) {
        removeShadowLayer(parseInt(indexToRemove, 10));
      }
    }
  });
}

/**
 * Function to add a new shadow layer with better error handling
 */
export function addNewShadowLayer(): void {
  try {
    // Get the container for shadow layers
    const shadowLayersContainer = document.querySelector(
      "[data-shadow-layers]"
    );
    if (!shadowLayersContainer) {
      console.error("Shadow layers container not found");
      return;
    }

    // Get template content
    const template = document.getElementById(
      "shadow-layer-template"
    ) as HTMLTemplateElement;
    if (!template) {
      console.error("Shadow layer template not found");
      fallbackAddShadowLayer();
      return;
    }

    // Create a default shadow object
    const defaultShadow: Shadow = {
      horizontalOffset: 2,
      verticalOffset: 4,
      blurRadius: 6,
      spreadRadius: 0,
      color: "rgba(0, 0, 0, 0.1)",
      opacity: 0.1,
      colorName: "black",
      isInset: false,
    };

    // Get the current number of shadow layers
    const currentLayers =
      shadowLayersContainer.querySelectorAll(".shadow-layer");
    const newIndex = currentLayers.length;

    // Clone the template content
    const newLayer = template.content.firstElementChild!.cloneNode(
      true
    ) as Element;

    // Update the layer's index and make it visible
    newLayer.setAttribute("data-shadow-index", newIndex.toString());
    newLayer.setAttribute("data-shadow-visible", "true");

    // Update the heading
    const heading = newLayer.querySelector("h4");
    if (heading) {
      heading.textContent = `Layer ${newIndex + 1}`;
    }

    // Update buttons with the correct index
    const removeButton = newLayer.querySelector("[data-remove-shadow]");
    if (removeButton) {
      removeButton.setAttribute("data-remove-shadow", newIndex.toString());
    }

    const visibilityButton = newLayer.querySelector("[data-shadow-visibility]");
    if (visibilityButton) {
      visibilityButton.setAttribute(
        "data-shadow-visibility",
        newIndex.toString()
      );
    }

    // Add the new layer to the container
    shadowLayersContainer.appendChild(newLayer);

    // Reset form values to default
    resetLayerControls(newLayer, defaultShadow);

    // Set up interactive elements
    setupSingleLayerToggles(newLayer);
    setupColorOpacityInteraction(newLayer);
    setupRangeSliders(newLayer);
    setupShadowVisibilityToggles();

    // Update the shadow preview
    setTimeout(() => {
      if (typeof (window as any).updateShadowPreview === "function") {
        (window as any).updateShadowPreview();
      }
    }, 50);

    // Scroll to the new layer
    newLayer.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    console.error("Error adding shadow layer:", error);
    fallbackAddShadowLayer();
  }
}

/**
 * Function to remove a shadow layer and update preview
 */
export function removeShadowLayer(indexToRemove: number): void {
  try {
    // Get all shadow layers
    const shadowLayers = document.querySelectorAll(".shadow-layer");

    // Find the layer to remove
    for (const layer of shadowLayers) {
      const index = parseInt(
        layer.getAttribute("data-shadow-index") || "-1",
        10
      );
      if (index === indexToRemove) {
        // Remove the layer from the DOM
        layer.remove();

        // Update indices for remaining layers
        updateLayerIndices();

        // Update the shadow preview
        if (typeof (window as any).updateShadowPreview === "function") {
          setTimeout(() => (window as any).updateShadowPreview(), 0);
        }
        break;
      }
    }
  } catch (error) {
    console.error("Error removing shadow layer:", error);
  }
}

/**
 * Function to update layer indices after removal
 */
export function updateLayerIndices(): void {
  const shadowLayers = document.querySelectorAll(".shadow-layer");

  shadowLayers.forEach((layer, i) => {
    // Update the data-shadow-index attribute
    layer.setAttribute("data-shadow-index", i.toString());

    // Update the layer heading
    const heading = layer.querySelector("h4");
    if (heading) {
      heading.textContent = `Layer ${i + 1}`;
    }

    // Update remove button index if it exists
    const removeButton = layer.querySelector("[data-remove-shadow]");
    if (removeButton) {
      removeButton.setAttribute("data-remove-shadow", i.toString());
    }

    // Update visibility toggle index
    const visibilityToggle = layer.querySelector("[data-shadow-visibility]");
    if (visibilityToggle) {
      visibilityToggle.setAttribute("data-shadow-visibility", i.toString());
    }
  });
}

/**
 * Function to reset a cloned layer's controls with optimized DOM operations
 */
export function resetLayerControls(layer: Element, shadow: Shadow): void {
  // Reset range inputs
  const inputs = layer.querySelectorAll('input[type="range"], select');
  inputs.forEach((input) => {
    if (
      input instanceof HTMLInputElement ||
      input instanceof HTMLSelectElement
    ) {
      // Make sure the input is enabled
      input.disabled = false;

      if (input.dataset.param) {
        const param = input.dataset.param;
        if (param === "opacity") {
          const opacityValue = Number(shadow[param as keyof Shadow] || 0.1);
          input.value = String(Math.round(opacityValue * 100));
        } else {
          input.value = String(shadow[param as keyof Shadow] || 0);
        }
      }
    }
  });

  // Reset checkbox state
  const insetCheckbox = layer.querySelector('input[data-param="isInset"]');
  if (insetCheckbox instanceof HTMLInputElement) {
    insetCheckbox.checked = shadow.isInset || false;
  }

  // Reset displayed values
  const valueSpans = layer.querySelectorAll(
    "[data-h-value], [data-v-value], [data-blur-value], [data-spread-value], [data-opacity-value]"
  );
  valueSpans.forEach((span) => {
    const htmlSpan = span as HTMLElement;
    if (htmlSpan.dataset.hValue !== undefined)
      htmlSpan.textContent = `${shadow.horizontalOffset}px`;
    if (htmlSpan.dataset.vValue !== undefined)
      htmlSpan.textContent = `${shadow.verticalOffset}px`;
    if (htmlSpan.dataset.blurValue !== undefined)
      htmlSpan.textContent = `${shadow.blurRadius}px`;
    if (htmlSpan.dataset.spreadValue !== undefined)
      htmlSpan.textContent = `${shadow.spreadRadius}px`;
    if (htmlSpan.dataset.opacityValue !== undefined)
      htmlSpan.textContent = `${Math.round(shadow.opacity * 100)}%`;
  });

  // Reset color preview
  const colorPreview = layer.querySelector(".shadow-summary .inline-block");
  if (colorPreview instanceof HTMLElement) {
    colorPreview.style.backgroundColor = shadow.color;
  }

  // Reset the summary text
  const colorNameText = layer.querySelector(".shadow-summary .align-middle");
  if (colorNameText) {
    // Clear any existing content first to avoid duplication
    colorNameText.textContent = `${shadow.colorName} (${Math.round(
      shadow.opacity * 100
    )}%)`;

    // Remove any sibling text nodes that might be duplicates
    const parent = colorNameText.parentElement;
    if (parent) {
      const siblings = parent.querySelectorAll(".align-middle");
      if (siblings.length > 1) {
        for (let i = 1; i < siblings.length; i++) {
          siblings[i].remove();
        }
      }
    }
  }

  const shadowDetailText = layer.querySelector(
    ".shadow-summary .text-zinc-400"
  );
  if (shadowDetailText) {
    shadowDetailText.textContent = `${shadow.isInset ? "inset " : ""}${
      shadow.horizontalOffset
    }px ${shadow.verticalOffset}px ${shadow.blurRadius}px ${
      shadow.spreadRadius
    }px`;
  }

  // Reset hidden color field
  const colorInput = layer.querySelector('input[data-param="color"]');
  if (colorInput instanceof HTMLInputElement) {
    colorInput.value = shadow.color;
  }
}

/**
 * Setup color and opacity interaction for shadow layers with error handling
 */
export function setupColorOpacityInteraction(layer: Element): void {
  try {
    const colorSelect = layer.querySelector('select[data-param="colorName"]');
    const opacityInput = layer.querySelector('input[data-param="opacity"]');
    const colorHiddenInput = layer.querySelector('input[data-param="color"]');

    if (!colorSelect || !opacityInput || !colorHiddenInput) return;

    const updateColorWithOpacity = debounce(() => {
      if (
        colorSelect instanceof HTMLSelectElement &&
        opacityInput instanceof HTMLInputElement &&
        colorHiddenInput instanceof HTMLInputElement
      ) {
        const colorName = colorSelect.value;
        const opacity = parseInt(opacityInput.value, 10) / 100;

        try {
          const selectedColor = themeColorArray.find(
            (c) => c.name === colorName
          );

          if (selectedColor) {
            const rgbaColor = generateRgbaColor(selectedColor.value, opacity);
            colorHiddenInput.value = rgbaColor;

            // Update the color preview
            const colorPreview = layer.querySelector(
              ".shadow-summary .inline-block"
            );
            if (colorPreview instanceof HTMLElement) {
              colorPreview.style.backgroundColor = rgbaColor;
            }

            // Update the text summary
            const colorNameText = layer.querySelector(
              ".shadow-summary .align-middle"
            );
            if (colorNameText) {
              colorNameText.textContent = `${colorName} (${Math.round(
                opacity * 100
              )}%)`;
            }
          }
        } catch (err) {
          console.warn("Error updating color with opacity:", err);
        }
      }
    }, 50);

    // Add event listeners
    if (colorSelect instanceof HTMLSelectElement) {
      colorSelect.addEventListener("change", updateColorWithOpacity);
    }

    if (opacityInput instanceof HTMLInputElement) {
      opacityInput.addEventListener("input", updateColorWithOpacity);
    }
  } catch (error) {
    console.error("Error setting up color opacity interaction:", error);
  }
}

/**
 * Fallback method to add shadow layer if template fails
 */
function fallbackAddShadowLayer(): void {
  alert("Could not add shadow layer. Please try again.");
}

/**
 * Helper debounce function for optimizing UI updates
 */
function debounce(func: Function, wait = 100) {
  let timeout: number | undefined;
  return function (...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as unknown as number;
  };
}

/**
 * Rebuilds the shadow UI components from a shadow string
 * @param shadowString CSS box-shadow value string
 */
export function rebuildShadowFromInput(shadowString: string) {
  try {
    // Clear existing shadow layers first
    const shadowLayersContainer = document.querySelector(
      "[data-shadow-layers]"
    );
    if (!shadowLayersContainer) {
      console.error("Shadow layers container not found");
      return;
    }

    // Remove all existing shadow layers
    shadowLayersContainer.innerHTML = "";

    // If shadow is "none" or empty, add a default shadow
    if (
      !shadowString ||
      shadowString.trim() === "" ||
      shadowString === "none"
    ) {
      setTimeout(() => addNewShadowLayer(), 0);
      return;
    }

    // Split the shadow into individual parts
    const shadowParts = splitShadows(shadowString);

    if (shadowParts.length === 0) {
      setTimeout(() => addNewShadowLayer(), 0);
      return;
    }

    // Parse each shadow part and add it to the UI
    shadowParts.forEach((shadowPart, idx) => {
      try {
        const parsedShadow = parseShadow(shadowPart);

        // Create a new shadow layer for this shadow
        const template = document.getElementById(
          "shadow-layer-template"
        ) as HTMLTemplateElement;
        if (!template) {
          console.error("Shadow layer template not found");
          return;
        }

        // Clone the template
        const clone = document.importNode(template.content, true);

        // Update the layer's index BEFORE appending to DOM
        const layerElement = clone.firstElementChild as HTMLElement;
        if (layerElement) {
          layerElement.setAttribute("data-shadow-index", idx.toString());

          // Update the heading immediately
          const heading = layerElement.querySelector("h4");
          if (heading) {
            heading.textContent = `Layer ${idx + 1}`;
          }

          // Update the remove button
          const removeBtn = layerElement.querySelector("[data-remove-shadow]");
          if (removeBtn) {
            removeBtn.setAttribute("data-remove-shadow", idx.toString());
          }

          // Update visibility toggle
          const visibilityBtn = layerElement.querySelector(
            "[data-shadow-visibility]"
          );
          if (visibilityBtn) {
            visibilityBtn.setAttribute(
              "data-shadow-visibility",
              idx.toString()
            );
          }
        }

        // Add it to the shadow layers container
        shadowLayersContainer.appendChild(clone);

        // Get the newly added layer and set it up
        const layer = shadowLayersContainer.lastElementChild;
        if (!layer) return;

        // Set up the layer with the parsed shadow values
        setupShadowLayer(layer as HTMLElement, parsedShadow, idx);
      } catch (err) {
        console.error("Error processing shadow part:", shadowPart, err);
      }
    });

    // Initialize layer controls
    document.querySelectorAll(".shadow-layer").forEach((layer, idx) => {
      try {
        // Double check that the index is correct
        if (layer.getAttribute("data-shadow-index") !== idx.toString()) {
          layer.setAttribute("data-shadow-index", idx.toString());

          // Update the heading
          const heading = layer.querySelector("h4");
          if (heading) {
            heading.textContent = `Layer ${idx + 1}`;
          }
        }

        setupRangeSliders(layer);
        setupColorOpacityInteraction(layer);
        setupSingleLayerToggles(layer);
      } catch (err) {
        console.error("Error setting up layer controls:", err);
      }
    });

    // Re-initialize global shadow visibility toggles
    setupShadowVisibilityToggles();

    // Update the preview with the current shadow
    if (typeof (window as any).updateShadowPreview === "function") {
      setTimeout(() => (window as any).updateShadowPreview(), 50);
    }
  } catch (e) {
    console.error("Failed to rebuild shadow from input:", e);
  }
}

/**
 * Sets up a shadow layer with the given values
 * @param layer The shadow layer element
 * @param shadow The parsed shadow object
 * @param index The index of this shadow in the layers list
 */
function setupShadowLayer(layer: HTMLElement, shadow: any, index: number) {
  // Set data attributes for the layer
  layer.setAttribute("data-shadow-index", index.toString());

  // Set up ranges and inputs with the shadow values
  const inputs = {
    horizontalOffset: layer.querySelector(
      ".shadow-h-offset"
    ) as HTMLInputElement,
    verticalOffset: layer.querySelector(".shadow-v-offset") as HTMLInputElement,
    blurRadius: layer.querySelector(".shadow-blur") as HTMLInputElement,
    spreadRadius: layer.querySelector(".shadow-spread") as HTMLInputElement,
    isInset: layer.querySelector(".shadow-inset") as HTMLInputElement,
    opacity: layer.querySelector(".shadow-opacity") as HTMLInputElement,
    colorName: layer.querySelector(".shadow-color-select") as HTMLSelectElement,
  };

  // Set values for each input
  if (inputs.horizontalOffset)
    inputs.horizontalOffset.value = shadow.horizontalOffset.toString();
  if (inputs.verticalOffset)
    inputs.verticalOffset.value = shadow.verticalOffset.toString();
  if (inputs.blurRadius) inputs.blurRadius.value = shadow.blurRadius.toString();
  if (inputs.spreadRadius)
    inputs.spreadRadius.value = shadow.spreadRadius.toString();
  if (inputs.isInset) inputs.isInset.checked = shadow.isInset;
  if (inputs.opacity) inputs.opacity.value = (shadow.opacity * 100).toString();
  if (inputs.colorName) inputs.colorName.value = shadow.colorName;

  // Update the display values
  const displays = {
    horizontalOffset: layer.querySelector("[data-h-value]"),
    verticalOffset: layer.querySelector("[data-v-value]"),
    blurRadius: layer.querySelector("[data-blur-value]"),
    spreadRadius: layer.querySelector("[data-spread-value]"),
  };

  if (displays.horizontalOffset)
    displays.horizontalOffset.textContent = `${shadow.horizontalOffset}px`;
  if (displays.verticalOffset)
    displays.verticalOffset.textContent = `${shadow.verticalOffset}px`;
  if (displays.blurRadius)
    displays.blurRadius.textContent = `${shadow.blurRadius}px`;
  if (displays.spreadRadius)
    displays.spreadRadius.textContent = `${shadow.spreadRadius}px`;

  // Update the summary text in the collapsed view
  const colorNameText = layer.querySelector(".shadow-summary .align-middle");
  if (colorNameText) {
    colorNameText.textContent = `${shadow.colorName} (${Math.round(
      shadow.opacity * 100
    )}%)`;
  }

  // Update the color preview swatch
  const colorPreview = layer.querySelector(".shadow-summary .inline-block");
  if (colorPreview instanceof HTMLElement) {
    colorPreview.style.backgroundColor = shadow.color;
  }

  // Update the detailed shadow text description
  const shadowDetailText = layer.querySelector(
    ".shadow-summary .text-zinc-400"
  );
  if (shadowDetailText) {
    shadowDetailText.textContent = `${shadow.isInset ? "inset " : ""}${
      shadow.horizontalOffset
    }px ${shadow.verticalOffset}px ${shadow.blurRadius}px ${
      shadow.spreadRadius
    }px`;
  }

  // Set up event listeners for the controls
  setupRangeSliders(layer);
  setupColorOpacityInteraction(layer);
}
