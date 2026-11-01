#!/bin/bash
# Moral Fuel publiceren: een begeleide terminal-wizard voor de eigenaar op een Mac.
# Start met:  npm run publiceer
#
#   1. Bijbeltekst  - zet de echte BGT-tekst in de app (uit een oude projectmap, of door de
#                     hoofdstukken zelf op te slaan in je browser), en houdt die buiten git.
#   2. Controles    - typecheck, lint en tests.
#   3. Expo         - inloggen en het project koppelen.
#   4. Bouwen       - EAS bouwt de iPhone-app en zet hem in TestFlight.
#
# Geschreven voor de standaard bash 3.2 van macOS.

set -u
cd "$(dirname "$0")/.." || exit 1

BGT="src/content/bible/bgt.json"
SAVED_DIR="bible-sources/bgt"
PLACEHOLDER="BGT-tekst niet opgenomen in de openbare broncode."
EAS="npx --yes eas-cli@latest"

bold=$(tput bold 2>/dev/null || true)
dim=$(tput dim 2>/dev/null || true)
reset=$(tput sgr0 2>/dev/null || true)

title() { printf '\n%s━━ %s%s\n\n' "$bold" "$1" "$reset"; }
say() { printf '%s\n' "$1"; }
ok() { printf '  ✓ %s\n' "$1"; }
fail() { printf '\n  ✗ %s\n\n' "$1"; exit 1; }
ask_yes() { # vraag "tekst" -> 0 bij ja
  local answer
  printf '%s [j/n] ' "$1"
  read -r answer
  case "$answer" in [jJyY]*) return 0 ;; *) return 1 ;; esac
}
pause() { printf '%s' "${1:-Druk op Enter om verder te gaan.} "; read -r _; }

# Every chapter the lessons need that the app does not yet hold as real text, as "KEY URL" lines.
missing_chapters() {
  node -e '
    const fs = require("fs");
    const [bgtPath, marker] = process.argv.slice(1);
    let have = new Set();
    try {
      for (const c of JSON.parse(fs.readFileSync(bgtPath, "utf8")).chapters)
        if (!JSON.stringify(c.blocks).includes(marker)) have.add(c.book + "." + c.chapter);
    } catch {}
    for (const c of require("./BGT_REFERENCE_MANIFEST.json").chapters)
      if (!have.has(c.book + "." + c.chapter)) console.log(c.book + "." + c.chapter + " " + c.url);
  ' "$BGT" "$PLACEHOLDER"
}

# Houd de echte tekst buiten git: de repository is openbaar.
protect_bgt() {
  git update-index --skip-worktree "$BGT" 2>/dev/null && ok "De Bijbeltekst blijft op je Mac: git negeert dit bestand."
}

# ---------------------------------------------------------------------------------------------

clear 2>/dev/null || true
printf '%sMORAL FUEL · publiceren%s\n' "$bold" "$reset"
say "Deze wizard zet de app klaar voor TestFlight. Je kunt altijd stoppen met Ctrl+C"
say "en later opnieuw beginnen: wat al klaar is, wordt overgeslagen."

command -v node >/dev/null 2>&1 || fail "Node.js ontbreekt. Installeer het van https://nodejs.org (LTS) en start opnieuw."
command -v git >/dev/null 2>&1 || fail "git ontbreekt. Typ 'xcode-select --install' en start opnieuw."
if [ ! -d node_modules ]; then
  say "Eerst de onderdelen van de app installeren (eenmalig, duurt even)..."
  npm install || fail "npm install mislukte."
fi

# 1. Bijbeltekst ------------------------------------------------------------------------------
title "Stap 1 van 4 · Bijbeltekst"

say "Bezig met controleren..."
total=$(node -p "require('./BGT_REFERENCE_MANIFEST.json').chapters.length")

if [ "$(missing_chapters | wc -l | tr -d ' ')" = "0" ]; then
  ok "De echte Bijbeltekst staat al in de app."
  protect_bgt
else
  say "De app mist nog (een deel van) de Bijbel in Gewone Taal."
  echo
  if ask_yes "Heb je nog een oude Moral Fuel-projectmap met de echte tekst?"; then
    say "Sleep die oude projectmap nu in dit venster en druk op Enter:"
    read -r old
    old=$(printf '%s' "$old" | sed -e "s/^[\"']//" -e "s/[\"']$//" -e 's/\\ / /g' -e 's/[[:space:]]*$//')
    src="$old/$BGT"
    if [ -f "$src" ] && ! grep -q "$PLACEHOLDER" "$src"; then
      cp "$src" "$BGT" && ok "Bijbeltekst overgenomen uit je oude projectmap."
      protect_bgt
    else
      say "  In die map staat geen bruikbare Bijbeltekst. We gaan verder met opslaan."
    fi
  fi

  todo=$(missing_chapters | wc -l | tr -d ' ')
  if [ "$todo" != "0" ]; then
    mkdir -p "$SAVED_DIR"
    browser_app=""
    [ -d "/Applications/Google Chrome.app" ] && browser_app="Google Chrome"

    echo
    say "${bold}Hoofdstukken opslaan${reset}: nog $todo van de $total te gaan."
    say "Ik open steeds één hoofdstuk op debijbel.nl. Jij slaat het op:"
    say "  1. Druk in de browser op ⌘S."
    say "  2. Kies bij Opmaak: 'Webpagina, volledig' (Safari: 'Paginabron')."
    say "  3. Bewaar in de map die ik nu in de Finder open: ${bold}$SAVED_DIR${reset}"
    say "     (de browser onthoudt die map daarna)."
    say "  4. Kom terug naar dit venster en druk op Enter."
    say "${dim}Typ 'q' + Enter om te pauzeren; je gaat later verder waar je was.${reset}"
    open "$SAVED_DIR"
    pause "Klaar om te beginnen? Druk op Enter."

    i=0
    stopped=no
    while IFS= read -r line; do
      i=$((i + 1))
      key=${line%% *}
      url=${line#* }
      if [ -n "$browser_app" ]; then open -a "$browser_app" "$url"; else open "$url"; fi
      printf '  [%s/%s] %s  opslaan met ⌘S, dan Enter: ' "$i" "$todo" "$key"
      read -r answer < /dev/tty
      case "$answer" in q|Q) stopped=yes; break ;; esac
    done < <(missing_chapters)

    echo
    say "Opgeslagen hoofdstukken omzetten naar de app..."
    npm run --silent bible:import >/dev/null 2>&1
    protect_bgt
    # The import also refreshes the public reports; they hold no Bible text, so keep the repository's copy.
    git checkout -- BGT_IMPORT_REPORT.md BGT_VERIFICATION_REPORT.md BGT_CONTENT_COVERAGE.md 2>/dev/null || true

    left=$(missing_chapters | wc -l | tr -d ' ')
    if [ "$left" != "0" ]; then
      [ "$stopped" = yes ] && say "Gepauzeerd." || say "Deze hoofdstukken zijn nog niet (goed) opgeslagen:"
      [ "$stopped" = yes ] || missing_chapters | sed 's/^/    /'
      say "Nog $left van de $total te gaan. Start opnieuw met 'npm run publiceer' om verder te gaan."
      exit 0
    fi
  fi

  npm run --silent bible:validate >/dev/null 2>&1 || fail "De controle van de Bijbeltekst vond problemen. Stuur BGT_VERIFICATION_REPORT.md naar Claude."
  git checkout -- BGT_VERIFICATION_REPORT.md 2>/dev/null || true
  [ "$(missing_chapters | wc -l | tr -d ' ')" = "0" ] || fail "Er ontbreken nog hoofdstukken. Start de wizard opnieuw."
  ok "De echte Bijbeltekst staat in de app (alle $total hoofdstukken)."
fi

# 2. Controles --------------------------------------------------------------------------------
title "Stap 2 van 4 · Controles"
if ask_yes "De app eerst controleren (typecheck, lint en tests, ongeveer een minuut)?"; then
  npm run --silent typecheck || fail "Typecheck faalt. Stuur de foutmelding naar Claude."
  npm run --silent lint || fail "Lint faalt. Stuur de foutmelding naar Claude."
  npm test --silent || fail "Tests falen. Stuur de foutmelding naar Claude."
  ok "Alles in orde."
fi

# 3. Expo -------------------------------------------------------------------------------------
title "Stap 3 van 4 · Expo-account"
if $EAS whoami >/dev/null 2>&1; then
  ok "Ingelogd bij Expo als $($EAS whoami 2>/dev/null | head -n 1)."
else
  say "Log in met je Expo-account (gratis aan te maken op https://expo.dev/signup)."
  $EAS login || fail "Inloggen bij Expo lukte niet."
fi
if ! grep -q '"projectId"' app.json; then
  say "Het project koppelen aan je Expo-account..."
  $EAS init || fail "Koppelen lukte niet."
  say "  ${dim}app.json heeft nu een projectId. Commit die wijziging later gewoon.${reset}"
fi
ok "Expo is klaar."

# 4. Bouwen -----------------------------------------------------------------------------------
title "Stap 4 van 4 · Bouwen en naar TestFlight"
say "EAS bouwt de app in de cloud (15 tot 30 minuten) en zet hem daarna in TestFlight."
say "De eerste keer vraagt EAS om je Apple ID en maakt het de certificaten voor je aan:"
say "kies steeds de voorgestelde optie (Enter)."
echo
ask_yes "Nu bouwen en uploaden?" || { say "Oké. Start later opnieuw met 'npm run publiceer'."; exit 0; }

# EAS_NO_VCS uploads the files as they are on disk, including the Bible text git ignores.
EAS_NO_VCS=1 $EAS build --platform ios --profile production --auto-submit || fail "Bouwen of uploaden mislukte. Stuur de foutmelding naar Claude."

title "Klaar"
say "De app staat in App Store Connect. Over 10 tot 30 minuten krijg je een mail van Apple."
say "Daarna:"
say "  1. Ga naar https://appstoreconnect.apple.com > Moral Fuel > TestFlight."
say "  2. Interne test: maak een groep en voeg jezelf toe."
say "  3. Installeer de app 'TestFlight' op je iPhone en open de uitnodiging."
say "  4. Controleer in de app of de Bijbellezer echte tekst laat zien."
echo
