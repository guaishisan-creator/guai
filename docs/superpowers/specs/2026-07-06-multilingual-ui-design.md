# Multilingual UI Design

## Goal

Add complete English, Simplified Chinese, Traditional Chinese, Japanese, Korean, and Thai UI support. English is the first-visit default, while later visits restore the user's last selection.

## Architecture

- Define the six supported locales and all user-visible copy in one typed translation module.
- Provide a client-side locale context that initializes to English, restores a valid saved locale from `localStorage`, and persists later selections.
- Use one shared language selector in the desktop header and mobile side menu. Both controls update the same context immediately.
- Keep shared financial values, rates, token symbols, URLs, and the `3 million ETH` campaign figure outside translations.
- Translate the home page, navigation, rate tables, advantages 1–11, dialogs, pool/loan/docs pages, accessibility labels, and empty-state copy.

## Locale Labels

| Code | Selector label |
| --- | --- |
| `en` | EN |
| `zh-CN` | 简体 |
| `zh-TW` | 繁体 |
| `ja` | 日本語 |
| `ko` | 한국어 |
| `th` | ไทย |

## Behavior

- Server and initial client render use English to avoid browser-dependent defaults.
- After hydration, a valid saved locale replaces English; invalid or missing values fall back to English.
- Selecting a language closes the mobile drawer when applicable and updates every mounted desktop/mobile copy source.
- Route navigation keeps the selected language because it is stored in `localStorage`.
- The selector remains keyboard accessible and exposes the active language.

## Translation Review Rules

- Use native, concise financial-product wording rather than literal machine translation.
- Use `Blockchain Savings` as an untranslated product name.
- Preserve `USDC`, `ETH`, percentages, currency amounts, and numeric rate values exactly.
- Do not leave Chinese fallback strings visible in non-Chinese locales.
- Keep button meanings and route destinations identical across languages.

## Testing and Verification

- Unit-test the six locale definitions, English default, invalid saved-value fallback, persistence, and switching.
- Render-test key home, dialog, navigation, rate-table, and secondary-page copy in all six locales.
- Verify desktop and mobile selectors share state and expose the same options.
- Run the full test suite, lint, production build, hardcoded-copy scan, and browser checks at desktop and mobile widths before upload.

## Scope

This change localizes the existing UI only. It does not add locale-prefixed routes, server-side locale negotiation, translated external documents, or backend-managed translation content.
