interface ShadeData {
  color: string;
  shifts: { l: number; c: number; h: number };
}

/**
 * Manages color shade generation and updates
 */
export class ShadeManager {
  colorName: string;
  baseShade: number = 500;
  shades: Map<number, ShadeData> = new Map();
  baseColor: string;
  sectionElement: HTMLElement;
  defaultShifts: Map<number, { l: number; c: number; h: number }> = new Map();

  constructor(shadesSection: HTMLElement, baseColor: string) {
    this.sectionElement = shadesSection;
    this.colorName = shadesSection.dataset.colorName || "";
    this.baseColor = baseColor;

    // Initialize shades map with default values and save default shifts for reset functionality
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach((shade) => {
      const isLighter = shade < 500;

      const defaultShifts = {
        l: isLighter ? 0.6 : 0.8, // Lightness shift
        c: isLighter ? 0.8 : 1.1, // Chroma shift
        h: 0, // Hue shift
      };

      this.defaultShifts.set(shade, { ...defaultShifts });

      this.shades.set(shade, {
        color: "",
        shifts: { ...defaultShifts },
      });
    });

    this.loadShadesFromLocalStorage();
    this.setupEventListeners();
    this.initializeShades();
  }

  loadShadesFromLocalStorage() {
    const currentStyles = (window as any).currentStyles;
    if (!currentStyles?.colours?.shades?.[this.colorName]) return;

    // Load base shade if available
    if (currentStyles.colours.baseShades?.[this.colorName]) {
      this.baseShade = currentStyles.colours.baseShades[this.colorName];

      // Update radio button selection
      setTimeout(() => {
        const radioBtn = document.querySelector(
          `input[type="radio"][name="base-shade-${this.colorName}"][value="${this.baseShade}"]`
        ) as HTMLInputElement;

        if (radioBtn) {
          radioBtn.checked = true;

          // Update UI to reflect base shade
          this.updateBaseShadeUI(this.baseShade);
        }
      }, 0);
    }

    // Load shade colors
    const storedShades = currentStyles.colours.shades[this.colorName];
    Object.entries(storedShades).forEach(([shade, value]) => {
      const shadeNumber = parseInt(shade);
      if (this.shades.has(shadeNumber)) {
        this.shades.get(shadeNumber)!.color = value as string;
      }
    });

    // Load shifts from localStorage if available
    const storedShifts = currentStyles.colours.shifts?.[this.colorName];
    if (storedShifts) {
      Object.entries(storedShifts).forEach(([shade, shifts]) => {
        const shadeNumber = parseInt(shade);
        if (this.shades.has(shadeNumber)) {
          this.shades.get(shadeNumber)!.shifts = shifts as {
            l: number;
            c: number;
            h: number;
          };
        }
      });
    }
  }

  // Helper method to update UI for base shade changes
  updateBaseShadeUI(newBaseShade: number) {
    // Find all swatches and update their base status
    document
      .querySelectorAll(`[data-shade-swatch^="${this.colorName}-"]`)
      .forEach((swatch) => {
        const shadeValue = parseInt(
          swatch.getAttribute("data-shade-value") || "500"
        );
        const isBase = shadeValue === newBaseShade;

        swatch.setAttribute("data-base", isBase ? "true" : "false");

        // Add or remove base dot indicator
        const existingDot = swatch.querySelector(".base-shade-dot");
        if (isBase && !existingDot) {
          const dot = document.createElement("span");
          dot.className =
            "base-shade-dot absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-zinc-900";
          dot.setAttribute("title", "Base shade");
          swatch.appendChild(dot);
        } else if (!isBase && existingDot) {
          existingDot.remove();
        }
      });

    // Update visibility of base indicators in panels
    document
      .querySelectorAll(`[data-base-indicator^="${this.colorName}-"]`)
      .forEach((indicator) => {
        const indicatorId = indicator.getAttribute("data-base-indicator") || "";
        const indicatorShade = parseInt(indicatorId.split("-")[1] || "500");

        if (indicatorShade === newBaseShade) {
          indicator.classList.remove("hidden");
        } else {
          indicator.classList.add("hidden");
        }
      });

    // Update shift controls visibility
    document
      .querySelectorAll(`[data-shade-shifts^="${this.colorName}-"]`)
      .forEach((controls) => {
        const controlsId = controls.getAttribute("data-shade-shifts") || "";
        const controlsShade = parseInt(controlsId.split("-")[1] || "500");

        if (controlsShade === newBaseShade) {
          (controls as HTMLElement).style.display = "none";
        } else {
          (controls as HTMLElement).style.display = "block";
        }
      });

    // Update set-base buttons visibility
    document.querySelectorAll(".set-base-btn").forEach((btn) => {
      const btnId = btn.getAttribute("data-set-base-shade") || "";
      if (btnId.startsWith(this.colorName)) {
        const btnShade = parseInt(btnId.split("-")[1] || "500");
        if (btnShade === newBaseShade) {
          (btn as HTMLElement).style.visibility = "hidden";
        } else {
          (btn as HTMLElement).style.visibility = "visible";
        }
      }
    });
  }

  setupEventListeners() {
    // Set up base shade radio buttons
    const radioButtons =
      this.sectionElement.querySelectorAll(".base-shade-radio");

    radioButtons.forEach((radio: Element) => {
      radio.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        if (target.checked && target.dataset.colorName === this.colorName) {
          const shadeValue = parseInt(target.dataset.shadeValue || "500");
          this.setBaseShade(shadeValue);
        }
      });
    });

    // Set up shift sliders
    const sliders = this.sectionElement.querySelectorAll(".shift-slider");

    sliders.forEach((slider: Element) => {
      slider.addEventListener("input", (e) => {
        const inputEl = e.target as HTMLInputElement;
        const value = inputEl.value;
        const colorName = inputEl.dataset.colorName;
        const sliderInfo = inputEl.dataset.shadeShiftSlider?.split("-") || [];

        if (sliderInfo.length < 3 || colorName !== this.colorName) return;

        // Update the value display
        const valueDisplay = this.sectionElement.querySelector(
          `[data-shift-value="${inputEl.dataset.shadeShiftSlider}"]`
        );
        if (valueDisplay) {
          valueDisplay.textContent = value;
        }

        this.handleShiftChange(inputEl);
      });
    });

    // Listen for input changes on shade color inputs
    const shadeInputs =
      this.sectionElement.querySelectorAll("[data-color-shade]");
    shadeInputs.forEach((input: Element) => {
      input.addEventListener("change", (e) => {
        const inputEl = e.target as HTMLInputElement;
        const value = inputEl.value.trim();
        const pathParts = inputEl.dataset.colorShade?.split(".") || [];

        if (pathParts.length === 2) {
          const colorName = pathParts[0];
          const shade = parseInt(pathParts[1]);

          if (colorName === this.colorName && this.shades.has(shade)) {
            // If this is the base shade, update the base color
            if (shade === this.baseShade) {
              this.baseColor = value;
              this.shades.get(shade)!.color = value;
              this.updateShades();
            } else {
              // Otherwise just update this shade's color directly
              this.shades.get(shade)!.color = value;
              this.updateShadePreview(shade, value);

              // Update the swatch color in the row as well
              this.updateSwatchColor(shade, value);
            }
          }
        }
      });
    });

    // Listen for primary color changes from the ColorPicker
    document.addEventListener("colorSelected", (e: Event) => {
      const customEvent = e as CustomEvent<{ color: string; id: string }>;
      const colorId = customEvent.detail.id;

      // Extract color name from colorId (format: "site-color-{colorName}")
      if (colorId.startsWith("site-color-")) {
        const colorName = colorId.replace("site-color-", "");

        if (colorName === this.colorName) {
          this.baseColor = customEvent.detail.color;
          this.shades.get(this.baseShade)!.color = customEvent.detail.color;
          this.updateShades();
        }
      }
    });

    // Listen for reset shades event
    document.addEventListener("resetShades", (e: Event) => {
      const customEvent = e as CustomEvent<{ colorName: string }>;
      if (customEvent.detail.colorName === this.colorName) {
        this.resetShades();
      }
    });
  }

  resetShades() {
    // Reset all shifts back to default values
    this.shades.forEach((shadeData, shade) => {
      const defaultValues = this.defaultShifts.get(shade);
      if (defaultValues) {
        shadeData.shifts = { ...defaultValues };

        // Update slider UI for this shade if it exists
        ["l", "c", "h"].forEach((type) => {
          const slider = this.sectionElement.querySelector(
            `[data-shade-shift-slider="${this.colorName}-${shade}-${type}"]`
          ) as HTMLInputElement;

          if (slider) {
            slider.value =
              defaultValues[type as keyof typeof defaultValues].toString();

            // Update the value display
            const valueDisplay = this.sectionElement.querySelector(
              `[data-shift-value="${this.colorName}-${shade}-${type}"]`
            );
            if (valueDisplay) {
              valueDisplay.textContent = slider.value;
            }
          }
        });
      }
    });

    // Reset base shade back to 500
    if (this.baseShade !== 500) {
      const radioBtn = document.querySelector(
        `input[type="radio"][name="base-shade-${this.colorName}"][value="500"]`
      ) as HTMLInputElement;

      if (radioBtn) {
        radioBtn.checked = true;
        this.setBaseShade(500);
      }
    }

    // Recalculate all shades
    this.updateShades();

    // Close any open shade panels
    this.resetPanels();
  }

  initializeShades() {
    // Set the base shade color to the current color
    this.shades.get(this.baseShade)!.color = this.baseColor;

    // Update all shades based on the calculation logic
    this.updateShades();
  }

  setBaseShade(shade: number) {
    // Skip if it's already the base shade
    if (shade === this.baseShade) return;

    // Hide previous base indicator
    const prevIndicator = this.sectionElement.querySelector(
      `[data-base-indicator="${this.colorName}-${this.baseShade}"]`
    );
    if (prevIndicator) {
      prevIndicator.classList.add("hidden");
    }

    // Update previous base swatch styling
    const prevSwatch = document.querySelector(
      `[data-shade-swatch="${this.colorName}-${this.baseShade}"]`
    );
    if (prevSwatch) {
      prevSwatch.setAttribute("data-base", "false");

      // Remove the dot indicator from previous base swatch
      const prevDot = prevSwatch.querySelector(".base-shade-dot");
      if (prevDot) {
        prevDot.remove();
      }
    }

    // Show controls for the previous base shade
    const prevShadePanel = document.querySelector(
      `[data-shade-panel="${this.colorName}-${this.baseShade}"]`
    );
    if (prevShadePanel) {
      const prevShiftControls = prevShadePanel.querySelector(".shift-controls");
      if (prevShiftControls) {
        (prevShiftControls as HTMLElement).style.display = "block";
      }

      const prevSetBaseBtn = prevShadePanel.querySelector(".set-base-btn");
      if (prevSetBaseBtn) {
        (prevSetBaseBtn as HTMLElement).style.visibility = "visible";
      }
    }

    // Update to new base shade
    this.baseShade = shade;

    // Store the base shade in global styles
    if ((window as any).currentStyles?.colours) {
      if (!(window as any).currentStyles.colours.baseShades) {
        (window as any).currentStyles.colours.baseShades = {};
      }
      (window as any).currentStyles.colours.baseShades[this.colorName] = shade;
    }

    // Show new base indicator
    const newIndicator = this.sectionElement.querySelector(
      `[data-base-indicator="${this.colorName}-${this.baseShade}"]`
    );
    if (newIndicator) {
      newIndicator.classList.remove("hidden");
    }

    // Update new base swatch styling
    const newSwatch = document.querySelector(
      `[data-shade-swatch="${this.colorName}-${this.baseShade}"]`
    );
    if (newSwatch) {
      newSwatch.setAttribute("data-base", "true");

      // Add the purple dot indicator to the new base shade swatch
      if (!newSwatch.querySelector(".base-shade-dot")) {
        const dot = document.createElement("span");
        dot.className =
          "base-shade-dot absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-zinc-900";
        dot.setAttribute("title", "Base shade");
        newSwatch.appendChild(dot);
      }
    }

    // Hide controls for the new base shade
    const newShadePanel = document.querySelector(
      `[data-shade-panel="${this.colorName}-${this.baseShade}"]`
    );
    if (newShadePanel) {
      const newShiftControls = newShadePanel.querySelector(".shift-controls");
      if (newShiftControls) {
        (newShiftControls as HTMLElement).style.display = "none";
      }

      const newSetBaseBtn = newShadePanel.querySelector(".set-base-btn");
      if (newSetBaseBtn) {
        (newSetBaseBtn as HTMLElement).style.visibility = "hidden";
      }
    }

    // Get the current color value from the input
    const colorPickerInput = document.querySelector(
      `[data-field-id="site-color-${this.colorName}"] .color-value-input`
    ) as HTMLInputElement;

    if (colorPickerInput) {
      this.baseColor = colorPickerInput.value;
    }

    // Update base shade color and recalculate all shades
    this.shades.get(this.baseShade)!.color = this.baseColor;
    this.updateShades();
  }

  resetPanels() {
    // Hide all panels
    const allPanels = document.querySelectorAll(".shade-panel");
    allPanels.forEach((panel) => {
      (panel as HTMLElement).style.maxHeight = "0";
      (panel as HTMLElement).style.opacity = "0";
    });

    // Reset active state on all swatches
    document.querySelectorAll("[data-toggle-shade-panel]").forEach((swatch) => {
      swatch.setAttribute("data-active", "false");
    });
  }

  handleShiftChange(slider: HTMLInputElement) {
    const sliderInfo = slider.dataset.shadeShiftSlider?.split("-") || [];
    if (sliderInfo.length !== 3) return;

    const colorName = sliderInfo[0];
    const shade = parseInt(sliderInfo[1]);
    const shiftType = slider.dataset.shiftType as "l" | "c" | "h";
    const value = parseFloat(slider.value);

    if (colorName !== this.colorName || !this.shades.has(shade)) return;

    this.shades.get(shade)!.shifts[shiftType] = value;
    this.updateShades();
  }

  updateShades() {
    // Get base shade data
    const baseShadeData = this.shades.get(this.baseShade)!;
    const baseColor = baseShadeData.color || this.baseColor;

    // Update the base shade preview and input
    this.updateShadePreview(this.baseShade, baseColor);
    this.updateShadeInput(this.baseShade, baseColor);
    this.updateSwatchColor(this.baseShade, baseColor);

    // First, store the base shade in the global styles
    if (window.currentStyles?.colours?.shades?.[this.colorName]) {
      window.currentStyles.colours.shades[this.colorName][
        this.baseShade.toString()
      ] = `oklch(from var(--color-${this.colorName}) l c h)`;

      // Also ensure we have the base shade stored
      if (!(window as any).currentStyles.colours.baseShades) {
        (window as any).currentStyles.colours.baseShades = {};
      }
      (window as any).currentStyles.colours.baseShades[this.colorName] =
        this.baseShade;
    }

    // LIGHTER SHADES (from base toward 50)
    if (this.baseShade > 50) {
      let previousShade = this.baseShade;

      // Special case for base shade 100 to ensure shade 50 gets updated
      if (this.baseShade === 100) {
        const shade = 50;
        const shifts = this.shades.get(shade)!.shifts;
        const referenceShade = 100;
        const transformFormula = `oklch(from var(--color-${this.colorName}-${referenceShade}) calc(1 - (1 - l) * ${shifts.l}) calc(c * ${shifts.c}) calc(h + ${shifts.h}))`;

        // Store the transform formula in the global styles
        if (window.currentStyles?.colours?.shades?.[this.colorName]) {
          window.currentStyles.colours.shades[this.colorName][
            shade.toString()
          ] = transformFormula;
        }

        // Calculate the actual color for preview
        const computedColor = this.calculateShiftedColor(
          this.shades.get(referenceShade)!.color,
          shifts.l,
          shifts.c,
          shifts.h,
          true // lighter shade
        );

        // Update UI with the computed color
        this.shades.get(shade)!.color = computedColor;
        this.updateShadePreview(shade, computedColor);
        this.updateShadeInput(shade, computedColor);
        this.updateSwatchColor(shade, computedColor);
      } else {
        // Regular loop for other base shades
        for (
          let shade = this.baseShade - 100;
          shade >= 50;
          shade -= shade === 100 ? 50 : 100
        ) {
          if (!this.shades.has(shade)) continue;

          const shifts = this.shades.get(shade)!.shifts;
          const referenceShade = previousShade;
          const transformFormula = `oklch(from var(--color-${this.colorName}-${referenceShade}) calc(1 - (1 - l) * ${shifts.l}) calc(c * ${shifts.c}) calc(h + ${shifts.h}))`;

          // Store the transform formula in the global styles
          if (window.currentStyles?.colours?.shades?.[this.colorName]) {
            window.currentStyles.colours.shades[this.colorName][
              shade.toString()
            ] = transformFormula;
          }

          // Calculate the actual color for preview
          const computedColor = this.calculateShiftedColor(
            this.shades.get(referenceShade)!.color,
            shifts.l,
            shifts.c,
            shifts.h,
            true // lighter shade
          );

          // Update UI with the computed color
          this.shades.get(shade)!.color = computedColor;
          this.updateShadePreview(shade, computedColor);
          this.updateShadeInput(shade, computedColor);
          this.updateSwatchColor(shade, computedColor);

          previousShade = shade;
        }
      }
    }

    // DARKER SHADES (from base toward 950)
    if (this.baseShade < 950) {
      let previousShade = this.baseShade;

      // Special case for base shade 900 to ensure shade 950 gets updated
      if (this.baseShade === 900) {
        const shade = 950;
        const shifts = this.shades.get(shade)!.shifts;
        const referenceShade = 900;
        const transformFormula = `oklch(from var(--color-${this.colorName}-${referenceShade}) calc(l * ${shifts.l}) calc(c * ${shifts.c}) calc(h + ${shifts.h}))`;

        // Store the transform formula in the global styles
        if (window.currentStyles?.colours?.shades?.[this.colorName]) {
          window.currentStyles.colours.shades[this.colorName][
            shade.toString()
          ] = transformFormula;
        }

        // Calculate the actual color for preview
        const computedColor = this.calculateShiftedColor(
          this.shades.get(referenceShade)!.color,
          shifts.l,
          shifts.c,
          shifts.h,
          false // darker shade
        );

        // Update UI with the computed color
        this.shades.get(shade)!.color = computedColor;
        this.updateShadePreview(shade, computedColor);
        this.updateShadeInput(shade, computedColor);
        this.updateSwatchColor(shade, computedColor);
      } else {
        // Regular loop for other base shades
        for (
          let shade = this.baseShade + 100;
          shade <= 950;
          shade += shade === 900 ? 50 : 100
        ) {
          if (!this.shades.has(shade)) continue;

          const shifts = this.shades.get(shade)!.shifts;
          const referenceShade = previousShade;
          const transformFormula = `oklch(from var(--color-${this.colorName}-${referenceShade}) calc(l * ${shifts.l}) calc(c * ${shifts.c}) calc(h + ${shifts.h}))`;

          // Store the transform formula in the global styles
          if (window.currentStyles?.colours?.shades?.[this.colorName]) {
            window.currentStyles.colours.shades[this.colorName][
              shade.toString()
            ] = transformFormula;
          }

          // Calculate the actual color for preview
          const computedColor = this.calculateShiftedColor(
            this.shades.get(referenceShade)!.color,
            shifts.l,
            shifts.c,
            shifts.h,
            false // darker shade
          );

          // Update UI with the computed color
          this.shades.get(shade)!.color = computedColor;
          this.updateShadePreview(shade, computedColor);
          this.updateShadeInput(shade, computedColor);
          this.updateSwatchColor(shade, computedColor);

          previousShade = shade;
        }
      }
    }

    // Notify that shades have been updated
    document.dispatchEvent(
      new CustomEvent("shadesUpdated", {
        detail: { colorName: this.colorName },
      })
    );
  }

  // Helper to determine the base shade for lighter shades (e.g., 400 for 300)
  getBaseForLighterShade(shade: number): number {
    // For lighter shades, the base is the next darker shade
    const shadeValues = [50, 100, 200, 300, 400, 500];
    const index = shadeValues.indexOf(shade);
    if (index >= 0 && index < shadeValues.length - 1) {
      return shadeValues[index + 1];
    }
    return this.baseShade; // Fallback to base shade
  }

  // Helper to determine the base shade for darker shades (e.g., 600 for 700)
  getBaseForDarkerShade(shade: number): number {
    // For darker shades, the base is either 500 or the previous lighter shade
    const shadeValues = [500, 600, 700, 800, 900];
    const index = shadeValues.indexOf(shade);
    if (index > 0) {
      return shadeValues[index - 1];
    }
    return this.baseShade; // Use base shade (500) as fallback
  }

  updateShadePreview(shade: number, color: string) {
    const preview = this.sectionElement.querySelector(
      `[data-shade-preview="${this.colorName}-${shade}"]`
    ) as HTMLElement;
    if (preview) {
      preview.style.backgroundColor = color;
    }
  }

  updateShadeInput(shade: number, color: string) {
    const input = this.sectionElement.querySelector(
      `[data-color-shade="${this.colorName}.${shade}"]`
    ) as HTMLInputElement;
    if (input) {
      input.value = color;
    }
  }

  updateSwatchColor(shade: number, color: string) {
    const swatch = document.querySelector(
      `[data-shade-swatch="${this.colorName}-${shade}"]`
    ) as HTMLElement;
    if (swatch) {
      swatch.style.backgroundColor = color;
    }
  }

  calculateShiftedColor(
    baseColor: string,
    lShift: number,
    cShift: number,
    hShift: number,
    isLighter: boolean
  ): string {
    try {
      // Formula based on oklch color space
      if (isLighter) {
        // For lighter shades (increasing lightness)
        return `oklch(from ${baseColor} calc(1 - (1 - l) * ${lShift}) calc(c * ${cShift}) calc(h + ${hShift}))`;
      } else {
        // For darker shades (decreasing lightness)
        return `oklch(from ${baseColor} calc(l * ${lShift}) calc(c * ${cShift}) calc(h + ${hShift}))`;
      }
    } catch (e) {
      console.error("Error shifting color:", e);
      return baseColor;
    }
  }
}

/**
 * Sets up color shade management for all color sections
 */
export function setupColorShades() {
  const shadesSections = document.querySelectorAll("[data-shades-section]");

  shadesSections.forEach((section) => {
    const colorName = (section as HTMLElement).dataset.colorName || "";

    // Find the base color from the corresponding color picker
    const colorPicker = document.querySelector(
      `[data-field-id="site-color-${colorName}"] .color-value-input`
    ) as HTMLInputElement;
    const baseColor = colorPicker ? colorPicker.value : "";

    if (baseColor) {
      new ShadeManager(section as HTMLElement, baseColor);
    } else {
      console.warn(`No base color found for ${colorName}`);
    }
  });
}
