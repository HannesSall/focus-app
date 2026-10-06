import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";
import { SessionProvider } from "@/state/sessions";

export default function RootLayout() {
  return (
    // alla skärmar ligger inuti SessionProvider och kan använda useSessions()
    <SessionProvider>
      {/* ljus text i statusfältet (klocka, batteri) mot mörk bakgrund */}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </SessionProvider>
  );
}
