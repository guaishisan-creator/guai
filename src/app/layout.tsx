import type { Metadata } from "next";
import { uiText } from "@/constants/finance";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-provider";

export const metadata: Metadata = { title: uiText.pageTitle, description: uiText.pageDescription };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
