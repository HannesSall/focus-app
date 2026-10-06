// Känner av när man lämnar appen och kommer tillbaka (AppState från React Native)
// När man kommer tillbaka får onReturn veta hur länge man var borta.

import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export function useLeaveDetection(onReturn: (awayMs: number) => void) {
  // När man lämnade appen (null = man är i appen)
  const leftAt = useRef<number | null>(null);
  // Senaste versionen av onReturn (komponenten skickar en ny funktion vid varje rendering)
  const onReturnRef = useRef(onReturn);
  useEffect(() => {
    onReturnRef.current = onReturn;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background") {
        // man lämnade appen: kom ihåg när
        leftAt.current = Date.now();
      } else if (state === "active" && leftAt.current !== null) {
        // man kom tillbaka: räkna ut hur länge man var borta
        const awayMs = Date.now() - leftAt.current;
        leftAt.current = null;
        onReturnRef.current(awayMs);
      }
    });

    return () => subscription.remove();
  }, []);
}
