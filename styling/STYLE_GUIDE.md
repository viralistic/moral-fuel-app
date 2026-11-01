# Moral Fuel style guide

This is the reference for every new screen, component and widget. It distils the designer's mockups in
`styling/reference/` into rules. The code that implements them lives in `src/theme/tokens.ts` (colours,
type, spacing) and `src/ui/` (primitives). Use those; never restate a value in a screen.

## How to read the reference designs

The mockups show the **style**, not the app's content. Their text, photos, features and ordering (a
streak counter, a chat, a profile with an account, "Morning prayer" cards) are placeholders from the
designer and are not part of Moral Fuel. When a design and the app differ in content (text, images,
meaning, order of elements), keep the app's content and apply only the style principles below.

| File | Screens | Taken 1:1? |
| --- | --- | --- |
| `reference/loader.png` | Loader at start and end of loading | Yes: `src/features/launch/launch-screen.tsx` |
| `reference/main-chat.png` | Home ("Main") and a chat session | Style only |
| `reference/streaks-settings.png` | A streak calendar and a settings sheet | Style only (no streaks in this app) |

## Principles

1. **Dark, quiet canvas.** One charcoal background, white type, no gradients. The app is dark-only;
   it ignores the system light mode.
2. **Ember is rare.** The orange accent marks one focal point: the active tab, a selected option, the
   recommended lesson, a quote rule. Never fill large areas with it, and do not stack several orange
   elements in one row.
3. **Display type for titles, Poppins for everything else.** Big, confident headings; light, airy
   supporting text in grey.
4. **Outlined shapes.** Pills, circles and cards with thin borders on a dark field; white fills only for
   the main action and for progress.
5. **Calm, not gamified.** No streaks, badges for effort, counters that create pressure, or dramatic
   religious imagery, even where the mockups show them.

## Colour

All colours are semantic tokens in `src/theme/tokens.ts`; read them with `useTheme().colors`.

| Token | Hex | Use |
| --- | --- | --- |
| `background` | `#1F1E1F` | Page canvas |
| `surface` | `#262526` | Cards, grouped rows, tab bar |
| `surfaceRaised` | `#2C2B2C` | The one featured card (`Card tone="feature"`) |
| `surfaceMuted` / `selected` | `#333233` | Pressed rows, icon wells, selected option |
| `border` | `#3A393A` | Card edges, dividers (decorative) |
| `borderStrong` | `#6E6C6E` | Control outlines: inputs, outline buttons, chips, progress tracks |
| `text` | `#FFFFFF` | Primary text |
| `textMuted` | `#A3A1A3` | Secondary text, descriptions, inactive icons |
| `primary` / `onPrimary` | `#F5F3F5` / `#1F1E1F` | Filled main button, done markers, progress fill |
| `accent` | `#E2572B` | Ember: dots, rules, selected outlines, accent icons |
| `accentText` | `#EE7748` | Ember for text (overline labels, links) |
| `accentSoft` | `#3A2520` | Faint ember wash behind an accent icon |
| `watermark` | `#171617` | Giant logotype watermark |
| `danger` | `#F28B7B` | Destructive actions, errors |

Contrast on the canvas: `text` 17:1, `textMuted` 6.5:1, `accentText` 5.8:1, `accent` 4.4:1 (icons and
shapes only), `borderStrong` 3:1. White text on ember is only 3.7:1, so never put body or button
text on an ember fill.

## Typography

| Variant | Font | Size / line | Use |
| --- | --- | --- | --- |
| `display` | Tomorrow SemiBold, +0.6 tracking | 34 / 40 | Screen titles, greeting |
| `title` | Tomorrow SemiBold, +0.4 | 26 / 32 | Lesson and card titles |
| `heading` | Tomorrow SemiBold, +0.3 | 20 / 26 | Section and row titles |
| `body` | Poppins Regular | 16 / 25 | Reading text |
| `bodyStrong` | Poppins Medium | 16 / 25 | Button labels, emphasis |
| `small` | Poppins Light | 14 / 21 | Descriptions under titles (usually `muted`) |
| `caption` | Poppins Regular | 13 / 18 | Meta lines, references |
| `overline` | Poppins Medium, uppercase, +1.6 | 12 / 16 | Section labels |
| `quote` | Poppins Light Italic | 18 / 28 | Core thought, prayer |
| `scripture` | Poppins Regular | 17 / 29 | Bible reader |

- Pick a weight by font family (`fonts.medium`, `fonts.semibold`), never with `fontWeight`: Android
  ignores weights on custom fonts.
- Tomorrow is the open-licence stand-in for the mockups' heading face (same squared forms and u-shaped
  "y"), with full Dutch accents. The supplied *Rushblade Demo* font is personal-use only and lacks
  digits, accents and punctuation, so it is not bundled; the logotype is an SVG instead.

## Logo and watermark

- `src/ui/logo.tsx` draws `assets/brand/moral-fuel-logo.svg`. Use `<Wordmark />` as a page header,
  `<Logo width color decorative />` elsewhere. Never type the brand name in a display font as a logo.
- Watermark: the logotype at about 1.4x the screen width, in `watermark`, bleeding off the left and
  right edges near the bottom. Use it only on quiet full screens (the loader); never behind reading text.
- The native splash (`assets/images/splash-logo.png`, 220 pt wide) matches the loader's centred logo.

## Components

- **Buttons** (`Button`): pill, min height 52. `primary` is a white fill with dark text, one per view;
  `secondary` is a `borderStrong` outline; `ghost` is text only.
- **Cards** (`Card`): radius 14, 1 px `border`. `feature` (raised) for the screen's main card, `surface`
  for lists, `muted` for quiet panels, `outline` for grouping without fill.
- **Options** (`OptionRow`): card row; selected = `selected` fill, ember outline and ember check.
- **Chips and pills**: unselected = transparent with `borderStrong` outline; selected = white fill with
  dark text (as the "1/3 Done" pill).
- **Badges** (`Badge`): `done` light-grey pill, `active` ember outline (one per row at most), `neutral`
  dark fill, `soon` grey outline.
- **Progress** (`ProgressBar`): an outlined pill with a white fill inset by 2 pt, as in the loader.
- **Inputs** (`SearchField`, text fields): transparent pill with a `borderStrong` outline; ember outline
  on focus.
- **Tab bar**: a floating rounded bar on `surface` with thin vertical dividers between items, outline
  icons in `textMuted`, and the open tab in white with a small ember dot on its icon. Keep the labels.
- **Icon wells**: 44 pt circles on `surfaceMuted` holding an outline icon or a numeral.
- **Big numbers** (like the mockup's stat circles): Tomorrow in white inside a thin outlined circle.

## Layout and spacing

- Spacing scale: 4, 8, 12, 16, 24, 32, 48 (`spacing.xxs` to `spacing.xxl`). Page gutters 24.
- Generous vertical air between sections (24 to 32); tight 2 to 8 between a title and its description.
- Left-aligned text; centre only the loader and empty states.
- Readable column max 640 on tablets and the web.

## Imagery

- Photography is **black and white only**, high-contrast, with real people and hands; no crosses or
  dramatic religious imagery.
- Library: `src/content/media.ts` (photos in `assets/images/media/`). Every image carries Dutch alt text;
  screens use the registry, never a direct `require`.
- Frame photos in a card with radius 14, or a tall rounded "arch" crop as in the mockups. Never put text
  on a photo without a solid backing.
- Only add a photo where it supports the app's content; the mockups' photo slots are not content.

## Motion

- Short and calm: fades and the loader's bar (about 0.7 s warm-up, then a 0.25 s finish).
- Always respect reduced motion (`useReduceMotion`, or `useReducedMotion` before app state exists).

## Accessibility (non-negotiable)

- Touch targets at least 44 pt; roles, labels and states on every control.
- Never meaning by colour alone: the ember dot is paired with a label weight change, the selected
  option with a check icon.
- Text scales with the system font (display variants are capped in `AppText`).
