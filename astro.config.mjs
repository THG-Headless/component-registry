// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@registry":
          "/Users/joe.johnson02/Documents/Altitude/component-registry/registry",
      },
    },
  },

  integrations: [react()],
});
