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
import classesEn from "./locales/en/classes.json";
import classesAr from "./locales/ar/classes.json";
import subjectsEn from "./locales/en/subjects.json";
import subjectsAr from "./locales/ar/subjects.json";
import employeesEn from "./locales/en/employees.json";
import employeesAr from "./locales/ar/employees.json";
import banksEn from "./locales/en/banks.json";
import banksAr from "./locales/ar/banks.json";
import categoriesEn from "./locales/en/categories.json";
import categoriesAr from "./locales/ar/categories.json";
import transactionsEn from "./locales/en/transactions.json";
import transactionsAr from "./locales/ar/transactions.json";
import guardiansEn from "./locales/en/guardians.json";
import guardiansAr from "./locales/ar/guardians.json";
import attendanceEn from "./locales/en/attendance.json";
import attendanceAr from "./locales/ar/attendance.json";
import messagesEn from "./locales/en/messages.json";
import messagesAr from "./locales/ar/messages.json";
import weeklyreportsEn from "./locales/en/weeklyreports.json";
import weeklyreportsAr from "./locales/ar/weeklyreports.json";
import payrollEn from "./locales/en/payroll.json";
import payrollAr from "./locales/ar/payroll.json";
import incometypesEn from "./locales/en/incometypes.json";
import incometypesAr from "./locales/ar/incometypes.json";
import expensetypesEn from "./locales/en/expensetypes.json";
import expensetypesAr from "./locales/ar/expensetypes.json";
import subscriptionsEn from "./locales/en/subscriptions.json";
import subscriptionsAr from "./locales/ar/subscriptions.json";
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
        classes: classesEn,
        subjects: subjectsEn,
        employees: employeesEn,
        banks: banksEn,
        categories: categoriesEn,
        transactions: transactionsEn,
        guardians: guardiansEn,
        attendance: attendanceEn,
        messages: messagesEn,
        weeklyreports: weeklyreportsEn,
        payroll: payrollEn,
        incometypes: incometypesEn,
        expensetypes: expensetypesEn,
        subscriptions: subscriptionsEn,
      },
      ar: {
        auth: authAr,
        index: indexAr,
        sidebar: sidebarAr,
        student: studentAr,
        classes: classesAr,
        subjects: subjectsAr,
        employees: employeesAr,
        banks: banksAr,
        categories: categoriesAr,
        transactions: transactionsAr,
        guardians: guardiansAr,
        attendance: attendanceAr,
        messages: messagesAr,
        weeklyreports: weeklyreportsAr,
        payroll: payrollAr,
        incometypes: incometypesAr,
        expensetypes: expensetypesAr,
        subscriptions: subscriptionsAr,
      },
    },
    // lng: "ar", // default
    fallbackLng: "en",

    ns: [
      "auth",
      "index",
      "sidebar",
      "student",
      "students",
      "classes",
      "subjects",
      "employees",
      "banks",
      "categories",
      "transactions",
      "guardians",
      "attendance",
      "messages",
      "weeklyreports",
      "payroll",
      "incometypes",
      "expensetypes",
      "subscriptions",
    ],
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
