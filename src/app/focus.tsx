// timern går

import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import Timer from "@/components/timer";
import { colors, fontSize, radius, spacing } from "@/constants/theme";

// spelreglerna medan timern går
const RULES = [
  { text: "Lägg telefonen med skärmen nedåt", points: "" },
  { text: "Vänder du upp telefonen", points: "−3" },
  { text: "Lämnar du appen i mer än 10 s", points: "−10" },
  { text: "Varje hel minut du gjort det du skulle", points: "+1" },
];


export default function Focus() {
  // skärmen läser adressen /focus?id=… …
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fokus pågår</Text>
      {/* … och skickar id:t vidare till timern som prop */}
      <Timer id={id} />

      <View style={styles.rules}>
        {RULES.map((rule) => (
          <View key={rule.text} style={styles.ruleRow}>
            <Text style={styles.ruleText}>{rule.text}</Text>
            <Text
              style={[
                styles.rulePoints,
                rule.points.startsWith("+") && styles.plus,
                rule.points.startsWith("−") && styles.minus,
              ]}
            >
              {rule.points}
            </Text>
          </View>
        ))}
      </View>
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
    backgroundColor: colors.background,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  rules: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  ruleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  ruleText: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.sm,
  },
  rulePoints: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  plus: {
    color: colors.success,
  },
  minus: {
    color: colors.danger,
  },
});
