import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";

export default function Index() {
  const score: number = 0;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fokus</Text>
      <Text style={styles.text}>Idag har du fått ihop {score} poäng</Text>
      <Link href="/setup" style={styles.button}>
        Sätt upp en timer
      </Link>
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
  button: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    color: colors.background,
    fontSize: fontSize.md,
    fontWeight: "600",
    overflow: "hidden",
  },
});
