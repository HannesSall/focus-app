// kontroll: gjorde du det som var planerat?

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";

export default function SessionResult() {
  const params = useLocalSearchParams<{
    id: string;
    goal: string;
  }>();
  const goal = params.goal;

  // undefined = inte svarat än, true = Ja, false = Nej
  const [goalCompleted, setGoalCompleted] = useState<boolean | undefined>(undefined);
  // räknas fram: har man svarat?
  const submitted = goalCompleted !== undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ditt mål</Text>
      <Text style={styles.goal}>{goal}</Text>

      {!submitted && (
        <>
          <Text style={styles.question}>Gjorde du det under fokustimer?</Text>
          <View style={styles.row}>
            <Pressable style={[styles.button, styles.yes]} onPress={() => setGoalCompleted(true)}>
              <Text style={styles.buttonText}>Ja</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.no]} onPress={() => setGoalCompleted(false)}>
              <Text style={styles.buttonText}>Nej</Text>
            </Pressable>
          </View>
        </>
      )}

      {submitted && (
        <>
          <Text style={[styles.feedback, goalCompleted ? styles.success : styles.danger]}>
            {goalCompleted ? "Snyggt jobbat! 🎉" : "Nästa gång! 💪"}
          </Text>
          <Pressable style={styles.homeButton} onPress={() => router.replace("/")}>
            <Text style={styles.homeButtonText}>Till start</Text>
          </Pressable>
        </>
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
  label: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  goal: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  question: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: fontSize.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  yes: {
    backgroundColor: colors.success,
  },
  no: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  feedback: {
    marginTop: spacing.lg,
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.danger,
  },
  homeButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  homeButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
