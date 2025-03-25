export interface ColorShades {
  "50": string; // Will store either color value OR transform formula
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string; // Base shade is always an absolute color
  "600": string;
  "700": string;
  "800": string;
  "900": string;
  "950": string;
}

// Other interfaces remain unchanged
export interface ColorAlias {
  light: keyof ColorShades;
  hover_light: keyof ColorShades;
  default: keyof ColorShades;
  hover: keyof ColorShades;
  dark: keyof ColorShades;
}

export interface TypographySize {
  line_height: number;
  font_size: number;
}

export interface ThemeStyles {
  colours: {
    site: Record<string, string>;
    shades: Record<string, ColorShades>;
    alias: Record<string, ColorAlias>;
  };
  typography: {
    desktop: Record<string, TypographySize>;
    mobile: Record<string, TypographySize>;
    weights: Record<string, number>;
  };
  radius: string;
  shadow: string;
  animation: Record<string, number>;
  skins: Record<
    string,
    {
      background: {
        default: string;
        hover: string;
        focus: string;
        active: string;
        disabled: string;
      };
      foreground: {
        default: string;
        hover: string;
        focus: string;
        active: string;
        disabled: string;
      };
      border: {
        default: string;
        hover: string;
        focus: string;
        active: string;
        disabled: string;
      };
    }
  >;
}

export const styles: ThemeStyles = {
  colours: {
    site: {
      primary: "oklch(0.43 0.0147 248.17)",
      secondary: "oklch(0.67 0.15 250)",
      tertiary: "oklch(0.65 0.2 300)",
      neutral: "oklch(0.64 0 0)",
      attention: "oklch(0.55 0.12 250)",
      success: "oklch(0.5 0.15 150)",
      error: "oklch(0.55 0.2 30)",
      promotion: "oklch(0.6 0.25 30)",
      white: "#ffffff",
      black: "#000000",
    },
    shades: {
      primary: {
        "50": "oklch(from var(--color-primary-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-primary-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-primary-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-primary-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-primary-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-primary) l c h)",
        "600":
          "oklch(from var(--color-primary-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-primary-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-primary-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-primary-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-primary-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      secondary: {
        "50": "oklch(from var(--color-secondary-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-secondary-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-secondary-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-secondary-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-secondary-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-secondary) l c h)",
        "600":
          "oklch(from var(--color-secondary-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-secondary-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-secondary-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-secondary-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-secondary-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      tertiary: {
        "50": "oklch(from var(--color-tertiary-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-tertiary-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-tertiary-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-tertiary-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-tertiary-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-tertiary) l c h)",
        "600":
          "oklch(from var(--color-tertiary-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-tertiary-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-tertiary-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-tertiary-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-tertiary-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      neutral: {
        "50": "oklch(from var(--color-neutral-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-neutral-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-neutral-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-neutral-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-neutral-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-neutral) l c h)",
        "600":
          "oklch(from var(--color-neutral-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-neutral-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-neutral-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-neutral-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-neutral-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      attention: {
        "50": "oklch(from var(--color-attention-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-attention-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-attention-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-attention-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-attention-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-attention) l c h)",
        "600":
          "oklch(from var(--color-attention-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-attention-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-attention-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-attention-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-attention-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      success: {
        "50": "oklch(from var(--color-success-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-success-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-success-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-success-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-success-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-success) l c h)",
        "600":
          "oklch(from var(--color-success-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-success-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-success-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-success-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-success-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      error: {
        "50": "oklch(from var(--color-error-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-error-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-error-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-error-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-error-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-error) l c h)",
        "600":
          "oklch(from var(--color-error-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-error-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-error-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-error-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-error-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
      promotion: {
        "50": "oklch(from var(--color-promotion-100) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "100":
          "oklch(from var(--color-promotion-200) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "200":
          "oklch(from var(--color-promotion-300) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "300":
          "oklch(from var(--color-promotion-400) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "400":
          "oklch(from var(--color-promotion-500) calc(1 - (1 - l) * 0.6) calc(c * 0.8) h)",
        "500": "oklch(from var(--color-promotion) l c h)",
        "600":
          "oklch(from var(--color-promotion-500) calc(l * 0.8) calc(c * 1.1) h)",
        "700":
          "oklch(from var(--color-promotion-600) calc(l * 0.8) calc(c * 1.1) h)",
        "800":
          "oklch(from var(--color-promotion-700) calc(l * 0.8) calc(c * 1.1) h)",
        "900":
          "oklch(from var(--color-promotion-800) calc(l * 0.8) calc(c * 1.1) h)",
        "950":
          "oklch(from var(--color-promotion-900) calc(l * 0.8) calc(c * 1.1) h)",
      },
    },
    alias: {
      primary: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      secondary: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      tertiary: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      neutral: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      attention: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      success: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      error: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
      promotion: {
        light: "50",
        hover_light: "400",
        default: "500",
        hover: "600",
        dark: "950",
      },
    },
  },
  typography: {
    desktop: {
      "2xl": {
        line_height: 56,
        font_size: 45,
      },
      xl: {
        line_height: 48,
        font_size: 37,
      },
      "2lg": {
        line_height: 40,
        font_size: 30,
      },
      lg: {
        line_height: 32,
        font_size: 24,
      },
      md: {
        line_height: 28,
        font_size: 20,
      },
      body: {
        line_height: 24,
        font_size: 16,
      },
      sm: {
        line_height: 20,
        font_size: 14,
      },
      xs: {
        line_height: 20,
        font_size: 13,
      },
    },
    mobile: {
      "2xl": {
        line_height: 40,
        font_size: 32,
      },
      xl: {
        line_height: 36,
        font_size: 28,
      },
      "2lg": {
        line_height: 32,
        font_size: 24,
      },
      lg: {
        line_height: 28,
        font_size: 21,
      },
      md: {
        line_height: 24,
        font_size: 18,
      },
      body: {
        line_height: 24,
        font_size: 16,
      },
      sm: {
        line_height: 20,
        font_size: 14,
      },
      xs: {
        line_height: 20,
        font_size: 13,
      },
    },
    weights: {
      thin: 100,
      extra_light: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semi_bold: 600,
      bold: 700,
      extra_bold: 800,
      black: 900,
    },
  },
  radius: "0.5rem",
  shadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 2px 8px 0 rgba(0, 0, 0, 0.1)",
  animation: {
    none: 0,
    quick: 0.1,
    default: 0.2,
    slow: 0.3,
  },
  skins: {
    skin: {
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
    },
    skinMuted: {
      background: {
        default: "var(--color-neutral-200)",
        hover: "var(--color-neutral-300)",
        focus: "var(--color-neutral-300)",
        active: "var(--color-neutral-400)",
        disabled: "var(--color-neutral-100)",
      },
      foreground: {
        default: "var(--color-neutral-700)",
        hover: "var(--color-neutral-700)",
        focus: "var(--color-neutral-700)",
        active: "var(--color-neutral-700)",
        disabled: "var(--color-neutral-400)",
      },
      border: {
        default: "transparent",
        hover: "transparent",
        focus: "transparent",
        active: "transparent",
        disabled: "transparent",
      },
    },
  },
};
