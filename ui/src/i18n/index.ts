import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import authEn from "./locales/en/auth.json";
import authAr from "./locales/ar/auth.json";
import indexEn from "./locales/en/index.json";
import indexAr from "./locales/ar/index.json";
import sidebarEn from "./locales/en/sidebar.json";
import sidebarAr from "./locales/ar/sidebar.json";
import studentEn from "./locales/en/student.json";
import studentAr from "./locales/ar/student.json";
i18n
  .use(LanguageDetector) // Detects browser language
  .use(initReactI18next) // Integrates with React
  .init({
    resources: {
      en: {
        auth: authEn,
        index: indexEn,
        sidebar: sidebarEn,
        student: studentEn,
      },
      ar: {
        auth: authAr,
        index: indexAr,
        sidebar: sidebarAr,
        student: studentAr,
      },
    },
    // lng: "ar", // default
    fallbackLng: "en",

    ns: ["auth", "index", "sidebar", "student"],
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
