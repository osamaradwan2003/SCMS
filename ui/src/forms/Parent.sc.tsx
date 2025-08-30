import { type FormSchema } from "@/@types";
import { useTranslate } from "@/hooks/locales";

export const ParentFormSchema = (): FormSchema[] => {
  const t = useTranslate("parent");

  return [
    {
      name: "p_name",
      type: "text",
      inputProps: { placeholder: t("placeholder.name") },
    },
    {
      name: "p_email",
      type: "email",
      inputProps: { placeholder: t("palceholder.email") },
    },
    {
      name: "p_phone",
      type: "tel",
      inputProps: { placeholder: t("placeholder.phone") },
    },
    {
      name: "p_addr",
      type: "text",
      inputProps: { placeholder: t("palceholder.address") },
    },
    {
      name: "p_id",
      type: "upload",
      inputProps: { placeholder: t("placholder.doc_id") },
    },
  ];
};
