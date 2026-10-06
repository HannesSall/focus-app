# Fokus

## Beskrivning

**Fokus** är en app för dig som har svårt att låta bli telefonen när du ska plugga eller jobba.

1. Du skriver vad du ska göra under passet och väljer hur länge (5–30 minuter).
2. Du lägger telefonen **med skärmen nedåt**. Först då startar timern.
3. Vänder du upp telefonen **pausar timern** och du får **−3 poäng**.
   Lämnar du appen och är borta mer än 10 sekunder får du **−10 poäng**, och tiden borta räknas inte.
4. När tiden är slut får du svara på om du faktiskt gjorde det du skulle.
   Svarar du **Ja** får du **+1 poäng per minut**. Svarar du **Nej** blir det inga pluspoäng.
5. På startsidan ser du **dagens poäng** och dina **fem bästa pass**.

Appen känner av att telefonen ligger nedåt med två sensorer: accelerometern (skärmen pekar nedåt)
och ljussensorn (skärmen är täckt och mörk). Båda måste stämma, så det går inte att fuska genom att
bara hålla telefonen upp och ned.

## Så bygger och kör du projektet

**Du behöver:** [Node.js](https://nodejs.org) (LTS), [Git](https://git-scm.com), och antingen
appen **Expo Go** på en Android-telefon eller en Android-emulator via [Android Studio](https://developer.android.com/studio).

1. Klona repot och gå in i mappen:
   ```bash
   git clone https://github.com/HannesSall/focus-app.git
   cd focus-app
   ```
2. Installera beroenden:
   ```bash
   npm install
   ```
3. Starta utvecklingsservern:
   ```bash
   npx expo start
   ```
4. Öppna appen:
   - **Telefon:** öppna Expo Go och skanna QR-koden. Telefonen och datorn måste vara på samma wifi.
   - **Emulator:** starta emulatorn i Android Studio (Device Manager) och tryck sedan **`a`** i terminalen.

### Testa sensorerna i emulatorn

Öppna emulatorns **⋯ → Extended controls → Virtual sensors**:

- **Device Pose:** sätt Pitch eller Roll till 180° så att skärmen pekar nedåt.
- **Additional sensors → Light:** sätt ljuset till 0 lux (mörkt).

I utvecklingsläge finns knappen **"Testa 1 min"** på sidan *Nytt pass* för ett snabbt testpass (ger 1 poäng vid Ja),
och under timern visas sensorvärdena.

> Ljussensorn finns bara på Android. På iPhone används enbart accelerometern.

## Använda RN-komponenter

| Komponent | Används till | Exempel i koden |
|---|---|---|
| `View` | Layout och behållare på alla skärmar: rader, rutor och centrering | [index.tsx:17](src/app/index.tsx#L17) |
| `Text` | All text: rubriker, timern, regler, poäng och topplistan | [index.tsx:18](src/app/index.tsx#L18) |
| `Pressable` | Knappar: tidsval, *Starta timer*, *Ja/Nej* på resultatsidan och *Till start* | [setup.tsx:43](src/app/setup.tsx#L43), [session/[id].tsx:45](src/app/session/%5Bid%5D.tsx#L45) |
| `TextInput` | Fältet där man skriver sitt mål på sidan *Nytt pass* | [setup.tsx:32](src/app/setup.tsx#L32) |

## Använda Expo SDK-moduler

| Modul | Används till | Var i koden |
|---|---|---|
| `expo-sensors` | `Accelerometer` känner av om skärmen pekar nedåt, och `LightSensor` om skärmen är täckt | [useFaceDown.ts:23](src/hooks/useFaceDown.ts#L23) (accelerometer), [useFaceDown.ts:33](src/hooks/useFaceDown.ts#L33) (ljus) |
| `expo-haptics` | Telefonen vibrerar när man vänder upp den eller lämnar appen och får avdrag | [timer.tsx:43](src/components/timer.tsx#L43) |
| `expo-keep-awake` | Håller skärmen vaken under passet, annars pausas appen och sensorerna slutar fungera | [focus.tsx:30](src/app/focus.tsx#L30) |
| `expo-status-bar` | Gör statusfältet (klocka, batteri) ljust mot appens mörka tema | [_layout.tsx:12](src/app/_layout.tsx#L12) |

Navigering sker med **Expo Router** (filbaserad routing i `src/app/`). Skärmen som tar emot en
parameter är [session/[id].tsx](src/app/session/%5Bid%5D.tsx#L12).
Att man lämnar appen känns av med `AppState` från React Native, i [useLeaveDetection.ts:17](src/hooks/useLeaveDetection.ts#L17).
Poängreglerna finns i [score.ts](src/utils/score.ts).

> Radnumren gäller när README:n skrevs. Om koden ändras kan de flytta sig lite.

## Projektstruktur

```
src/
├── app/                  Skärmar (Expo Router)
│   ├── _layout.tsx       Ramen runt alla skärmar: Stack, tema och SessionProvider
│   ├── index.tsx         Start: dagens poäng och topp 5
│   ├── setup.tsx         Nytt pass: mål och tid
│   ├── focus.tsx         Pågående pass: timer och regler
│   └── session/[id].tsx  Resultat för ett pass (tar emot id som parameter)
├── components/timer.tsx  Timern som pausar när telefonen vänds upp
├── hooks/useFaceDown.ts  Läser accelerometern och ljussensorn
├── hooks/useLeaveDetection.ts  Känner av när man lämnar appen och kommer tillbaka
├── state/sessions.tsx    Context: listan med alla pass, delad mellan skärmarna
├── utils/score.ts        Poängreglerna
├── interface/            Typen FocusSession
└── constants/theme.ts    Färger, avstånd och textstorlekar
```

## AI-verktyg

Jag har använt **Claude Code** som stöd under arbetet: för att planera appen, förklara begrepp
(state, Context, `useEffect`, sensorer), felsöka och skriva delar av koden. Jag har verifierat koden genom att
köra `npx tsc --noEmit` (typkontroll), testa varje flöde i Android-emulatorn med Virtual sensors,
och gå igenom koden rad för rad tills jag kunnat förklara den. Commits som Claude Code gjorde åt mig
är märkta med `Co-Authored-By: Claude`.

## Uppfyllda krav

### Godkänt (G)
- [x] Minst 4 RN-komponenter och minst 4 moduler från Expo SDK
- [x] Komponenter och moduler antecknade i README.md, med en lista över uppfyllda krav
- [x] Expo Router används för navigering, och minst en skärm tar emot en parameter (`session/[id].tsx`)
- [x] Git och GitHub har använts, med commits spridda över arbetets gång
- [x] README.md enligt beskrivningen
- [ ] Inlämnad i tid
- [ ] Muntlig presentation genomförd