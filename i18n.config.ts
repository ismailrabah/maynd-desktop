import { defineI18nConfig } from "#i18n"
export default defineI18nConfig(() => ({
  legacy: false,
  locale: "fr",
  messages: {
    fr: () => import("./locales/fr.json").then(m => m.default),
    ar: () => import("./locales/ar.json").then(m => m.default),
    en: () => import("./locales/en.json").then(m => m.default)
  }
}))