import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Dict } from "./en";
import { sv } from "./sv";
import { pl } from "./pl";
import { ru } from "./ru";
import { track } from "@/lib/analytics";

export const LOCALES = ["en", "sv", "pl", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const dictionaries: Record<Locale, Dict> = { en, sv, pl, ru };
const STORAGE_KEY = "dn-locale";

type Ctx = { locale: Locale; t: Dict; setLocale: (l: Locale) => void };
const I18nContext = createContext<Ctx>({ locale: DEFAULT_LOCALE, t: en, setLocale: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  // Server and first client render always use English (default); stored choice applies after hydration.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && LOCALES.includes(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
    track("language_changed", { locale: l });
  }, []);

  return <I18nContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
