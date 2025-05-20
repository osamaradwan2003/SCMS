import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import authEn from "./locales/en/auth.json";
import authAr from "./locales/ar/auth.json";
import indexEn from "./locales/en/index.json";
import indexAr from "./locales/ar/index.json";
i18n
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next) // Integrates with React
  .init({
    resources: {
      en: { auth: authEn, index: indexEn },
      ar: { auth: authAr, index: indexAr },
    },
    // lng: "ar", // default
    fallbackLng: "en",

    ns: ["auth", "index"],
    defaultNS: "auth",

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
