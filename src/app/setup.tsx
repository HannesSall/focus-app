// välj mål och tid

import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useSessions } from "@/state/sessions";

export default function Setup() {
  // hämta funktionen ur lådan
  const { createSession } = useSessions();

  const [durationMin, setDurationMin] = useState(25);

  const [goal, setGoal] = useState<string>("");

  // räknas fram: tomt mål (eller bara mellanslag) → går inte att starta
  const canStart = goal.trim() !== "";

  // skapar passet i Context och skickar bara id:t vidare till focus
  function startSession(minutes: number, sessionGoal: string) {
    const id = createSession(sessionGoal, minutes);
    router.push({ pathname: "/focus", params: { id } });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nytt pass</Text>

      <Text style={styles.label}>Mål</Text>
      <TextInput
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
        placeholder="Vad är målet under fokustimer?"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.label}>Tid: {durationMin} min</Text>
      <View style={styles.row}>
        {[5, 10, 15, 20, 25, 30].map((minutes) => (
          <Pressable
            key={minutes}
            style={[styles.timeButton, minutes === durationMin && styles.timeButtonSelected]}
            onPress={() => setDurationMin(minutes)}
          >
            <Text style={styles.timeButtonText}>{minutes} min</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.startButton, !canStart && styles.startButtonDisabled]}
        disabled={!canStart}
        onPress={() => startSession(durationMin, goal.trim())}
      >
        <Text style={styles.startButtonText}>Starta timer</Text>
      </Pressable>
      {!canStart && <Text style={styles.hint}>Skriv ett mål för att kunna starta</Text>}

      {/* TEST: syns bara i utvecklingsläge (__DEV__), aldrig i en färdig app */}
      {__DEV__ && (
        <Pressable
          onPress={() => startSession(10 / 60, goal.trim() || "Testpass")}
        >
          <Text style={styles.text}>Testa 10 s</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  text: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  label: {
    alignSelf: "stretch",
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    alignSelf: "stretch",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: fontSize.md,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  // tidsknapparna bredvid varandra, radbryts om de inte får plats
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
  },
  timeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  // till vald knapp: använd tillsammans med timeButton
  timeButtonSelected: {
    backgroundColor: colors.surfaceSelected,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  timeButtonText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  startButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  // avstängd startknapp: grå och genomskinlig
  startButtonDisabled: {
    backgroundColor: colors.surfaceSelected,
    opacity: 0.5,
  },
  startButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
