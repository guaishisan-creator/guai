"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isLocale, translations, type Locale, type LocaleText } from "./locales";

const STORAGE_KEY = "blockchain-savings-locale";
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; text: LocaleText };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => { const timer = window.setTimeout(() => { const saved = localStorage.getItem(STORAGE_KEY); if (isLocale(saved)) setLocaleState(saved); }, 0); return () => window.clearTimeout(timer); }, []);
  const setLocale = (next: Locale) => { setLocaleState(next); localStorage.setItem(STORAGE_KEY, next); document.documentElement.lang = next; };
  return <LocaleContext.Provider value={{ locale, setLocale, text: translations[locale] }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used within LocaleProvider");
  return value;
}
