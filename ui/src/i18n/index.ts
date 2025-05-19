import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/auth.json";
import ar from "./locales/ar/auth.json";

i18n
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next) // Integrates with React
  .init({
    resources: {
      en: { auth: en },
      ar: { auth: ar },
    },
    lng: "ar", // default
    fallbackLng: "en",

    ns: ["auth", "index"],
    defaultNS: "index",

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
