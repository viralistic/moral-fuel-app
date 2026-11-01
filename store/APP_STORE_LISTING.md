# App Store Connect: Moral Fuel

Ready-to-paste texts and answers for App Store Connect (language: Dutch). Character limits are Apple's;
`npm run` has no check for them, so recount after editing. Fill in the items marked **TODO** first.

## Before you submit

- [ ] Build from the copy with the real BGT text in `src/content/bible/bgt.json` (this public repo has
      placeholders).
- [ ] The app shows a beta notice because the lessons are unreviewed drafts. Apple does not accept beta
      versions in the App Store (guideline 2.2): release through **TestFlight** first, or have the lessons
      reviewed (see `CONTENT_REVIEW_CHECKLIST.md`) before App Store review.
- [ ] Put the support and privacy pages online (GitHub Pages, below).
- [ ] Have the NBG permission letter ready: App Review may ask for proof of the right to use the BGT
      (guideline 5.2). Do not put it in the repository.

## App information

| Field | Value |
| --- | --- |
| Name (max 30) | `Moral Fuel` |
| Subtitle (max 30) | `Leer, overdenk en leef geloof` |
| Bundle ID | `com.moralfuel.app` |
| SKU | `moralfuel-ios` |
| Primary category | Lifestyle |
| Secondary category | Education |
| Price | Free (Gratis), all countries or only Netherlands and Belgium |
| Support URL | `https://viralistic.github.io/moral-fuel-app/support.html` |
| Privacy policy URL | `https://viralistic.github.io/moral-fuel-app/privacy.html` |
| Marketing URL (optional) | `https://viralistic.github.io/moral-fuel-app/` |
| Copyright | `2026 Viralistic` |

The URLs work once GitHub Pages is on: repository **Settings > Pages > Deploy from a branch**, branch `main`,
folder `/docs`.

## Promotional text (max 170)

```
Elke dag een korte les over het christelijk geloof: wat de Bijbel zegt, wat het betekent en hoe je het vandaag toepast. In je eigen tempo, zonder account.
```

## Description (max 4000)

```
Moral Fuel is een rustige plek om het christelijk geloof te leren kennen. Elke dag een korte les van een paar minuten: wat de Bijbel zegt, wat het betekent, en hoe je het vandaag kunt toepassen. Ook als je (nog) niet gelooft, ben je welkom.

LEER. OVERDENK. LEEF.
Elke les heeft drie stappen:
• Leer: een Bijbelgedeelte, de kern ervan en een heldere uitleg met een voorbeeld uit het dagelijks leven.
• Overdenk: een eerlijke vraag om over na te denken, met ruimte voor je eigen antwoord.
• Leef: één concrete stap voor vandaag.

DERTIG LESSEN, IN JE EIGEN TEMPO
Een reis van dertig dagen in vier delen: van wie God is en wie Jezus is tot gebed, vergeving, geduld en geloof in je relaties. Je kunt elke les openen wanneer je wilt. Een gemiste dag maakt niets uit: er zijn geen reeksen en geen druk.

DE BIJBEL ERBIJ
Lees het Bijbelgedeelte van de les in de Bijbel in Gewone Taal, ook zonder internet.

JE EIGEN DAGBOEK
Schrijf je gedachten en overdenkingen op. Je dagboek wordt versleuteld en blijft alleen op je iPhone.

RUSTIGE HERINNERING EN WIDGETS
Kies een tijdstip voor één dagelijkse herinnering. Zet een widget op je beginscherm met de inspiratie van de dag, je voortgang of je stap voor vandaag.

PRIVÉ
Geen account, geen advertenties en geen gegevensverzameling. Alles staat alleen op je eigen iPhone.

Heb je het zwaar? Deze app vervangt geen professionele hulp. Bel 113 Zelfmoordpreventie (113 of 0800-0113), Veilig Thuis (0800-2000) of bij direct gevaar 112.

Bijbel in Gewone Taal, © Nederlands-Vlaams Bijbelgenootschap 2014. Gebruikt met toestemming.
```

## Keywords (max 100, comma separated, no spaces)

```
geloof,bijbel,christelijk,christendom,jezus,god,gebed,dagboek,bijbelstudie,overdenking,leren,rust
```

## What's New (version 1.0)

```
De eerste versie van Moral Fuel: dertig lessen, een versleuteld dagboek, herinneringen en widgets.
```

## App Privacy

- Data collection: **Data Not Collected** (no data leaves the device; no analytics, ads or tracking).
- Tracking: **No**.

## Age rating

Answer **None** to every content question. Expected result: **4+**. The lessons touch on grief, abuse and
mental health only to point to professional help; if you prefer a stricter rating, answer "Infrequent/Mild"
for "Mature/Suggestive Themes".

## Export compliance (encryption)

`app.json` sets `ios.config.usesNonExemptEncryption: false`, so App Store Connect does not ask the question
for each build. Reason: the app encrypts only the user's own journal on the device, with a standard
algorithm, and encryption is not its main function (exempt under US EAR Category 5 Part 2, Note 4). This is
your legal declaration as the publisher: if you are unsure, remove the key and answer the question in App
Store Connect yourself.

## App Review information

- Sign-in required: **No**.
- Contact: TODO your name and phone number; e-mail `info@viralistic.nl`.
- Notes:

```
No account or sign-in is needed. Onboarding takes five steps (each can be skipped). Lessons open from the "Vandaag" and "Reis" tabs; the Bible passage opens from a lesson or with "Lees Bijbelgedeelte". The app stores everything on the device and makes no network requests. Bible text: Bijbel in Gewone Taal, © Nederlands-Vlaams Bijbelgenootschap 2014, used with the publisher's written permission (available on request). Lesson texts are original summaries and do not quote the Bible.
```

## TestFlight (external testing)

Beta App Description:

```
Moral Fuel helpt je het christelijk geloof te leren kennen met korte dagelijkse lessen. De lessen zijn nog concepten die worden nagekeken. Laat ons weten wat onduidelijk is of beter kan.
```

What to Test:

```
Doorloop de introductie en een paar lessen. Probeer het dagboek, een herinnering en een widget. Let op teksten die onduidelijk zijn en op alles wat niet werkt zoals je verwacht.
```

Feedback e-mail: `info@viralistic.nl`

## Screenshots

Required: iPhone 6.9" (1320 × 2868 px), 3 to 10 images. iPad screenshots are not needed: the app is
iPhone-only (`supportsTablet: false`). Take them on an iPhone 16 or 17 Pro Max simulator from the production
build, with the dark theme as designed. Suggested order: Vandaag, a lesson (Leer), Overdenk, Reis, Dagboek,
a widget on the home screen.
