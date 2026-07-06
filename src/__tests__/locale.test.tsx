import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleProvider, useLocale } from "@/i18n/locale-provider";
import { localeOptions } from "@/i18n/locales";

function Probe() {
  const { locale, setLocale, text } = useLocale();
  return <><span>{locale}</span><span>{text.navigation.home}</span>{localeOptions.map((option) => <button key={option.code} onClick={() => setLocale(option.code)}>{option.label}</button>)}</>;
}

describe("locale state", () => {
  beforeEach(() => localStorage.clear());

  it("offers six locales and defaults to English", () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(localeOptions.map(({ label }) => label)).toEqual(["EN", "简体", "繁体", "日本語", "한국어", "ไทย"]);
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("switches locale and persists the choice", () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    fireEvent.click(screen.getByRole("button", { name: "日本語" }));
    expect(screen.getByText("ja")).toBeInTheDocument();
    expect(screen.getByText("ホーム")).toBeInTheDocument();
    expect(localStorage.getItem("blockchain-savings-locale")).toBe("ja");
  });

  it("ignores an invalid saved locale", () => {
    localStorage.setItem("blockchain-savings-locale", "invalid");
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByText("en")).toBeInTheDocument();
  });
});
