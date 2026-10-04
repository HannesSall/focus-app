// välj mål och tid

import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";

export default function Setup() {
  const [durationMin, setDurationMin] = useState(25);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup meny</Text>
      <Text style={styles.text}>Vald tid: {durationMin} min</Text>

      <View style={styles.row}>
        {[5,10,15,20,25,30].map((_, index) => <Pressable key={index} style={styles.timeButton} onPress={() => setDurationMin((index +1) * 5)}>
          <Text style={styles.timeButtonText}>{(index +1) * 5} min</Text>
        </Pressable>)}
      </View>

      <Pressable
        style={styles.startButton}
        onPress={() =>
          router.push({ pathname: "/focus", params: { durationMs: durationMin * 60000 } })
        }
      >
        <Text style={styles.startButtonText}>Starta timer</Text>
      </Pressable>
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
  startButtonText: {
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
