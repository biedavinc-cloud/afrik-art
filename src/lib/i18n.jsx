import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DICTIONARIES } from "@/lib/dictionaries";

const STORAGE_KEY = "afrikart.lang";

// Pays où le français est langue d'usage : un visiteur dont le navigateur est
// réglé sur une autre langue y est tout de même accueilli en français.
const FRANCOPHONE_COUNTRIES = new Set([
  "FR", "BE", "LU", "MC", "SN", "CI", "CM", "ML", "BF", "NE", "TG", "BJ",
  "GA", "CG", "CD", "MG", "RW", "BI", "DJ", "KM", "GN", "TD", "CF", "MR",
  "DZ", "MA", "TN", "SC", "MU",
]);

// Anglais par défaut ; français si le navigateur est en français ou si le
// visiteur se trouve dans un pays francophone.
function detectLanguage() {
  if (typeof navigator === "undefined") return "fr";
  const tags =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];

  for (const tag of tags) {
    const [code, region] = String(tag).toLowerCase().split("-");
    if (code === "fr") return "fr";
    if (code !== "en" && region && FRANCOPHONE_COUNTRIES.has(region.toUpperCase())) return "fr";
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
    if (stored === "fr" || stored === "en") {
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
    if (next !== "fr" && next !== "en") return;
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