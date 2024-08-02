import en from "@src/_locales/en.json";

const existingLanguageCodes = ["en"];
export const languageCodeMap = {
  en: "English",
};

export * from "./localeContext";
export const defaultLocale = existingLanguageCodes.includes(navigator.language)
  ? navigator.language
  : "en";
export const messages = {
  en,
};
