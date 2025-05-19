import { Button } from "antd";
import { getLang, toggleLanguage } from "@/utils/locales";

const LangToggler: React.FC = () => {
  return (
    <Button onClick={toggleLanguage}>{getLang() == "ar" ? "en" : "ع"}</Button>
  );
};

export default LangToggler;
