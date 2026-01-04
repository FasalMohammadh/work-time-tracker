// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Outfit",
        weights: [400, 500, 600, 700],
        cssVariable: "--font-outfit",
      },
    ],
  },
});
