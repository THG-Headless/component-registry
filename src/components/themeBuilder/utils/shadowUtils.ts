// Types for shadow data
/**
 * Interface representing a shadow's properties
 */
export interface Shadow {
  horizontalOffset: number;
  verticalOffset: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  colorName: string;
  opacity: number;
  isInset: boolean;
}

// Define a type for color mapping
export type ThemeColorMap = Record<string, string>;

// Theme colors - these should match the colors from the color tab
export const themeColors: ThemeColorMap = {
  primary: "#3B82F6",
  secondary: "#6B7280",
  accent: "#10B981",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#6B7280",
  red: "#EF4444",
  yellow: "#F59E0B",
  green: "#10B981",
  blue: "#3B82F6",
  indigo: "#6366F1",
  purple: "#8B5CF6",
  pink: "#EC4899",
};

// Define an interface for color entries
export interface ColorEntry {
  name: string;
  value: string;
}

// Array version of theme colors for iteration in templates
export const themeColorArray: ColorEntry[] = Object.entries(themeColors).map(
  ([name, value]): ColorEntry => ({
    name,
    value,
  })
);

/**
 * Extract numeric value from CSS dimension string
 * @param value CSS dimension string (e.g., '10px', '-5rem')
 * @returns Parsed integer or 0 if parsing fails
 */
function parseDimension(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/^-?\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Function to parse a single shadow string
 * @param shadowStr Shadow CSS string
 * @returns Parsed Shadow object
 */
export function parseShadow(shadowStr: string): Shadow {
  const defaultShadow: Shadow = {
    horizontalOffset: 0,
    verticalOffset: 0,
    blurRadius: 0,
    spreadRadius: 0,
    color: "rgba(0, 0, 0, 0.1)",
    opacity: 0.1,
    colorName: "black",
    isInset: false,
  };

  if (!shadowStr || shadowStr.trim() === "") {
    return defaultShadow;
  }

  const trimmedShadow: string = shadowStr.trim();

  // Check if it contains inset
  const isInset: boolean = trimmedShadow.includes("inset");
  let shadowWithoutInset: string = isInset
    ? trimmedShadow.replace(/\binset\b/, "").trim()
    : trimmedShadow;

  // Find where the color starts - it could be rgb, rgba, hsl, hsla, or hex
  let parts: string[] = [];
  let color: string = "rgba(0, 0, 0, 0.1)";
  let opacity: number = 0.1;

  const colorPatterns: RegExp[] = [
    /rgba?\([^)]+\)/, // rgb/rgba
    /hsla?\([^)]+\)/, // hsl/hsla
    /#[0-9a-fA-F]{3,8}/, // hex
  ];

  let remainingParts: string = shadowWithoutInset;

  // Look for color patterns
  for (const pattern of colorPatterns) {
    const match = remainingParts.match(pattern);
    if (match && match[0]) {
      color = match[0];

      // Try to extract opacity from rgba
      if (color.startsWith("rgba")) {
        const opacityMatch = color.match(
          /rgba\([^,]+,[^,]+,[^,]+,\s*([0-9.]+)\s*\)/
        );
        if (opacityMatch && opacityMatch[1]) {
          const parsedOpacity = parseFloat(opacityMatch[1]);
          // Ensure opacity is between 0 and 1
          opacity = !isNaN(parsedOpacity)
            ? Math.min(Math.max(parsedOpacity, 0), 1)
            : 0.1;
        }
      }

      // Remove color from the remaining parts
      remainingParts = remainingParts.replace(match[0], "").trim();
      break;
    }
  }

  // Split the remaining parts which should be numbers with units
  parts = remainingParts.split(/\s+/).filter(Boolean);

  return {
    horizontalOffset: parts.length > 0 ? parseDimension(parts[0]) : 0,
    verticalOffset: parts.length > 1 ? parseDimension(parts[1]) : 0,
    blurRadius: parts.length > 2 ? parseDimension(parts[2]) : 0,
    spreadRadius: parts.length > 3 ? parseDimension(parts[3]) : 0,
    color,
    opacity,
    colorName: "black", // Default, will be updated by UI
    isInset,
  };
}

/**
 * Split the shadow string by commas, accounting for commas within color values
 * @param shadowStr Full shadow CSS string
 * @returns Array of individual shadow strings
 */
export function splitShadows(shadowStr: string): string[] {
  if (!shadowStr) return [""];

  const shadows: string[] = [];
  let currentShadow: string = "";
  let insideParenthesis: number = 0;

  for (let i = 0; i < shadowStr.length; i++) {
    const char: string = shadowStr[i];

    if (char === "(") insideParenthesis++;
    else if (char === ")") insideParenthesis--;

    // Only split by commas when we're not inside parentheses (like rgba)
    if (char === "," && insideParenthesis === 0) {
      shadows.push(currentShadow.trim());
      currentShadow = "";
    } else {
      currentShadow += char;
    }
  }

  if (currentShadow.trim()) {
    shadows.push(currentShadow.trim());
  }

  return shadows.length ? shadows : [""];
}

/**
 * Function to generate rgba from color name and opacity
 * @param colorName Name of the color from theme
 * @param opacity Opacity value between 0 and 1
 * @returns RGBA color string
 */
export function generateRgbaColor(colorName: string, opacity: number): string {
  const hexColor: string = themeColors[colorName] || "#000000";

  // Ensure opacity is between 0 and 1
  const safeOpacity = Math.min(Math.max(opacity, 0), 1);

  // Convert hex to rgb
  const r: number = parseInt(hexColor.slice(1, 3), 16);
  const g: number = parseInt(hexColor.slice(3, 5), 16);
  const b: number = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${safeOpacity.toFixed(2)})`;
}

/**
 * Function to try converting color formats to hex for color input
 * @param color Color string in any format
 * @returns Hex color or null if conversion fails
 */
export function convertToHex(color: string): string | null {
  if (!color) return null;

  try {
    // For simple hex values or named colors
    const tempElem: HTMLDivElement = document.createElement("div");
    tempElem.style.color = color;
    document.body.appendChild(tempElem);
    const computedColor: string = getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);

    if (computedColor.startsWith("rgb")) {
      const rgbMatch = computedColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
      if (rgbMatch && rgbMatch.length >= 4) {
        const r: string = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
        const g: string = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
        const b: string = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
      }
    }
  } catch (error) {
    console.error("Error converting color to hex:", error);
  }

  return null;
}
