# WORK RECORD

Updated: 2026-07-15T11:00:00+08:00
Project: remote maintenance controls for the HB main and admin sites
Source: user requested that the existing one-click maintenance and restore controls work from a phone while away from the computer

## Current execution

- Selected approach: private GitHub Actions entries named `一键维护` and `一键恢复`.
- The remote controller will preserve the existing two-repository state checks, ordinary commits, no-force-push rule, fixed-path scope, and Vercel stable-URL verification.
- Design record: `docs/superpowers/specs/2026-07-15-mobile-maintenance-controls-design.md`.
- Isolated branch: `codex/mobile-maintenance-controls` at `C:\Users\Administrator\Desktop\HB\_maintenance-worktrees\mobile-maintenance-controls`.

## Verified context

- Workspace bootstrap returned `CONTEXT_READY=true` on 2026-07-15.
- The original main-site checkout is dirty and diverged from its cached `origin/main`; it was not modified.
- The isolated branch was created from cached `origin/main` commit `45450fa`, whose subject is `chore: enable full-site maintenance`.
- The existing local Windows tool remains at `C:\Users\Administrator\Desktop\HB\maintenance-toggle` and is unchanged.
- A remote fetch attempt from the current terminal was degraded because the GitHub Desktop Git helper could not load `remote-https`; no remote mutation occurred.

## Waiting input

- Written design review approval.
- Before a live mobile run: configure the fine-grained `HB_MAINTENANCE_PAT` repository secret with Contents read/write access limited to the two named private repositories. Do not record its value here.

## Next executable action

After design approval, write the TDD implementation plan, add failing regression tests, implement the portable remote toggle script and two workflows, run local verification, then configure the secret and perform an explicitly approved live production toggle test.

## Prohibitions

- Do not modify or clean the original dirty main-site checkout.
- Do not force push, reset, clean, or store credentials in files/logs.
- Do not trigger a maintenance/restore production change before implementation verification and action-time approval.

