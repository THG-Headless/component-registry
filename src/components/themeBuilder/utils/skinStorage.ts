import { styles } from "./defaultTheme";
import { simplifyColorValue } from "./skinColorParser";

// Storage key for theme styles - keep consistent with styleManager
const STORAGE_KEY = "altitude-theme-styles";

/**
 * Gets current styles from localStorage or falls back to default styles
 */
const getCurrentStyles = () => {
  // First check for window.currentStyles which is kept up to date by styleManager
  if (typeof window !== "undefined" && window.currentStyles) {
    return window.currentStyles;
  }

  // Fallback to localStorage
  try {
    if (typeof window !== "undefined") {
      const storedStyles = localStorage.getItem(STORAGE_KEY);
      if (storedStyles) {
        return JSON.parse(storedStyles);
      }
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return styles;
};

/**
 * Gets skin data for a specific skin from storage
 */
export const getSkinFromStorage = (skinName: string) => {
  try {
    if (typeof window !== "undefined") {
      // Use window.currentStyles directly if available (maintained by styleManager)
      if (window.currentStyles?.skins?.[skinName]) {
        return window.currentStyles.skins[skinName];
      }

      // Fallback to localStorage
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData?.skins?.[skinName]) {
          return parsedData.skins[skinName];
        }
      }
    }
  } catch (error) {
    console.error("Error getting skin from storage:", error);
  }

  // Default to initial styles
  return styles.skins[skinName] || null;
};

/**
 * Updates a specific color in a skin - FIXED FUNCTION
 */
export const updateSkinColor = (
  skinName: string,
  category: string,
  state: string,
  colorValue: string
): void => {
  try {
    if (typeof window === "undefined") return;

    console.log(
      `updateSkinColor: ${skinName}.${category}.${state} = ${colorValue}`
    );

    // Make sure we have window.currentStyles initialized
    if (!window.currentStyles) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        window.currentStyles = stored ? JSON.parse(stored) : { ...styles };
      } catch (error) {
        console.error("Error initializing window.currentStyles:", error);
        window.currentStyles = { ...styles };
      }
    }

    // Ensure skins object exists
    if (!window.currentStyles.skins) {
      window.currentStyles.skins = {};
    }

    // Ensure this skin exists
    if (!window.currentStyles.skins[skinName]) {
      window.currentStyles.skins[skinName] = {
        background: {
          default: "var(--color-white)",
          hover: "var(--color-neutral-50)",
          focus: "var(--color-neutral-50)",
          active: "var(--color-neutral-200)",
          disabled: "var(--color-neutral-50)",
        },
        foreground: {
          default: "var(--color-black)",
          hover: "var(--color-neutral-700)",
          focus: "var(--color-neutral-700)",
          active: "var(--color-neutral-600)",
          disabled: "var(--color-neutral-400)",
        },
        border: {
          default: "var(--color-black)",
          hover: "var(--color-neutral-300)",
          focus: "var(--color-neutral-400)",
          active: "var(--color-neutral-500)",
          disabled: "var(--color-neutral-200)",
        },
      };
    }

    // Ensure category exists
    if (!window.currentStyles.skins[skinName][category]) {
      window.currentStyles.skins[skinName][category] = {
        default: "",
        hover: "",
        focus: "",
        active: "",
        disabled: "",
      };
    }

    // Update the color value
    window.currentStyles.skins[skinName][category][state] = colorValue;

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(window.currentStyles));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }

    // Dispatch events to notify other components
    document.dispatchEvent(
      new CustomEvent("skinColorUpdated", {
        detail: { skinName, category, state, colorValue },
        bubbles: true,
      })
    );

    document.dispatchEvent(
      new CustomEvent("stylesUpdated", {
        detail: { source: "skins", skinName, category, state, colorValue },
        bubbles: true,
      })
    );

    console.log(`Updated ${skinName}.${category}.${state} = ${colorValue}`);
  } catch (error) {
    console.error("Error in updateSkinColor:", error);
  }
};

/**
 * Initializes the global skin storage functions
 */
export const initializeSkinStorage = (): void => {
  if (typeof window !== "undefined") {
    // Make sure functions are available globally
    window.altitudeThemeBuilder = {
      ...window.altitudeThemeBuilder,
      updateSkinColor,
      getSkinFromStorage,
      getCurrentStyles,
    };

    // Listen for style events
    document.addEventListener("stylesUpdated", (e) => {
      if ((e as CustomEvent)?.detail?.source !== "skins") {
        document.dispatchEvent(new CustomEvent("skinsNeedRefresh"));
      }
    });

    console.log("Skin storage initialized");
  }
};

// Initialize global functions
initializeSkinStorage();

// Add TypeScript type definition for window.currentStyles
declare global {
  interface Window {
    currentStyles?: any;
    altitudeThemeBuilder?: {
      updateSkinColor?: typeof updateSkinColor;
      getSkinFromStorage?: typeof getSkinFromStorage;
      [key: string]: any;
    };
  }
}
