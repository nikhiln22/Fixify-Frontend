import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
        type: "module",
      },

      // 🔥 Your icons live directly in /public
      includeAssets: ["favicon.ico", "icon-192x192.png", "icon-512x512.png"],

      // 🔥 FIXIFY Manifest
      manifest: {
        name: "Fixify",
        short_name: "Fixify",
        description: "A service and maintenance application",
        theme_color: "#1a73e8",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait-primary",

        // 🔥 icons directly in /public (NO /icons/)
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // 🔥 Fix build error + enable smart caching
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,

        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],

        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],

  server: {
    open: true,
  },
});
