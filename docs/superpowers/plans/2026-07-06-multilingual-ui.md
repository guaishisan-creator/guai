# Multilingual UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship six complete UI languages with English as the first-visit default and persistent user selection.

**Architecture:** A typed locale catalog owns translated UI copy. A root client provider stores the active locale, validates `localStorage`, and exposes translations through a hook used by desktop and mobile components.

**Tech Stack:** Next.js 15, React 19, TypeScript, Vitest, Testing Library, Tailwind CSS.

---

### Task 1: Locale catalog and state

**Files:** Create `src/i18n/locales.ts`, `src/i18n/locale-provider.tsx`; modify `src/app/layout.tsx`; test `src/__tests__/locale.test.tsx`.

- [ ] Write tests for six options, English default, valid restore, invalid fallback, switching, and persistence.
- [ ] Run `npm.cmd test -- --run src/__tests__/locale.test.tsx` and confirm the missing-module failure.
- [ ] Implement the typed catalog and provider, then rerun the test to green.

### Task 2: Shared navigation and home copy

**Files:** Modify `src/constants/finance.ts`, layout, hero, finance, market, and home components; test `src/__tests__/page.test.tsx` and `src/__tests__/finance-data.test.ts`.

- [ ] Add failing assertions for English initial copy, shared PC/H5 switching, selector options, preserved financial numbers, and unique anchors.
- [ ] Replace hardcoded UI copy with locale catalog values and connect both selectors to the shared provider.
- [ ] Run focused tests until green.

### Task 3: Secondary routes and translation audit

**Files:** Modify `src/app/pool/page.tsx`, `src/app/loan/page.tsx`, `src/app/docs/page.tsx`, `src/components/finance/pool-dashboard.tsx`, and `src/components/layout/secondary-page-shell.tsx`; test `src/__tests__/routes.test.tsx`.

- [ ] Add failing English and language-switch route assertions.
- [ ] Localize route content, tabs, disabled states, dialog copy, and accessibility labels.
- [ ] Scan for remaining user-visible Chinese literals outside the locale catalog.

### Task 4: Finish current responsive UI work and release

**Files:** Complete the already modified navigation, carousel, rate spacing, and responsive-layout files.

- [ ] Fix duplicate anchors and verify all desktop/mobile destinations.
- [ ] Run `npm.cmd test -- --run`, `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check`.
- [ ] Browser-check desktop and mobile layouts, commit intended files only, merge to `main`, push `origin main`, and verify the remote commit.
