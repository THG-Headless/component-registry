import type { ThemeStyles } from "./defaultTheme";

/**
 * Initializes the style management system
 * @param initialStyles The initial styles object
 */
export function initializeStyleManager(initialStyles: any): void {
  // The local storage key for our styles
  const STORAGE_KEY = "altitude-theme-styles";

  // Try to load styles from local storage first
  try {
    const savedStyles = localStorage.getItem(STORAGE_KEY);
    if (savedStyles) {
      (window as any).currentStyles = JSON.parse(savedStyles);
    } else {
      (window as any).currentStyles = initialStyles;
    }
  } catch (e) {
    console.error("Error loading styles from local storage:", e);
    (window as any).currentStyles = initialStyles;
  }

  // Expose the function to window for reset functionality
  (window as any).initializeStyleManager = initializeStyleManager;

  // Function to save styles to local storage
  function saveStylesToLocalStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify((window as any).currentStyles)
      );
    } catch (e) {
      console.error("Error saving styles to local storage:", e);
    }
  }

  // Function to update the displayed JSON
  function updateStylesDisplay() {
    const preview = document.getElementById("style-json-preview");
    if (preview) {
      preview.textContent = JSON.stringify(
        (window as any).currentStyles,
        null,
        2
      );
    }

    // Save to local storage after each update
    saveStylesToLocalStorage();
  }

  // Listen for site color changes
  document.addEventListener("colorSelected", (e: Event) => {
    const customEvent = (e as CustomEvent).detail;
    if (customEvent.id && customEvent.id.startsWith("site-color-")) {
      const colorName = customEvent.id.replace("site-color-", "");
      (window as any).currentStyles.colours.site[colorName] = customEvent.color;

      // Only update styles display for non-simple colors (not white or black)
      if (colorName !== "white" && colorName !== "black") {
        updateStylesDisplay();
      } else {
        // For white and black, just update the base color without processing shades
        updateSimpleColorDisplay(colorName);
      }
    }
  });

  // Listen for shade updates
  document.addEventListener("shadesUpdated", (e: Event) => {
    const { colorName } = (e as CustomEvent).detail;
    if (colorName && colorName !== "white" && colorName !== "black") {
      updateStylesDisplay();
    }
  });

  // Listen for alias changes
  document.addEventListener("aliasChanged", (e: Event) => {
    const { colorName, aliasName, value } = (e as CustomEvent).detail;
    if (
      colorName &&
      aliasName &&
      value &&
      colorName !== "white" &&
      colorName !== "black"
    ) {
      (window as any).currentStyles.colours.alias[colorName][aliasName] = value;
    }
  });

  // Listen for border radius changes
  document.addEventListener("borderRadiusChanged", (e: Event) => {
    (window as any).currentStyles.radius = (e as CustomEvent).detail.value;
    updateStylesDisplay();
  });

  // Listen for shadow changes
  document.addEventListener("shadowChanged", (e: Event) => {
    const currentValue = (window as any).currentStyles?.shadow;
    const newValue = (e as CustomEvent).detail.value;

    // Only update if the value actually changed
    if (currentValue !== newValue) {
      (window as any).currentStyles.shadow = newValue;
      updateStylesDisplay();
    }
  });

  // Listen for animation timing changes
  document.addEventListener("animationTimingChanged", (e: Event) => {
    const { name, value } = (e as CustomEvent).detail;
    if (name && value !== undefined) {
      (window as any).currentStyles.animation[name] = parseFloat(value);
      updateStylesDisplay();
    }
  });

  // Listen for typography changes
  document.addEventListener("typographyChanged", (e: Event) => {
    const { path, value } = (e as CustomEvent).detail;
    if (path) {
      const [category, size, property] = path.split(".");
      if (category === "desktop" || category === "mobile") {
        (window as any).currentStyles.typography[category][size][property] =
          parseInt(value, 10);
        updateStylesDisplay();
      } else if (category === "weights") {
        (window as any).currentStyles.typography.weights[size] = parseInt(
          value,
          10
        );
        updateStylesDisplay();
      }
    }
  });

  // Listen for font weight changes
  document.addEventListener("fontWeightChanged", (e: Event) => {
    const { weight, value } = (e as CustomEvent).detail;
    if (weight && value !== undefined) {
      (window as any).currentStyles.typography.weights[weight] = parseInt(
        value,
        10
      );
      updateStylesDisplay();
    }
  });

  // Add event listener for CSS export
  document.addEventListener("exportThemeCSS", () => {
    downloadThemeCSS();
  });

  // Add event listener for local storage clear (reset)
  document.addEventListener("resetThemeStyles", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing stored styles:", e);
    }
  });

  // Update the display initially
  document.addEventListener("DOMContentLoaded", () => {
    // First synchronize the UI with the loaded styles
    synchronizeUIWithStyles();

    updateStylesDisplay();
    createDownloadButton(); // Create the download button when the DOM is ready

    // Also bind to a keyboard shortcut (Ctrl+Shift+D) for easy testing
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        downloadThemeCSS();
      }
    });
  });

  // Add a new function to handle simple color updates (white and black)
  function updateSimpleColorDisplay(colorName: string) {
    // This function would just handle the basics without shader/alias processing
    // Implementation depends on what exactly needs updating for simple colors

    // You might want to save to localStorage or update the preview here
    // For now, just make sure the main display is updated
    const customEvent = new CustomEvent("stylesUpdated", {
      detail: { simpleColor: true },
    });
    document.dispatchEvent(customEvent);
  }
}

/**
 * Synchronizes UI controls with the loaded styles
 */
function synchronizeUIWithStyles(): void {
  const styles = (window as any).currentStyles;
  if (!styles) return;

  // Update site colors
  if (styles.colours?.site) {
    Object.entries(styles.colours.site).forEach(([colorName, colorValue]) => {
      // Update color pickers
      const colorInput = document.querySelector(
        `[data-color-input="site-color-${colorName}"]`
      ) as HTMLInputElement;
      const hiddenInput = document.querySelector(
        `[data-field-id="site-color-${colorName}"] [data-hidden-color]`
      ) as HTMLInputElement;
      const swatch = document.querySelector(
        `[data-field-id="site-color-${colorName}"] [data-swatch]`
      ) as HTMLElement;

      if (colorInput && colorValue) {
        colorInput.value = colorValue as string;
      }

      if (hiddenInput && colorValue) {
        hiddenInput.value = colorValue as string;
      }

      if (swatch && colorValue) {
        swatch.style.backgroundColor = colorValue as string;
      }

      // Ensure base shade uses the formula reference
      if (styles.colours.shades[colorName]) {
        const baseShade = styles.colours.shades[colorName]["500"];
        if (baseShade && !baseShade.startsWith("oklch(from var(--color-")) {
          styles.colours.shades[colorName][
            "500"
          ] = `oklch(from var(--color-${colorName}) l c h)`;
        }
      }

      // Trigger a colorSelected event to update the shades properly
      document.dispatchEvent(
        new CustomEvent("colorSelected", {
          detail: {
            color: colorValue as string,
            id: `site-color-${colorName}`,
          },
          bubbles: true,
        })
      );
    });
  }

  // Update border radius
  if (styles.radius) {
    const radiusInputs = document.querySelectorAll(
      "[data-radius-field]"
    ) as NodeListOf<HTMLInputElement>;
    radiusInputs.forEach((input) => {
      input.value = styles.radius;

      // Update preview elements
      const radiusPreviewElements = document.querySelectorAll(
        ".radius-preview"
      ) as NodeListOf<HTMLElement>;
      radiusPreviewElements.forEach((element) => {
        element.style.borderRadius = styles.radius;
      });

      // Highlight active preset
      document.querySelectorAll(".radius-preset").forEach((preset) => {
        const presetValue = preset.getAttribute("data-radius") || "";
        if (presetValue === styles.radius) {
          preset.classList.remove("bg-zinc-800");
          preset.classList.add("bg-zinc-700");
        } else {
          preset.classList.remove("bg-zinc-700");
          preset.classList.add("bg-zinc-800");
        }
      });
    });
  }

  // Update shadow with improved handling and better timing
  if (styles.shadow) {
    const shadowField = document.querySelector(
      "[data-shadow-field]"
    ) as HTMLTextAreaElement;

    if (shadowField) {
      // First, directly update the text field and preview
      shadowField.value = styles.shadow;

      // Update shadow preview
      const shadowPreview = document.querySelector(
        ".shadow-preview"
      ) as HTMLElement;
      if (shadowPreview) {
        shadowPreview.style.boxShadow = styles.shadow;
      }

      // Initialize preview from stored value if that function exists
      if (
        typeof (window as any).initializeShadowPreviewFromStored === "function"
      ) {
        (window as any).initializeShadowPreviewFromStored(styles.shadow);
      }

      // Wait for all scripts to fully initialize before rebuilding shadow UI
      // Using a longer timeout to ensure everything else has loaded
      setTimeout(() => {
        // Check if the shadow value in the field still matches what we want to load
        // This prevents overwriting any changes made by the user after page load
        if (
          shadowField.value === styles.shadow &&
          (window as any).rebuildShadowFromInput
        ) {
          (window as any).rebuildShadowFromInput(styles.shadow);
        } else {
          console.warn(
            "Shadow value changed since page load, not rebuilding UI"
          );
        }
      }, 500);
    }
  }

  // Update color aliases - Add this new section
  if (styles.colours?.alias) {
    Object.entries(styles.colours.alias).forEach(([colorName, aliases]) => {
      // For each alias in this color category
      Object.entries(aliases as Record<string, string | number>).forEach(
        ([aliasName, selectedShade]) => {
          // Find all alias swatch buttons for this alias
          const aliasSelectorPath = `${colorName}.${aliasName}`;
          document
            .querySelectorAll(`[data-alias="${aliasSelectorPath}"]`)
            .forEach((swatch) => {
              // Set data-selected attribute based on whether this is the selected shade
              const shadeValue = swatch.getAttribute("data-shade");
              const isSelected = shadeValue === selectedShade.toString();
              swatch.setAttribute("data-selected", isSelected.toString());

              // If this is selected, also update the "Current: X" text
              if (isSelected) {
                // Find the parent container and update the Current text
                const container = swatch.closest(".mb-4");
                if (container) {
                  const currentText = container.querySelector(
                    ".text-xs.text-zinc-500"
                  );
                  if (currentText) {
                    currentText.textContent = `Current: ${selectedShade}`;
                  }
                }
              }
            });
        }
      );
    });

    // After updating selection states, also update all alias swatch colors
    updateAllAliasSwatches();
  }

  // Update typography
  if (styles.typography) {
    // Update desktop typography
    if (styles.typography.desktop) {
      Object.entries(styles.typography.desktop).forEach(
        ([size, props]: [string, any]) => {
          const fontSize = props.font_size || 0;
          const lineHeight = props.line_height || 0;

          const fontSizeField = document.querySelector(
            `[data-typography-field="desktop.${size}.font_size"]`
          ) as HTMLInputElement;
          const lineHeightField = document.querySelector(
            `[data-typography-field="desktop.${size}.line_height"]`
          ) as HTMLInputElement;

          if (fontSizeField) {
            fontSizeField.value = fontSize.toString();

            // Make sure to dispatch the event properly
            document.dispatchEvent(
              new CustomEvent("typographyChanged", {
                detail: { path: `desktop.${size}.font_size`, value: fontSize },
                bubbles: true, // Ensure event bubbles up
              })
            );
          }

          if (lineHeightField) {
            lineHeightField.value = lineHeight.toString();

            // Make sure to dispatch the event properly
            document.dispatchEvent(
              new CustomEvent("typographyChanged", {
                detail: {
                  path: `desktop.${size}.line_height`,
                  value: lineHeight,
                },
                bubbles: true, // Ensure event bubbles up
              })
            );
          }

          // Also update any preview elements directly
          const previewElement = document.querySelector(
            `[data-preview-id="desktop-${size}"]`
          ) as HTMLElement;

          if (previewElement) {
            // Set font size but not line-height (we're using CSS for vertical centering)
            previewElement.style.fontSize = `${fontSize}px`;

            // Update container height
            const container = previewElement.parentElement;
            if (container) {
              container.style.height = `${lineHeight}px`;

              // Update bottom line position
              const bottomLine = container.querySelector(
                ".border-t:last-child"
              );
              if (bottomLine) {
                (bottomLine as HTMLElement).style.top = `${lineHeight - 1}px`;
              }
            }
          }
        }
      );
    }

    // Repeat the same for mobile typography, ensuring events bubble correctly
    if (styles.typography.mobile) {
      Object.entries(styles.typography.mobile).forEach(
        ([size, props]: [string, any]) => {
          const fontSize = props.font_size || 0;
          const lineHeight = props.line_height || 0;

          const fontSizeField = document.querySelector(
            `[data-typography-field="mobile.${size}.font_size"]`
          ) as HTMLInputElement;
          const lineHeightField = document.querySelector(
            `[data-typography-field="mobile.${size}.line_height"]`
          ) as HTMLInputElement;

          if (fontSizeField) fontSizeField.value = fontSize.toString();
          if (lineHeightField) lineHeightField.value = lineHeight.toString();

          // Dispatch typographyChanged events to update previews
          if (fontSizeField) {
            document.dispatchEvent(
              new CustomEvent("typographyChanged", {
                detail: { path: `mobile.${size}.font_size`, value: fontSize },
              })
            );
          }

          if (lineHeightField) {
            document.dispatchEvent(
              new CustomEvent("typographyChanged", {
                detail: {
                  path: `mobile.${size}.line_height`,
                  value: lineHeight,
                },
              })
            );
          }

          // Update visual elements directly - same code as for desktop
          const previewElement = document.querySelector(
            `[data-preview-id="mobile-${size}"]`
          ) as HTMLElement;

          if (previewElement) {
            previewElement.style.fontSize = `${fontSize}px`;

            const container = previewElement.parentElement;
            if (container) {
              container.style.height = `${lineHeight}px`;

              const bottomLine = container.querySelector(
                ".border-t:last-child"
              );
              if (bottomLine) {
                (bottomLine as HTMLElement).style.top = `${lineHeight - 1}px`;
              }
            }
          }
        }
      );
    }

    // Update font weights
    if (styles.typography.weights) {
      Object.entries(styles.typography.weights).forEach(([weight, value]) => {
        const weightInput = document.querySelector(
          `[data-weight-input="${weight}"]`
        ) as HTMLInputElement;
        if (weightInput)
          weightInput.value = (value as number | string).toString();

        // Update weight handle position
        const handle = document.querySelector(
          `[data-weight-name="${weight}"]`
        ) as HTMLElement;
        if (handle) {
          const containerHeight = 500; // This should match the height in the FontWeightControl component
          const position = ((1000 - Number(value)) / 1000) * containerHeight;
          handle.style.top = `${position}px`;

          // Also update the text display
          const label = handle.querySelector("span");
          if (label) {
            label.textContent = `${weight} (${value})`;
            label.style.fontWeight = (value as number | string).toString();
          }
        }
      });
    }
  }

  // Update animation timing
  if (styles.animation) {
    Object.entries(styles.animation).forEach(([name, value]) => {
      const animationInput = document.querySelector(
        `[data-animation-input="${name}"]`
      ) as HTMLInputElement;
      if (animationInput) animationInput.value = String(value);

      // Update handle position
      const handle = document.querySelector(
        `[data-animation-name="${name}"]`
      ) as HTMLElement;
      if (handle) {
        handle.dataset.animationValue = (value as string).toString();
        const containerHeight = 400; // This should match the height in the AnimationSection component
        const maxValue = 0.5; // Max animation time from the component
        const position =
          ((maxValue - Number(value)) / maxValue) * containerHeight;
        handle.style.top = `${position}px`;

        // Update the display text
        const label = handle.querySelector("span");
        if (label) {
          label.textContent = `${name} (${value}s)`;
        }
      }
    });
  }

  // After individual events, trigger a general typography update event
  // to make sure all visualizations are updated
  setTimeout(() => {
    document.dispatchEvent(new CustomEvent("updateTypographyPreviews"));
  }, 100);

  // Give the color events time to process, then trigger a refresh of all shades
  setTimeout(() => {
    document.dispatchEvent(
      new CustomEvent("refreshAllShades", {
        bubbles: true,
      })
    );
  }, 100);
}

// Add this helper function to the file
function updateAllAliasSwatches() {
  document.querySelectorAll("[data-alias-swatch]").forEach((swatch) => {
    const swatchEl = swatch as HTMLElement;
    const colorName = swatchEl.dataset.alias?.split(".")[0];
    const shade = swatchEl.dataset.shade;

    if (colorName && shade) {
      // Find the corresponding color swatch
      const colorSwatch = document.querySelector(
        `[data-shade-swatch="${colorName}-${shade}"]`
      );

      if (colorSwatch) {
        // Set the background color directly from the element's style
        const bgColor = (colorSwatch as HTMLElement).style.backgroundColor;
        swatchEl.style.backgroundColor = bgColor;
      }
    }
  });
}

/**
 * Helper function to find the base shade for a color
 * Looks for the shade whose value matches the site color
 * or defaults to 500 if not found
 */
function findBaseShade(styles: any, colorType: string): number {
  const siteColor = styles.colours?.site?.[colorType];
  const shades = styles.colours?.shades?.[colorType];

  if (!shades || !siteColor) return 500;

  // Check which shade has a value equal to the site color
  // or whose value reference is "oklch(from var(--color-{colorType}) l c h)"
  for (const [shade, value] of Object.entries(shades)) {
    if (value === siteColor) return parseInt(shade, 10);
    if (
      typeof value === "string" &&
      value.includes(`oklch(from var(--color-${colorType}) l c h)`)
    ) {
      return parseInt(shade, 10);
    }
  }

  return 500; // Default to 500 if no match found
}

/**
 * Generates CSS content from the current theme styles
 * @returns CSS string with theme variables
 */
export function generateThemeCSS(): string {
  const styles = (window as any).currentStyles;
  if (!styles) return "";

  let css = `@theme {\n`;

  // Site Variables
  css += `  /* Site Variables */\n`;
  const siteColors = styles.colours?.site || {};
  Object.entries(siteColors).forEach(([name, value]) => {
    if (typeof value === "string") {
      css += `  --color-${name}: ${value};\n`;
    }
  });

  // Border Radius
  if (styles.radius) {
    css += `\n  --radius-site: ${styles.radius};\n`;
  }

  // Shadow
  if (styles.shadow) {
    css += `\n  --shadow-site: ${styles.shadow};\n`;
  }

  // Generate color scales using the actual formulas from the styles object
  const colorTypes = [
    "primary",
    "secondary",
    "tertiary",
    "neutral",
    "success",
    "attention",
    "error",
    "promotion",
  ];

  colorTypes.forEach((colorType) => {
    if (siteColors[colorType]) {
      const baseShade = findBaseShade(styles, colorType);
      const shades = styles.colours?.shades?.[colorType] || {};

      css += `\n  /* ${
        colorType.charAt(0).toUpperCase() + colorType.slice(1)
      } Colors */\n`;

      // First set the base shade variable
      css += `  --color-${colorType}-${baseShade}: oklch(from var(--color-${colorType}) l c h);\n\n`;

      // Then add all other shades, using their stored transforms
      Object.entries(shades).forEach(([shade, formula]) => {
        // Skip the base shade as we already defined it
        if (shade === baseShade.toString()) return;

        // If it's a formula string, use it directly
        if (typeof formula === "string" && formula.includes("oklch")) {
          css += `  --color-${colorType}-${shade}: ${formula};\n`;
        }
      });
    }
  });

  // Alias Colors
  css += `\n  /* Alias Colors */\n`;
  const aliasColors = styles.colours?.alias || {};
  Object.entries(aliasColors).forEach(([colorType, aliases]: [string, any]) => {
    if (colorType && aliases) {
      Object.entries(aliases).forEach(([aliasName, value]: [string, any]) => {
        css += `  --color-${colorType}-${aliasName.replace(
          /_/g,
          "-"
        )}: var(--color-${colorType}-${value});\n`;
      });
    }
  });

  // Typography
  const typography = styles.typography || {};
  if (typography.desktop) {
    css += `\n  /* Typography - Desktop */\n`;
    Object.entries(typography.desktop).forEach(
      ([size, props]: [string, any]) => {
        const fontSize = props.font_size || props.fontSize;
        const lineHeight = props.line_height || props.lineHeight;

        css += `  --text-desktop-${size}: ${fontSize}px;\n`;
        css += `  --line-height-desktop-${size}: ${lineHeight}px;\n`;
      }
    );
  }

  if (typography.mobile) {
    css += `\n  /* Typography - Mobile */\n`;
    Object.entries(typography.mobile).forEach(
      ([size, props]: [string, any]) => {
        const fontSize = props.font_size || props.fontSize;
        const lineHeight = props.line_height || props.lineHeight;

        css += `  --text-mobile-${size}: ${fontSize}px;\n`;
        css += `  --line-height-mobile-${size}: ${lineHeight}px;\n`;
      }
    );
  }

  // Font Weights
  if (typography.weights) {
    css += `\n  /* Font Weights */\n`;
    const weightNames: { [key: string]: string } = {
      "100": "thin",
      "200": "extra-light",
      "300": "light",
      "400": "normal",
      "500": "medium",
      "600": "semi-bold",
      "700": "bold",
      "800": "extra-bold",
      "900": "black",
      thin: "thin",
      extra_light: "extra-light",
      light: "light",
      normal: "normal",
      medium: "medium",
      semi_bold: "semi-bold",
      bold: "bold",
      extra_bold: "extra-bold",
      black: "black",
    };

    Object.entries(typography.weights).forEach(
      ([name, value]: [string, any]) => {
        const weightName = weightNames[name] || name.replace(/_/g, "-");
        css += `  --font-weight-${weightName}: ${value};\n`;
      }
    );
  }

  // Animation Timing
  if (styles.animation) {
    css += `\n  /* Animation Timing */\n`;
    Object.entries(styles.animation).forEach(([name, value]: [string, any]) => {
      css += `  --duration-speed-${name}: ${value}s;\n`;
    });
  }

  css += `}\n`;

  return css;
}

/**
 * Generic function to download any content as a file
 * @param content The content to download
 * @param filename The name of the file
 * @param contentType The MIME type of the content
 */
export function downloadFileContent(
  content: string,
  filename: string,
  contentType: string = "text/plain"
): void {
  try {
    // Create a visible feedback element
    const downloadStatus = document.createElement("div");
    downloadStatus.textContent = "Preparing download...";
    downloadStatus.style.position = "fixed";
    downloadStatus.style.top = "20px";
    downloadStatus.style.right = "20px";
    downloadStatus.style.padding = "10px 20px";
    downloadStatus.style.background = "#8B5CF6";
    downloadStatus.style.color = "white";
    downloadStatus.style.borderRadius = "4px";
    downloadStatus.style.zIndex = "9999";
    document.body.appendChild(downloadStatus);

    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    try {
      // Try the automatic download approach first
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      downloadStatus.textContent = "Download successful!";

      setTimeout(() => {
        document.body.removeChild(downloadStatus);
        URL.revokeObjectURL(url);
      }, 2000);
    } catch (err) {
      console.error("Automatic download failed:", err);
      downloadStatus.textContent = "Using fallback download method...";

      // Fallback method: Open in new tab
      const tab = window.open(url, "_blank");
      if (tab) {
        downloadStatus.textContent = `Content opened in new tab. Right-click and select "Save As" to save as ${filename}`;
        setTimeout(() => document.body.removeChild(downloadStatus), 5000);
      } else {
        // If popup blocked, show the content in a modal or provide direct instructions
        downloadStatus.innerHTML = `
          <div>Download blocked by browser.</div>
          <div>Copy the content below and save as ${filename}:</div>
          <textarea style="width:300px;height:100px;margin-top:10px;background:#f8f8f8;color:#333;padding:4px;">${content.substring(
            0,
            200
          )}...</textarea>
          <div style="margin-top:5px;font-size:12px;">
            <a href="#" id="copy-css-content" style="color:white;text-decoration:underline;">Copy full content</a>
            <span id="copy-status" style="margin-left:5px;"></span>
          </div>
        `;

        // Add copy functionality
        const copyBtn = downloadStatus.querySelector("#copy-css-content");
        if (copyBtn) {
          copyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(content).then(() => {
              const copyStatus = downloadStatus.querySelector("#copy-status");
              if (copyStatus) {
                copyStatus.textContent = "Copied!";
                setTimeout(() => {
                  copyStatus.textContent = "";
                }, 2000);
              }
            });
          });
        }

        // Make it closeable
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "5px";
        closeBtn.style.right = "5px";
        closeBtn.style.background = "none";
        closeBtn.style.border = "none";
        closeBtn.style.color = "white";
        closeBtn.style.fontSize = "20px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", () =>
          document.body.removeChild(downloadStatus)
        );
        downloadStatus.style.position = "relative";
        downloadStatus.appendChild(closeBtn);
      }
    }
  } catch (err) {
    console.error("Error downloading content:", err);
    alert("Download failed. Please check console for details.");
  }
}

/**
 * Creates and triggers download of a CSS file with theme variables
 */
export function downloadThemeCSS(): void {
  try {
    const css = generateThemeCSS();

    if (!css) {
      console.error("Generated CSS is empty");
      return;
    }

    downloadFileContent(css, "theme-variables.css", "text/css");
  } catch (err) {
    console.error("Error in downloadThemeCSS:", err);
    alert("Download failed. Please check console for details.");
  }
}

// Add to window object for direct access
(window as any).downloadThemeCSS = downloadThemeCSS;
(window as any).synchronizeUIWithStyles = synchronizeUIWithStyles;

// Add a function to create a direct download button if needed
export function createDownloadButton(): void {
  const existingButton = document.getElementById("download-theme-css-button");
  if (existingButton) return;

  const container = document.querySelector("#content-area") || document.body;

  const button = document.createElement("button");
  button.id = "download-theme-css-button";
  button.textContent = "Download Theme CSS";
  button.className =
    "bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded mt-4 mb-8";
  button.style.display = "block";
  button.addEventListener("click", downloadThemeCSS);

  container.appendChild(button);
}

/**
 * Exports the current theme styles
 * @returns The current theme styles object
 */
export function exportThemeStyles(): any {
  return (window as any).currentStyles;
}

// Add default export
export default initializeStyleManager;
