# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the source of truth for decisions, architecture, content and theology rules, Bible
authorization and scripts. It is imported here; keep it updated instead of duplicating it in this file.

@AGENTS.md

## Additions for Claude Code

### Styling: read `styling/` before building UI

When you make a new screen, component, widget or visual element, use `styling/STYLE_GUIDE.md` as the
reference and match the mockups in `styling/reference/`. Build from the tokens in `src/theme/tokens.ts`
and the primitives in `src/ui/` rather than new values. The mockups show style only: where their text,
images or features differ from the app's content, keep the app's content and apply the style rules. If
a design decision changes, update the style guide in the same change.

### Commands not listed in AGENTS.md

```bash
npm run preflight                       # typecheck + lint + test + expo-doctor in one go
npx jest src/content/__tests__/validate.test.ts   # one test file
npx jest -t "part of a test name"       # tests matching a name
```

- `npm test` sets `TZ=Europe/Amsterdam`; date-dependent tests (e.g. widget timelines) assume it. When running Jest directly, prefix with `TZ=Europe/Amsterdam`.
- `npm run bible:manifest` regenerates `BGT_REFERENCE_MANIFEST.json` (which chapters the lessons need).
- `iphone:*` scripts wrap `eas-cli@25` for login, device registration and preview/development builds;
  see `IPHONE_INSTALL_GUIDE.md`.

### Things that span several files

- Route files missing from the AGENTS.md tree: `src/app/bible/[lessonId].tsx` (BGT reader, logic in
  `src/features/bible`) and `src/app/widgets.tsx` (widget gallery). Bible text is read only through
  `src/content/bible.ts`, which loads `src/content/bible/bgt.json`.
- This is a public showcase repo: `bgt.json` keeps the real structure and checksums but every verse is a
  placeholder. Do not "fix" the placeholders or add real BGT text to the repository.
- Platform variants use Metro suffixes (`*.web.ts` for journal store, legacy reflections, reminders,
  share, confirm and the tabs layout; `publish.ios.ts` for widgets). Find them with
  `find src -name '*.web.*' -o -name '*.ios.*'` and change both files together.
- Imports use the `@/` alias for `src/` (`tsconfig.json`).
- Tests: native modules (AsyncStorage, SecureStore, file system, crypto, Reanimated) are mocked in-memory
  in `jest.setup.js`. Component tests stub `useAppState()` with `makeStore()` from
  `src/test-utils/test-store.ts`. Pipeline parser tests live in `scripts/bible/__tests__`.
- Expo docs: the `expo` Claude Code plugin is enabled in `.claude/settings.json`; still check the SDK 58
  docs as AGENTS.md requires.
