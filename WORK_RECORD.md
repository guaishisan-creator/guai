# WORK RECORD

Updated: 2026-07-15T11:13:00+08:00
Project: remote maintenance controls for the HB main and admin sites
Source: user requested that the existing one-click maintenance and restore controls work from a phone while away from the computer

## Current status

- Implemented private GitHub Actions entries named `一键维护` and `一键恢复`; both are usable from Android or iPhone through GitHub App/mobile web once published to private `main`.
- Implemented the portable controller with two-repository state checks, ordinary commits, no-force-push rule, fixed-path scope, concurrency protection, partial-update reporting, and Vercel stable-URL verification.
- Design record: `docs/superpowers/specs/2026-07-15-mobile-maintenance-controls-design.md`.
- Implementation plan: `docs/superpowers/plans/2026-07-15-mobile-maintenance-controls.md`.
- Isolated branch: `codex/mobile-maintenance-controls` at `C:\Users\Administrator\Desktop\HB\_maintenance-worktrees\mobile-maintenance-controls`.
- Local implementation commits before final workflow commit: `147594e`, `5104bf1`, `b754a2f`, `4b19e81`.

## Verified context

- Workspace bootstrap returned `CONTEXT_READY=true` on 2026-07-15.
- The original main-site checkout is dirty and diverged from its cached `origin/main`; it was not modified.
- The isolated branch was created from cached `origin/main` commit `45450fa`, whose subject is `chore: enable full-site maintenance`.
- The existing local Windows tool remains at `C:\Users\Administrator\Desktop\HB\maintenance-toggle` and is unchanged.
- The Git executable path and narrow per-repository `safe.directory` handling were corrected and regression-tested. Live HTTPS fetch remains degraded because the isolated local account has no GitHub HTTPS credential (`SEC_E_NO_CREDENTIALS`); no remote mutation occurred.

## Verification

- TDD RED evidence: controller import initially failed with `ERR_MODULE_NOT_FOUND`; workflow tests initially failed because both workflow files were absent; the safe-directory regression initially failed because the helper export was absent.
- Controller and workflow tests: `node --test scripts/maintenance-remote.node-test.mjs scripts/maintenance-workflows.node-test.mjs` passed 20/20.
- Existing frontend tests: `npm.cmd test -- --run --maxWorkers=1` passed 47/47 across 8 files.
- ESLint: `npm.cmd run lint` passed.
- Production build: `npm.cmd run build` passed and generated 8 static routes.
- The first parallel verification attempt was degraded by worker startup/resource timeouts; renaming native Node tests to `.node-test.mjs` and rerunning sequentially produced the passing results above without changing the existing Vitest configuration.
- Mobile GitHub App is installed and authorized on the user's phone according to the user on 2026-07-15.
- Publication check: `gh auth status` found the configured `hei905595-byte` GitHub CLI account but reported its stored token invalid. Publishing and secret configuration therefore require re-authentication or explicit use of the existing Chrome GitHub session; no credential was exposed.

## Waiting input

- Publish the reviewed commits to the private `web3-finance-dashboard` repository without overwriting any concurrent remote change.
- Configure the fine-grained `HB_MAINTENANCE_PAT` repository secret with Contents read/write access limited to the two named private repositories. Do not record its value here.
- A live production maintenance/restore workflow still requires action-time confirmation; neither workflow has been triggered in this implementation session.

## Next executable action

Commit the workflow files and final record, obtain authenticated GitHub access for branch publication and secret configuration, verify both repositories remain private, publish normally, then stop immediately before the first live production toggle for action-time confirmation.

## Prohibitions

- Do not modify or clean the original dirty main-site checkout.
- Do not force push, reset, clean, or store credentials in files/logs.
- Do not trigger a maintenance/restore production change before implementation verification and action-time approval.
