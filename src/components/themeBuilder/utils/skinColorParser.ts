import { styles } from "./defaultTheme";

/**
 * Converts a color value to the simpler CSS variable format
 * @param colorValue CSS variable string like 'var(--tenant-skin-default-background, var(--color-white))'
 * @returns The simplified color value like 'var(--color-white)'
 */
export const simplifyColorValue = (colorValue: string): string => {
  // Extract the fallback variable if available
  const fallbackMatch = colorValue.match(
    /var\([^,]+,\s*(var\(--color-[^)]+\))\)/
  );
  if (fallbackMatch && fallbackMatch[1]) {
    return fallbackMatch[1];
  }
  return colorValue;
};

/**
 * Parses a CSS variable color value to extract the base color name
 * @param colorValue CSS variable string like 'var(--tenant-skin-default-background, var(--color-white))'
 * @returns The extracted color name (e.g., 'white' or 'primary-500')
 */
export const parseColorValue = (colorValue: string): string => {
  // First simplify to get only the relevant color variable
  const simplifiedValue = simplifyColorValue(colorValue);

  // Extract the name from the CSS variable format
  const match = simplifiedValue.match(/var\(--color-([^)]+)\)/);
  if (match && match[1]) {
    return match[1];
  }

  return "";
};

/**
 * Gets current styles from localStorage or falls back to default styles
 */
export const getCurrentStyles = () => {
  // First check for window.currentStyles which is kept up to date by styleManager
  if (typeof window !== "undefined" && window.currentStyles) {
    return window.currentStyles;
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      const storedStyles = localStorage.getItem("altitude-theme-styles");
      if (storedStyles) {
        const parsed = JSON.parse(storedStyles);
        return parsed;
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }
  return styles;
};

/**
 * Calculate an OKLCH value from a formula string and base color value
 * @param formula Formula string like "oklch(from var(--color-primary) l c h)"
 * @param baseColor Base color OKLCH value
 * @param modifier Object containing modifications to apply
 */
const calculateOklchFromFormula = (
  formula: string,
  baseColor: string,
  modifier = { l: 1, c: 1, h: 0 }
): string => {
  // Parse the base color OKLCH values
  const baseMatch = baseColor.match(
    /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/
  );
  if (!baseMatch) return baseColor;

  const l = parseFloat(baseMatch[1]) * modifier.l;
  const c = parseFloat(baseMatch[2]) * modifier.c;
  const h = parseFloat(baseMatch[3]) + modifier.h;

  return `oklch(${l.toFixed(2)} ${c.toFixed(4)} ${h.toFixed(2)})`;
};

/**
 * Resolves a CSS variable color value to an actual color value
 * @param cssVar CSS variable string like 'var(--color-primary)' or 'var(--color-neutral-200)'
 * @returns The actual color value (hex or oklch)
 */
export const resolveSkinColor = (cssVar: string): string => {
  const currentStyles = getCurrentStyles();

  // Handle empty values
  if (!cssVar) return "transparent";

  // Handle direct color values (not variables)
  if (!cssVar.startsWith("var(")) return cssVar;

  // Extract the color reference from CSS variable
  const parsed = parseColorValue(cssVar);
  if (!parsed) return "transparent";

  // Split into color name and optional shade/alias
  const [colorName, shadeOrAlias] = parsed.split("-");

  // Handle simple colors (white/black)
  if (colorName === "white") return "#ffffff";
  if (colorName === "black") return "#000000";

  // If no shade specified, get the base color
  if (!shadeOrAlias) {
    // Return the base color from site colors
    if (currentStyles.colours?.site?.[colorName]) {
      return currentStyles.colours.site[colorName];
    }
    return "transparent";
  }

  // Check if it's a shade value (numeric)
  if (/^\d+$/.test(shadeOrAlias)) {
    // It's a shade
    if (shadeOrAlias === "500") {
      // Base shade, return the site color
      return currentStyles.colours.site[colorName] || "transparent";
    }

    // Get the shade formula
    const shadeFormula =
      currentStyles.colours.shades?.[colorName]?.[shadeOrAlias];
    if (!shadeFormula) return "transparent";

    // If it's a formula, calculate the value
    if (
      typeof shadeFormula === "string" &&
      shadeFormula.includes("oklch(from")
    ) {
      // Parse formula to extract the modifier values
      const baseShade = currentStyles.colours.baseShades?.[colorName] || 500;
      // Reference color could be the base or another shade
      const referenceColor =
        shadeOrAlias === baseShade.toString()
          ? currentStyles.colours.site[colorName]
          : calculateShadeValue(
              colorName,
              parseInt(shadeOrAlias),
              currentStyles
            );

      // Default modifiers based on shade value
      let lMod = parseInt(shadeOrAlias) < 500 ? 1.4 : 0.8; // Lighter for < 500, darker for >= 500
      let cMod = parseInt(shadeOrAlias) < 500 ? 0.8 : 1.1; // Less saturated for < 500, more for >= 500

      // Calculate and return the value
      return calculateOklchFromFormula(shadeFormula, referenceColor, {
        l: lMod,
        c: cMod,
        h: 0,
      });
    }

    return shadeFormula as string;
  }

  // It might be an alias
  const aliases = currentStyles.colours.alias?.[colorName];
  if (aliases && aliases[shadeOrAlias]) {
    const shadeValue = aliases[shadeOrAlias];
    return resolveSkinColor(`var(--color-${colorName}-${shadeValue})`);
  }

  return "transparent";
};

/**
 * Calculate a shade value based on formulas in the theme
 */
const calculateShadeValue = (
  colorName: string,
  shade: number,
  currentStyles: any
): string => {
  // Base case - if it's the base shade, return the site color
  const baseShade = currentStyles.colours.baseShades?.[colorName] || 500;
  if (shade === baseShade) {
    return currentStyles.colours.site[colorName];
  }

  // Get the site base color
  const baseColor = currentStyles.colours.site[colorName];
  if (!baseColor) return "transparent";

  // For lighter shades
  if (shade < baseShade) {
    // Determine how much lighter (closer to white)
    const lightness = 1 - shade / baseShade;
    return calculateOklchFromFormula("", baseColor, {
      l: 1 + lightness * 0.5, // Increase lightness
      c: 1 - lightness * 0.3, // Decrease chroma
      h: 0,
    });
  }

  // For darker shades
  // Determine how much darker (closer to black)
  const darkness = (shade - baseShade) / (1000 - baseShade);
  return calculateOklchFromFormula("", baseColor, {
    l: 1 - darkness * 0.6, // Decrease lightness
    c: 1 + darkness * 0.2, // Increase chroma slightly
    h: 0,
  });
};

/**
 * Gets all available color palettes including base colors and their shades
 * @returns Object containing all color palettes
 */
export const getColorPalette = (): Record<
  string,
  Record<string, string> | string
> => {
  const currentStyles = getCurrentStyles();

  // Create a palette with base colors and their shades
  const palette: Record<string, Record<string, string> | string> = {};

  // Add base colors from site colors
  if (currentStyles.colours && currentStyles.colours.site) {
    Object.entries(currentStyles.colours.site).forEach(([key, value]) => {
      // Ensure we're adding all colors even if they're not strings
      palette[key] = value as string;
    });
  }

  // Add shades for each base color
  if (currentStyles.colours && currentStyles.colours.shades) {
    Object.entries(currentStyles.colours.shades).forEach(([color, shades]) => {
      // For shades, we'll keep them as objects
      if (typeof palette[color] === "string") {
        palette[color] = {
          "500": palette[color] as string,
          ...(shades as Record<string, string>),
        };
      }
    });
  }

  return palette;
};

/**
 * Gets shades for a specific base color
 * @param baseColor The base color to get shades for
 * @returns Object containing all shades of the base color
 */
export const getColorShades = (baseColor: string): Record<string, string> => {
  const currentStyles = getCurrentStyles();

  // Return the shades for the specific base color if they exist
  if (currentStyles.colours.shades && currentStyles.colours.shades[baseColor]) {
    return currentStyles.colours.shades[baseColor] as Record<string, string>;
  }

  return {};
};

/**
 * Gets all color aliases that match a given color value
 * @param colorValue The color value to find aliases for
 * @returns Array of alias names
 */
export const getColorAliases = (colorValue: string): string[] => {
  const currentStyles = getCurrentStyles();
  const parsedColor = parseColorValue(colorValue);
  const [baseColor, shade] = parsedColor.split("-");
  const aliases: string[] = [];

  // If no base color found, return empty array
  if (!baseColor) return [];

  // Check if we have aliases for this base color
  if (currentStyles.colours.alias && currentStyles.colours.alias[baseColor]) {
    // Find all aliases that match this shade or base color
    Object.entries(currentStyles.colours.alias[baseColor]).forEach(
      ([alias, aliasShade]) => {
        // For base color (no shade) or matching shade alias
        if (!shade || aliasShade === shade) {
          aliases.push(`${baseColor}-${alias}`);
        }
      }
    );
  }

  return aliases;
};

/**
 * Debug helper to log the complete color structure
 */
export const logColorStructure = (): void => {
  const currentStyles = getCurrentStyles();
  console.log("Color structure:", currentStyles.colours);
};

// Initialize the global namespace for theme builder functions
if (typeof window !== "undefined") {
  window.altitudeThemeBuilder = {
    ...window.altitudeThemeBuilder,
    parseColorValue,
    getColorShades,
    getColorAliases,
    logColorStructure,
    simplifyColorValue,
    resolveSkinColor,
    getCurrentStyles,
  };
}

// Add TypeScript type definition for the global object
declare global {
  interface Window {
    altitudeThemeBuilder?: {
      parseColorValue: typeof parseColorValue;
      getColorShades: typeof getColorShades;
      getColorAliases: typeof getColorAliases;
      logColorStructure: typeof logColorStructure;
      simplifyColorValue: typeof simplifyColorValue;
      resolveSkinColor: typeof resolveSkinColor;
      getCurrentStyles: typeof getCurrentStyles;
      updateSkinColor?: (
        skinName: string,
        category: string,
        state: string,
        colorValue: string
      ) => void;
      [key: string]: any;
    };
  }
}
