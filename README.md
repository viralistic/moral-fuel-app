# MORAL FUEL

**Learn. Reflect. Live.** — a calm, offline-first mobile app that helps people who are new to
Christianity (and the simply curious) apply Christian teaching in everyday life, a few minutes a day.

Phase 2 is an installable beta candidate built with Expo SDK 58 and Expo Router: a complete 30-day
journey, an encrypted personal journal and daily reminders. Dutch is the interface and content
language; the architecture is ready for English. See `PHASE2_IMPLEMENTATION.md` for what changed and
`MOBILE_TESTING_GUIDE.md` for running it on phones.

> **About this public repository.** This is the public source of Moral Fuel, published as a
> showcase. The app bundles the Bijbel in Gewone Taal (© Nederlands-Vlaams Bijbelgenootschap 2014)
> with the publisher's permission for use in the app; that text is not redistributed here.
> `src/content/bible/bgt.json` keeps the full structure (books, chapters, verse numbers, source
> URLs and checksums), but every verse and heading is replaced by a placeholder. The app and the
> tests run as-is; the reader shows the placeholder instead of the Bible text.

## Run it

Requirements: Node 20 or newer (tested with Node 24.15) and npm. For a device: the Expo Go app (SDK 58),
or Xcode / Android Studio for simulators.

```bash
cd moral-fuel
npm install
npm run start:go   # Expo Go: press i (iOS simulator), a (Android emulator) or w (web), or scan the QR code
npm start          # for a development build (see MOBILE_TESTING_GUIDE.md)
```

Other scripts:

```bash
npm test           # unit and integration tests (Jest, jest-expo)
npm run typecheck  # TypeScript
npm run lint       # ESLint via expo lint
npm run doctor     # expo-doctor health checks
```

No accounts, keys or `.env` file are needed.

## What is in the app

- **Onboarding** (first launch, five steps): welcome and promise, a main interest (skippable), daily time
  of 2, 5 or 10 minutes (skippable), an optional daily reminder, and a personal starting point. Stored on
  the device and survives restarts; it can be redone from *Jij*.
- **Vandaag (Today)**: greeting by time of day, current journey day, the lesson to start or resume, the
  thought and the concrete action of that lesson, real progress, lessons matching your interest, and
  entries to Journey and Explore. Everything is derived from the actual content and your progress.
- **Lessons**: full-screen, three steps — *Leer* (passage reference, the core idea, what the text says,
  explanation, everyday example, tradition and care notes), *Overdenk* (a question with an optional
  private answer) and *Leef* (one action and an optional prayer) — with back and forward, a step
  indicator, resume where you left off, and a completion screen. Writing and prayer are never required.
- **Reis (Journey)**: all 30 written lessons in four chapters, each with its own progress, and the
  recommended next lesson marked. Any lesson can be opened at any time; nothing is locked by the calendar.
- **Dagboek (Journal)**: private notes and lesson reflections, encrypted on the device, browsable by
  date, searchable, editable and deletable, with a plain-text export through the share sheet.
- **Ontdekken (Explore)**: search (accent-insensitive) over titles, summaries, objectives, topics and
  Bible references, topic filters and an *available only* filter, with honest availability.
- **Jij (You)**: interest and time per day (editable), completed lessons and journey progress, the daily
  reminder (suggested or custom time), reduce motion, text size note, language readiness, privacy and
  content information, redo onboarding, and erase all local data (with confirmation).

- **Widgets (iOS)**: five native WidgetKit widgets (daily inspiration, journey progress, today's
  action, dashboard, Lock Screen) fed by the app's real progress, with a 30-day timeline so the daily
  inspiration rotates with the app closed. A gallery under *Jij → Widgets* explains them, shows labelled
  previews and holds the Lock Screen privacy switch. Needs a development or store build, not Expo Go. See
  `WIDGET_IMPLEMENTATION.md`, `WIDGET_ARCHITECTURE.md` and `WIDGET_TESTING.md`.

- **On your iPhone**: see `IPHONE_INSTALL_GUIDE.md` (free Apple ID without widgets, or the paid
  route with widgets), `IPHONE_WIDGET_TEST_GUIDE.md` and `BUILD_TROUBLESHOOTING.md`.

## Privacy and storage

Everything stays on the device. Preferences and progress are one JSON record in AsyncStorage, migrated
safely between versions. The journal (including lesson reflections) is one file encrypted with
XChaCha20-Poly1305; its random key lives in the device's secure storage (iOS Keychain, Android
Keystore). On the web the journal is kept only while the tab is open, and the app says so. *Alle
gegevens wissen* removes the record, the journal and its key, and any scheduled reminder. Corrupt
stored data is detected and the app starts fresh instead of crashing.

## Content and theological review

The seven lessons are original Dutch prose written as **editorial drafts** (`EDITORIAL_DRAFT`). They
have not yet been reviewed by a qualified theological reviewer, and the app shows a beta notice.
Bible passages are referenced exactly and summarised in our own words. The full passages can be read
in the app in the Bijbel in Gewone Taal (© Nederlands-Vlaams Bijbelgenootschap 2014, used with the
publisher's permission), imported from debijbel.nl and bundled for offline reading; see
`BGT_INTEGRATION.md`.
Explanations are kept apart from what the text says and from the suggested application, and where
Christian traditions differ materially a short neutral note says so. Topics touching abuse, grief or
mental health point to professional help.

Before release, a qualified reviewer should check every lesson and set its review status to `APPROVED`
with name and date (see `src/content/review.ts`). See `AGENTS.md` for the content rules.

## Design

Dark and quiet: a charcoal canvas, white type and a single ember accent, the MoralFuel logotype, Tomorrow
for headings and Poppins for text, and black-and-white photography. A branded loader follows the splash.
Safe areas, large touch targets, screen-reader labels, scaling text and reduced-motion support. No
streaks. The rules and the designer's mockups are in `styling/`.

## Manual test paths

1. Fresh install → onboarding: skip interest and time, choose no reminder → Today shows day 1.
2. Kill and reopen the app → onboarding is not shown again.
3. Open lesson 1, go to *Overdenk*, write an answer, close the lesson → Today says *Verder waar je was*;
   reopen → same step and the answer is still there (native).
4. Finish a few lessons (with and without writing) → Journey shows each as *Afgerond*, the chapter
   progress moves and the next lesson is marked *Aanbevolen*.
5. *Dagboek* → *Nieuwe notitie*, write, *Klaar* → the note is listed by date; search finds it; open it,
   edit, delete. A lesson reflection appears under its lesson.
6. Explore: search `vergeving`, `Lucas`, `korintiers`; filter by topic; toggle *Alleen beschikbaar*;
   search nonsense → empty state with reset.
7. *Jij* → change interest and time; choose *Eigen tijdstip* a few minutes ahead (permission prompt,
   then the notification arrives); toggle reduce motion.
8. *Jij* → *Introductie opnieuw doen* → onboarding returns, progress kept.
9. *Jij* → *Alle gegevens wissen* → confirm → onboarding returns; progress, journal and reminder gone.
10. Switch the device to dark mode and to the largest text size; walk through all tabs and a lesson.

## Verification status

- `npm test` (211 tests), `npm run typecheck`, `npm run lint` and `expo-doctor` (20/20) pass; the web and
  iOS bundles build; `expo prebuild` succeeds for iOS and Android.
- Run natively in Expo Go on an iPhone 17 Pro simulator (iOS 26.5): onboarding, lessons, journal,
  restart persistence, on-disk encryption, a delivered reminder notification and erase-all. Details and
  the bugs this found are in `MOBILE_TESTING_GUIDE.md`.
- **Not yet verified:** Android, physical devices, VoiceOver and TalkBack, development builds.

## Known limitations

- All 30 lessons are unreviewed editorial drafts (see `CONTENT_REVIEW_CHECKLIST.md`).
- English interface and content are prepared in the types but not written.
- One lesson length for all time preferences (see AGENTS.md).
- Reminders are not available on the web; the journal is not saved on the web.
- An Expo account (and Apple Developer membership for iPhones) is still needed for EAS development builds.
- App Store release: see `store/APP_STORE_LISTING.md` (texts, privacy answers and the checklist before submitting).
