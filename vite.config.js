import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: "8080",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        "url": process.env.NODE_ENV === 'production' ? 'https://token-tracker-view.vercel.app' : 'http://localhost:8080',
        "iconUrl": process.env.NODE_ENV === "production" ? "https://token-tracker-view.vercel.app/icon-144.png" : "http://localhost:8080/icon-144.png",
        "name": "Crypto Tracker",
        "short_name": "Crypto Tracker",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "lang": "en",
        "scope": "/",
        "description": "crypto tracker app developed by saji",
        "theme_color": "#581c87",
        "screenshots": [
          {
            "label": "crypto tracker",
            "platform": "android",
            "form_factor": "narrow"
          },
          {
            "label": "crypto tracker",
            "form_factor": "wide"
          }
        ],
        "icons": [
          {
            "src": "icon-72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "icon-96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "icon-144.png",
            "sizes": "200x200",
            "type": "image/png"
          },
          {
            "src": "screenshot-512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
        "id": "crypto_tracker",
        "dir": "auto",
        "orientation": "natural",
        "categories": [
          "business",
          "finance"
        ],
        "display_override": [
          "standalone",
          "fullscreen",
          "window-controls-overlay"
        ]
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
});
