import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DICTIONARIES, LANGUAGE_CODES } from "@/lib/dictionaries";

const STORAGE_KEY = "afrikart.lang";

// Langues servies par la plateforme.
const SUPPORTED = new Set(LANGUAGE_CODES);

// Pays où le français est langue d'usage : un visiteur dont le navigateur est
// réglé sur une autre langue y est tout de même accueilli en français.
const FRANCOPHONE_COUNTRIES = new Set([
  "FR", "BE", "LU", "MC", "SN", "CI", "CM", "ML", "BF", "NE", "TG", "BJ",
  "GA", "CG", "CD", "MG", "RW", "BI", "DJ", "KM", "GN", "TD", "CF", "MR",
  "DZ", "MA", "TN", "SC", "MU",
]);

const LUSOPHONE_COUNTRIES = new Set([
  "AO", "MZ", "CV", "GW", "ST", "TL", "PT", "BR",
]);

const SWAHILI_COUNTRIES = new Set(["TZ", "KE", "UG", "SS"]);

// Ordre : langue du navigateur, puis pays d'usage, puis anglais.
function detectLanguage() {
  if (typeof navigator === "undefined") return "fr";
  const tags =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];

  for (const tag of tags) {
    const [code, region] = String(tag).toLowerCase().split("-");
    if (SUPPORTED.has(code)) return code;
    if (!region) continue;
    const country = region.toUpperCase();
    if (FRANCOPHONE_COUNTRIES.has(country)) return "fr";
    if (LUSOPHONE_COUNTRIES.has(country)) return "pt";
    if (SWAHILI_COUNTRIES.has(country)) return "sw";
  }
  return "en";
}

const I18nContext = createContext({
  lang: "fr",
  setLang: () => {},
  t: (key) => key,
});

function translate(lang, key, vars) {
  const dict = DICTIONARIES[lang] || DICTIONARIES.fr;
  let value = dict[key];
  if (value === undefined) value = DICTIONARIES.fr[key];
  if (value === undefined) return key;
  if (!vars) return value;
  return Object.keys(vars).reduce(
    (acc, name) => acc.split(`{${name}}`).join(String(vars[name])),
    value
  );
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("fr");

  // La langue est choisie après le montage : le rendu serveur et le premier
  // rendu client restent identiques (pas d'erreur d'hydratation). Priorité au
  // choix mémorisé du visiteur, sinon détection par langue et pays.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.has(stored)) {
      setLangState(stored);
      return;
    }
    setLangState(detectLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Seul un changement explicite est mémorisé : la détection ne fige pas la langue.
  const setLang = useCallback((next) => {
    if (!SUPPORTED.has(next)) return;
    window.localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }, []);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}