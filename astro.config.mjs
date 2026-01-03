// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import icon from "astro-icon";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon({
      include: {
        mdi: ["plus", "delete"],
      },
    }),
    react(),
  ],
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Outfit",
        weights: [300, 400, 500, 600, 700],
        cssVariable: "--font-outfit",
      },
    ],
  },
});
