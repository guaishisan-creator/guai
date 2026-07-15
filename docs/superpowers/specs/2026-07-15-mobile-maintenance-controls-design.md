# Mobile Maintenance Controls Design

Date: 2026-07-15
Scope: `web3-finance-dashboard` and `wb3-chain-finance-admin`
Source: user selected the private GitHub mobile-action approach

## Goal

Allow the owner to switch both production sites into maintenance mode or restore both sites from a phone while away from the Windows workstation, without exposing a new public administration endpoint.

## Chosen approach

Add two manually triggered workflows to the private `web3-finance-dashboard` repository:

- `一键维护` enables maintenance mode for both repositories.
- `一键恢复` restores both repositories to their previous normal-site state.

The owner opens the repository's Actions page in the GitHub mobile app or mobile browser and runs the required workflow. GitHub authentication and any enabled account 2FA protect the entry point. The workflows use one fine-grained repository secret named `HB_MAINTENANCE_PAT`; its token value is never committed or printed.

The token must grant only repository Contents read/write access to these two private repositories:

- `hei905595-byte/web3-finance-dashboard`
- `hei905595-byte/wb3-chain-finance-admin`

## Architecture

The implementation contains:

1. Two small `workflow_dispatch` workflow files, one per action, so the mobile UI presents unambiguous maintenance and restore entries.
2. One portable Node.js command-line script shared by both workflows. It performs state detection, isolated preparation, safe commit creation, sequential push, remote-head verification, and stable-URL deployment verification.
3. Automated tests for state recognition, allowed file scope, action guards, maintenance-commit discovery, and partial-update reporting.

Both workflows use the same concurrency group. GitHub queues a second request instead of running maintenance and restore concurrently.

## State and action rules

The script fetches the current `main` branch of both repositories and classifies each target as:

- `online`: neither maintenance template file matches the approved template.
- `maintenance`: both template files match and the enabling commit can be identified by its marker.
- `unknown`: only one file matches, the marker cannot be identified, or repository identity is unexpected.

An action proceeds only when both repositories have the same recognized state:

- Enable is allowed only from `online`.
- Restore is allowed only from `maintenance`.
- Re-running an action already satisfied exits successfully without creating another commit.
- Any mixed or unknown state stops before push.

Enable copies only `vercel.json` and `public/maintenance.html`, then creates a normal commit with the existing `HB-Maintenance-Toggle: enable` marker. Restore creates a normal revert of the identified enabling commit. The script refuses a prepared commit if any other path changed.

Before each push, the script verifies that remote `main` still equals the head observed during preparation. It never uses force push, reset, clean, or history rewriting.

## Failure handling

The two repositories cannot be updated atomically. Pushes therefore remain sequential:

- Failure before the first push leaves both repositories unchanged.
- Failure after one successful push stops immediately and reports the updated repository and the repository that failed.
- The workflow does not guess at an automatic rollback because a concurrent remote change may make rollback unsafe.

The workflow summary records the requested action, starting states, prepared commit IDs, pushed repositories, final remote heads, and deployment-verification result. It must not include credentials or authenticated remote URLs.

## Deployment verification

After both pushes, the script polls the existing stable Vercel URLs for up to ten minutes:

- Enable requires HTTP 200 and the approved maintenance title/subtitle on every route.
- Restore requires HTTP 200, absence of the maintenance copy, and a non-empty normal page.

The workflow is successful only after all configured routes pass. A timeout is reported as: Git updated, production verification incomplete.

## Security boundaries

- No public control API or webhook is added.
- No token is accepted from workflow inputs or stored in repository files.
- Workflow permissions default to read-only; cross-repository writes use only `HB_MAINTENANCE_PAT`.
- Both target repository names and stable verification URLs are fixed in code.
- Logs redact secrets and do not print credential-bearing Git remotes.
- Workflow dependencies use pinned major releases and no runtime package installation is required.

## Mobile experience

On a phone, the owner opens the private repository, enters Actions, selects either `一键维护` or `一键恢复`, and confirms Run workflow. The workflow page then shows queued/running/success/failure state and a concise summary. No Windows computer needs to be online.

## Verification criteria

Before release:

- Automated tests fail before implementation and pass afterward.
- Script lint/syntax checks pass.
- A no-push preflight runs against both current repositories and recognizes their live state.
- Workflow YAML is parsed and checked for manual trigger, shared concurrency, minimal permissions, secret use, and correct action.
- Existing frontend tests, lint, and build remain passing because the workflows live in the production repository.
- The first live mobile-trigger verification is performed only after `HB_MAINTENANCE_PAT` is configured; it records both workflow run URL and final production state in `WORK_RECORD.md`.

## Rollback

Before the first live run, preserve the two starting remote heads. If the workflow implementation itself must be removed, revert its ordinary repository commit. If a partial cross-repository update occurs, inspect both remote heads and use a new normal revert commit for the already-updated repository; never force push.
