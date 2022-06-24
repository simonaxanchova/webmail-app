import LocalizedStrings from "react-localization";
import { localeEn } from "./LocaleEn";
import { localeMk } from "./LocaleMk";

export const LOCALE = new LocalizedStrings({
  mk: localeMk,
  en: localeEn,
});

LOCALE.setLanguage("en");
