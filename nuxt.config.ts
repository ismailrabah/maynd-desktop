import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/i18n"],
  i18n: {
    locales: [
      { code: "fr", name: "Français", file: "fr.json" },
      { code: "ar", name: "العربية", file: "ar.json", dir: "rtl" },
      { code: "en", name: "English", file: "en.json" }
    ],
    langDir: "locales",
    defaultLocale: "fr",
    strategy: "prefix_except_default"
  },
  typescript: { strict: true },
  css: ["~/assets/css/main.css"]
})