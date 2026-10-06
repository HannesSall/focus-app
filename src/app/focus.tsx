// timern går

import { useLocalSearchParams } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import { StyleSheet, Text, View } from "react-native";

import Timer from "@/components/timer";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useSessions } from "@/state/sessions";
import { FLIP_PENALTY, LEAVE_PENALTY } from "@/utils/score";

// spelreglerna medan timern går (avdragen hämtas från score.ts så att de alltid stämmer)
const RULES = [
  { text: "Lägg telefonen med skärmen nedåt", points: "" },
  { text: "Vänder du upp telefonen (timern pausar)", points: `−${FLIP_PENALTY}` },
  { text: "Lämnar du appen i mer än 10 s", points: `−${LEAVE_PENALTY}` },
  { text: "Varje hel minut du gjort det du skulle", points: "+1" },
];


export default function Focus() {
  // skärmen läser adressen /focus?id=… …
  const { id } = useLocalSearchParams<{ id: string }>();

  // … och slår upp passet i lådan
  const { getSession } = useSessions();
  const session = getSession(id);

  // skärmen får inte släckas under passet: då pausas appen och sensorerna slutar skicka data
  useKeepAwake();

  // Kontrollen görs EN gång här, så att timern alltid får ett pass som finns
  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.ruleText}>Passet hittades inte</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fokuspass</Text>
      {/* id och längd skickas till timern som props */}
      <Timer id={id} durationMin={session.durationMin} />

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
