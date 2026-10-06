import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useSessions } from "@/state/sessions";
import { calculateScore, getTodayScore, getTopSessions } from "@/utils/score";

export default function Index() {
  // hämta alla pass ur lådan
  const { sessions } = useSessions();

  // räknas fram från passen (inget eget state)
  const todayScore = getTodayScore(sessions);
  const topSessions = getTopSessions(sessions, 5);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fokus</Text>
      <Text style={styles.text}>Idag har du fått ihop</Text>
      <Text style={styles.todayScore}>{todayScore} poäng</Text>

      <Link href="/setup" style={styles.button}>
        Sätt upp en timer
      </Link>

      {/* topplistan visas bara när det finns minst ett besvarat pass */}
      {topSessions.length > 0 && (
        <View style={styles.topList}>
          <Text style={styles.topTitle}>Dina bästa pass</Text>
          {topSessions.map((session, index) => (
            <View key={session.id} style={styles.topRow}>
              <Text style={styles.topGoal} numberOfLines={1}>
                {index + 1}. {session.goal}
              </Text>
              <Text style={styles.topScore}>{calculateScore(session)} p</Text>
            </View>
          ))}
        </View>
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
  todayScore: {
    color: colors.success,
    fontSize: fontSize.xl,
    fontWeight: "700",
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
  topList: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  topTitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  topGoal: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
  },
  topScore: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
});
