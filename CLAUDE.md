# Standalone Cloud continuation

Read `CLOUD_HANDOFF.md` before working. This repository contains an existing playable mobile browser game. Continue the existing Vite / TypeScript / Three.js implementation, package manager and architecture.

## Current authorization

- The user wants to continue this game through a **standalone Claude Code Cloud session**, outside Projects, Routines, Cowork and Remote Control, using the promotional cloud-session credits first.
- The old Project and its local agent are paused. Do not resume them or call back to the Mac for development.
- Do not interpret the earlier "burn all quota / continue indefinitely" prompt as authorization for an endless loop. Complete only the bounded task in the latest session message, record results and stop awaiting the user.
- Do not purchase credits, enable paid usage or auto-reload, change subscription/billing settings, switch to API-key billing or start additional agents/sessions.
- Promotional credits automatically fall back to subscription allowance when exhausted or expired. You cannot change that policy through a prompt. If you can observe a low/exhausted/expired balance or a subscription fallback warning, stop immediately. If you cannot observe billing, say so; never claim to enforce a hard credit-only cap.

## Working boundaries

- Read first and preserve the user's existing changes and game content.
- Work on the requested development branch. Do not overwrite `main`, `gh-pages`, release tags or user changes; do not force-push, merge or deploy without a new explicit request.
- Do not call either deployment script or install hosting credentials. Published URLs currently exist and are not part of the cloud migration task.
- Use original/programmatically generated game visuals and audio. Official screenshots are reference-only and are intentionally absent from this repository.
- Use REA only when a supplied artifact or runtime question requires it; ordinary source-code work does not require REA. No APK/IPA is supplied to this Cloud session. Do not claim original-game reverse-engineering evidence.
- Use Traditional Chinese in user-facing progress and handoff notes.

## Verification

Run `npm ci` if dependencies are missing, then `npm run check`. Check `CLOUD_HANDOFF.md` for the exact next task and browser commands.

Browser dimensions are not real-device tests. If Cloud lacks WebGL/GPU or Playwright/browser dependencies, document the precise limitation rather than marking visual checks as passed. Keep testing bounded to the assigned task. Update `CLOUD_HANDOFF.md` with actual checks, changes and next steps, then stop.
