import i18n from "@/i18n";

export function toggleLanguage() {
  const newLang = i18n.language === "en" ? "ar" : "en";
  i18n.changeLanguage(newLang);
  window.location.reload();
}

export function getLang() {
  return i18n.language;
}
