# MORAL FUEL — agent and contributor guide

Moral Fuel helps people who are new to Christianity apply Christian teaching in everyday life.
Promise: **Learn. Reflect. Live.** (Dutch UI: *Leer. Overdenk. Leef.*). The public name is always
MORAL FUEL; never use FaithGuide branding.

This file records the project's decisions, architecture, scripts and rules. Read it before you change
anything, and update it when a decision changes.

## Decisions (Phase 1 and 2)

| Decision | Choice | Why |
| --- | --- | --- |
| Stack | Expo SDK 58, Expo Router, TypeScript strict, React 19.3, RN 0.88, React Compiler | Current Expo template; file-based routes in `src/app`. |
| Data | Offline-first, on-device only | No accounts, server, analytics, payments, social features or live LLM in Phase 1. |
| App state | One JSON record in AsyncStorage (`moralfuel.state.v1`) | Small, synchronous-feeling, works on web too. |
| Corrupt, old or stale state | `parseAppState` runs `MIGRATIONS` from older versions, starts fresh on corrupt JSON or a version with no path, and drops invalid or removed-lesson entries one by one | The app must always open, and an update must never reset progress. Bump `APP_STATE_VERSION` only with a migration. |
| Journal and reflections | One XChaCha20-Poly1305 encrypted file (`@noble/ciphers`) in the document folder; the random key lives in expo-secure-store. Lesson reflections are journal entries. Memory only on web | Private text never sits in plain storage, works in Expo Go, keeps search fast. A missing key gives an honest unreadable state. Phase 1 SecureStore reflections are imported once. |
| Reminders | Real local daily notification through expo-notifications at a suggested or custom time; permission asked only when the user picks a time; `syncReminder` cancels and reschedules on every change and launch | No duplicates and no reminder that pretends to be active: without permission the preference falls back to off. Not offered on web. |
| Language | Dutch default; `LocalizedContent<T>` = `{ nl: T, en?: T }`, resolved only by `localize()` | English can be added by adding `en` text; screens need no change. |
| Lesson length | One complete version per lesson (3–5 min, computed from the text), not separate 2/5/10-minute versions | Shortening would cut essential context. The time preference shows a pace hint and progress is saved per step, so a lesson can be spread over moments. |
| Builds | Expo Go for quick runs; `expo-dev-client` and `eas.json` profiles for beta builds | Identifiers: `com.moralfuel.app` on iOS and Android (chosen by the owner; permanent once published). |
| Progress | Lessons can be opened in any order, any day; no streaks | Never block learning because a day was missed. |
| Branding | Dark-only theme (charcoal, white, one ember accent), Tomorrow headings, Poppins text, SVG logotype, branded loader; rules in `styling/STYLE_GUIDE.md` | Set by the designer (owner). The mockups' content (streaks, chat, accounts) is not adopted; only their style. |
| Completion | A learning event in the app only | Never requires prayer or writing; never claims spiritual improvement. |

## Content and theology rules (binding)

- Broadly Christian and non-denominational, but not doctrinally empty. Where traditions differ materially, add a short neutral `traditionNote`.
- Every lesson gives an exact passage reference and keeps three things apart: what the text says (`passageSummary`, an original summary), the explanation, and the application.
- Lesson prose never quotes a Bible translation: summaries are original prose, never in quotation marks, and `source.bibleText` is `'summary-only'` (the validator enforces it). The Bible text itself appears only in the Bible reader, imported from the publisher (see below).
- Never imply that actions earn God's love or salvation, never speak with divine authority, never suggest forgiveness means tolerating abuse, and never suggest faith replaces professional care. Topics touching abuse, grief or mental health carry a `careNote` with Dutch help lines (Veilig Thuis 0800-2000, 113 Zelfmoordpreventie 113 / 0800-0113, 112).
- All new content is `EDITORIAL_DRAFT`. Only a qualified human reviewer may set `APPROVED`, with `reviewedBy` and `reviewedOn`; the validator rejects APPROVED without them. The app labels the content as beta and never as approved.
- All 30 days have a written lesson. A future day can still be added as `PLANNED` (title, summary, objective, topics only); it appears as *Binnenkort* and never opens.
- Every lesson has a `context` (setting of the passage); reading time is computed by `estimateReadingMinutes` and must match `readingMinutes`.
- Review with `CONTENT_REVIEW_CHECKLIST.md`.

## Moral Fuel — Bible Content Authorization

- The project owner has confirmed written permission from the Nederlands-Vlaams Bijbelgenootschap to use the original Bijbel in Gewone Taal (BGT) text in Moral Fuel. Treat content-use authorization as confirmed; do not ask the owner to reconfirm it.
- The official publisher website, debijbel.nl, is the preferred reference source for authentic BGT text (chapter pages such as `https://www.debijbel.nl/bijbel/BGT/JAS.1`).
- All Bible quotations must match the authentic BGT wording exactly. Never fabricate, paraphrase or silently replace Bible quotations and label them BGT, and never substitute another translation.
- Always preserve the translation attribution: Bijbel in Gewone Taal, © Nederlands-Vlaams Bijbelgenootschap 2014.
- Maintain the reusable import and verification pipeline (`npm run bible:import`, `bible:validate`, `bible:coverage`; see `BGT_INTEGRATION.md`).
- Respect technical website access restrictions: never bypass logins, CAPTCHAs or bot blocks, and use no undocumented private endpoints. debijbel.nl blocks automated requests (403), so chapters are imported from pages the owner saves in a browser; do not wait for a publisher data export.
- Keep this section for future sessions and phases. Do not include the private permission letter in the repository.

## Architecture

```
src/
  app/                 routes only (thin): _layout (fonts, providers, Stack.Protected onboarding guard),
                       onboarding, (tabs)/{index,journey,explore,journal,you}, lesson/[id], journal/[id]
  features/<feature>/  feature components and pure logic: onboarding, today, journey, explore, journal,
                       you, lesson, progress, preferences, reminders
  content/             typed content: lessons/day-0N.ts, journey.ts, taxonomy.ts, review.ts,
                       index.ts (the content API), validate.ts (integrity checks)
  models/              content.ts and user.ts: every typed model
  state/               app-state.tsx (provider, useAppState, useStrings), app-state-reducer.ts,
                       journal.tsx (JournalProvider, useJournal)
  storage/             app-state-codec.ts (pure, migrations), app-state-storage.ts (AsyncStorage),
                       crypto.ts, journal-store.ts / .web.ts, legacy-reflections.ts / .web.ts
  i18n/                nl.ts (all UI text), strings.ts, localize.ts
  theme/               tokens.ts (palette, semantic light/dark colours, spacing, type), use-theme.ts
  ui/                  primitives: AppText, Icon, Logo, Wordmark, Button, Screen, Card, OptionRow, Chip,
                       ProgressBar, Badge, FadeIn/useReduceMotion, confirm
  features/launch/     the branded loader shown after the native splash
  content/media.ts     the photo library (assets/images/media) with alt text
styling/               STYLE_GUIDE.md and the designer's reference mockups
```

Funnels — every read or write of one kind goes through its owner:

- Content: `src/content/index.ts` (`getDayViews`, `getLesson`, `getLessonText`, `formatReference`, `topicLabel`). Screens never import lesson files directly.
- Localized text: `localize()`; UI text: `useStrings()`. No paragraphs hard-coded in components.
- App state: `useAppState().actions`; the provider alone saves to storage and schedules reminders (`syncReminder`).
- Journal and reflections: `useJournal().actions`; `JournalProvider` alone writes `journal-store`.
- Colours and fonts: `useTheme()` semantic tokens and `fonts` from `tokens.ts`; no raw hex or `fontWeight` in screens.
- Photos: `MEDIA` in `src/content/media.ts`; no direct `require` of an image in a screen.

## Widgets (iOS)

- Built with expo-widgets: layouts in `src/widgets/*.tsx` (the `'widget'` directive: no imports, hooks or
  module-scope values inside), data from `buildWidgetBundle` in `src/features/widgets/widget-data.ts`,
  published only by `useWidgetSync` through `publish.ios.ts` (no-op elsewhere).
- Never put journal, reflection or other private text into widget props, and never `null` (the native
  bridge throws); an empty value is an absent key.
- Inspirations are original paraphrases labelled *In eigen woorden*; a literal quotation needs a named
  translation and license. Details in `WIDGET_ARCHITECTURE.md`.

## iPhone builds

- `MORAL_FUEL_WIDGETS=off` (read by `app.config.ts`) builds without the widget extension, for free Apple
  IDs only; never use it for EAS or store builds. Widget publishing checks for the native module.
- EAS preview builds sign the app and `ExpoWidgetsTarget` with the App Group (expo-widgets' EAS config).
  Steps in `IPHONE_INSTALL_GUIDE.md`; problems in `BUILD_TROUBLESHOOTING.md`.

## Scripts

```bash
npm start            # Metro for a development build
npm run start:go     # Metro for Expo Go (press i / a / w)
npm run ios|android  # local native build and run (expo run)
npm run web
npm test             # Jest (jest-expo preset)
npm run typecheck    # tsc --noEmit
npm run lint         # expo lint (ESLint 9, eslint-config-expo)
npm run doctor       # expo-doctor
npm run bible:import # BGT chapter pages in bible-sources/bgt -> src/content/bible/bgt.json + reports
npm run bible:validate  # re-check the bundled BGT text against its pages; exit 1 on problems
npm run bible:coverage  # which lesson references can show their text
```

The BGT pipeline, the page structure it relies on and how to add chapters are in `BGT_INTEGRATION.md`.
Never edit `src/content/bible/bgt.json` by hand; it is written only by `bible:import` and `bible:validate`.

Run `npm run typecheck`, `npm run lint` and `npm test` before declaring work done.

## Contributor guidance

- Keep route files thin and files small; extend an existing primitive or function before adding a second one.
- Accessibility: touch targets ≥ 44 pt, roles, labels and states on every control, text that scales with the system font, no meaning by colour alone, reduced motion respected (`FadeIn`, `useReduceMotion`).
- Design: follow `styling/STYLE_GUIDE.md`. Dark charcoal canvas, white type, a single ember accent used sparingly, Tomorrow for headings and Poppins for text, black-and-white photography. No streak pressure, gimmicks, crosses or dramatic religious imagery.
- Content changes: edit `src/content`, then run the tests — `validate.test.ts` fails on any integrity problem.
- Later CMS: replace the static imports in `src/content/index.ts` with a loader that returns the same `Lesson` and `Journey` types and runs `validateContent` on what it receives.
- No secrets, credentials or `.env` are needed or allowed in Phase 1.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. Before touching an Expo, EAS or React Native API, read the
major version of `expo` in `package.json` and fetch the matching docs
(`https://docs.expo.dev/versions/v58.0.0/`), or https://docs.expo.dev/llms.txt.

- Install packages with `npx expo install <package>` (SDK-compatible versions); `npx expo install --fix` repairs them.
- Use Expo Router for all navigation; only screens live in `src/app`.
- `ios/` and `android/` are generated (Continuous Native Generation): configure native behaviour in `app.json` and config plugins, never by hand.
- Expo Go contains only its bundled native modules; a library with other native code needs a development build (`npx expo run:ios|android` or `eas build --profile development`).
- Build and submit with EAS (`npx eas-cli@latest build`); see https://docs.expo.dev/eas/index.md.
