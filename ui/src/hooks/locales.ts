import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export function useTranslate(ns?: string) {
  const { t } = useTranslation(ns);
  if (ns) return t;
  return i18n.t;
}
