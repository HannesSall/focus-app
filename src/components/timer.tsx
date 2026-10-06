import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, spacing } from "@/constants/theme";
import { useFaceDown } from "@/hooks/useFaceDown";
import { useLeaveDetection } from "@/hooks/useLeaveDetection";
import { useSessions } from "@/state/sessions";
import { getPenaltyPoints } from "@/utils/score";

// Minst så här lång tid mellan två avdrag, så att en vändning inte ger flera avdrag
const FLIP_COOLDOWN_MS = 3000;
// Så länge får man vara borta från appen utan avdrag
const LEAVE_GRACE_MS = 10000;

// Props från focus.tsx: <Timer id={id} durationMin={session.durationMin} />
// focus.tsx har redan kontrollerat att passet finns, så timern kan lita på värdena.
export default function Timer({ id, durationMin }: { id: string; durationMin: number }) {
  // addFlip och addLeave behövs för avdragen, getSession för att visa dem
  const { addFlip, addLeave, getSession } = useSessions();
  const session = getSession(id);
  // avdragen hittills under passet (0 om passet av någon anledning saknas)
  const penalty = session ? getPenaltyPoints(session) : 0;
  const durationMs = durationMin * 60000;

  // sensorerna: ligger telefonen med skärmen nedåt?
  const { isFaceDown, z, lux } = useFaceDown();

  // "Sparbössan": fokuserad tid från tidigare perioder (innan senaste pausen)
  const [savedMs, setSavedMs] = useState(0);
  // När den pågående perioden nedåt började. null = timern står still
  const [runningSince, setRunningSince] = useState<number | null>(null);
  // Nuet, uppdateras av intervallet så att skärmen ritas om
  const [now, setNow] = useState(() => Date.now());
  // När senaste avdraget gavs (useRef: ska minnas, men behöver inte rita om skärmen)
  const lastFlipAt = useRef(0);
  // TEST: visar "📳 Vibration" en kort stund, eftersom emulatorn inte kan vibrera
  const [vibrationShown, setVibrationShown] = useState(false);

  // Vibrera telefonen (expo-haptics). I utvecklingsläge syns det också på skärmen.
  function vibrate(type: Haptics.NotificationFeedbackType) {
    Haptics.notificationAsync(type);
    if (__DEV__) {
      setVibrationShown(true);
      setTimeout(() => setVibrationShown(false), 1500);
    }
  }

  // räknas fram vid varje rendering (inget eget state)
  const isRunning = runningSince !== null;
  const hasStarted = savedMs > 0 || isRunning;
  const focusedMs = savedMs + (isRunning ? Math.max(0, now - runningSince) : 0);
  const remainingMs = Math.max(0, durationMs - focusedMs);
  const isDone = remainingMs === 0;

  // Man lämnade appen och kom tillbaka efter awayMs millisekunder
  useLeaveDetection((awayMs) => {
    if (isDone) return;

    // tiden borta räknas inte: flytta fram starttiden lika mycket som man var borta
    setRunningSince((prev) => (prev === null ? null : prev + awayMs));

    // borta längre än nådatiden → avdrag
    if (awayMs > LEAVE_GRACE_MS) {
      addLeave(id);
      vibrate(Haptics.NotificationFeedbackType.Error);
    }
  });

  // 1. Telefonen läggs ned eller vänds upp → starta, fortsätt eller pausa
  // Effekten ska BARA köras när isFaceDown ändras (sensorn rapporterar en vändning).
  // Lint-reglerna nedan stängs av medvetet: med runningSince i beroendelistan skulle
  // effekten köras om direkt efter att den satt runningSince, och starta om perioden i en loop.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isDone) return;

    if (isFaceDown) {
      // nedåt → timern går (första gången startar den, sedan fortsätter den)
      setRunningSince(Date.now());
      setNow(Date.now());
    } else if (runningSince !== null) {
      // uppåt under passet → pausa: lägg den pågående perioden i sparbössan
      setSavedMs((prev) => prev + (Date.now() - runningSince));
      setRunningSince(null);

      // avdrag, men högst ett per FLIP_COOLDOWN_MS
      if (Date.now() - lastFlipAt.current > FLIP_COOLDOWN_MS) {
        lastFlipAt.current = Date.now();
        addFlip(id);
        vibrate(Haptics.NotificationFeedbackType.Warning);
      }
    }
  }, [isFaceDown]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // 2. Tickar bara medan timern går
  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // 3. Tiden är slut → gå till resultatet för passet
  useEffect(() => {
    if (isDone) {
      router.replace({ pathname: "/session/[id]", params: { id } });
    }
  }, [isDone, id]);

  // tid kvar som m:ss
  const totalSecondsLeft = Math.ceil(remainingMs / 1000);
  const minutesLeft = Math.floor(totalSecondsLeft / 60);
  const secondsLeft = totalSecondsLeft - minutesLeft * 60;
  const minutesText = String(minutesLeft);
  const secondsText = String(secondsLeft).padStart(2, "0");

  // vad som ska stå under timern
  let status = "Fokus pågår";
  if (!hasStarted) status = "Lägg telefonen med skärmen nedåt för att starta";
  else if (!isRunning) status = "Pausad – lägg tillbaka telefonen";

  return (
    <View style={styles.container}>
      <Text style={styles.time}>
        {minutesText}:{secondsText}
      </Text>
      <Text style={[styles.status, hasStarted && !isRunning && styles.paused]}>{status}</Text>

      {/* TEST: syns i 1,5 s varje gång appen ber telefonen vibrera */}
      {vibrationShown && <Text style={styles.vibration}>📳 Vibration</Text>}

      {/* avdragen syns direkt, så att man vet vad det kostade */}
      {penalty > 0 && <Text style={styles.penalty}>Avdrag hittills: −{penalty}</Text>}

      {/* TEST: sensorvärden, syns bara i utvecklingsläge */}
      {__DEV__ && (
        <Text style={styles.debug}>
          z: {z.toFixed(2)} · ljus: {lux === null ? "–" : `${Math.round(lux)} lx`} · nedåt:{" "}
          {isFaceDown ? "ja" : "nej"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.sm,
  },
  time: {
    color: colors.text,
    fontSize: fontSize.timer,
    fontWeight: "200",
    // alla siffror lika breda, så att texten inte hoppar när den tickar
    fontVariant: ["tabular-nums"],
  },
  status: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    textAlign: "center",
  },
  paused: {
    color: colors.danger,
  },
  vibration: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  penalty: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  debug: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
