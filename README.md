# Fokus

## Beskrivning

En fokusapp för dig som har svårt att låta bli telefonen när du ska plugga eller jobba.
Innan passet skriver du vad du ska göra och hur länge. Sedan lägger du telefonen med skärmen nedåt.
Vänder du upp den eller lämnar appen tappar du poäng. När tiden är slut får du svara på om du
faktiskt gjorde det du skulle. Bara då får du poängen för passet.

## Så bygger och kör du projektet

1. Installera [Node.js](https://nodejs.org) (LTS) och appen **Expo Go** på din telefon.
2. Klona repot:
   ```bash
   git clone <repo-url>
   cd focus-app
   ```
3. Installera beroenden:
   ```bash
   npm install
   ```
4. Starta utvecklingsservern:
   ```bash
   npx expo start
   ```
5. Skanna QR-koden med kameran (iOS) eller med Expo Go (Android). Telefonen och datorn måste vara på samma nätverk.

> Appen behöver en riktig telefon. Accelerometern fungerar inte i iOS-simulatorn.

## Använda RN-komponenter

| Komponent | Används till |
|---|---|
| TODO | |

## Använda Expo SDK-moduler

| Modul | Används till |
|---|---|
| `expo-notifications` | TODO |
| `expo-sensors` | TODO |
| `expo-keep-awake` | TODO |
| `expo-haptics` | TODO |

## Uppfyllda krav

### Godkänt (G)
- [ ] Minst 4 RN-komponenter och minst 4 moduler från Expo SDK
- [ ] Komponenter och moduler antecknade i README.md, med en lista över uppfyllda krav
- [ ] Expo Router används för navigering, och minst en skärm tar emot en parameter
- [ ] Git och GitHub har använts, med commits spridda över arbetets gång
- [ ] README.md enligt beskrivningen
- [ ] Inlämnad i tid
- [ ] Muntlig presentation genomförd

### Väl godkänt (VG)
- [ ] Ytterligare en valfri extern modul från reactnative.directory
- [ ] Appen hämtar data från ett Web-API
- [ ] Användningen av AI-verktyg dokumenterad i README
