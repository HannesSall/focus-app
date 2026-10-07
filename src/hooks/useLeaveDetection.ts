// Känner av när man lämnar appen och kommer tillbaka (AppState från React Native)
// - onLeave: körs direkt när man lämnar appen
// - onReturn: körs när man kommer tillbaka, med hur länge man var borta

import { useEffect, useRef } from "react";
import { AppState } from "react-native";

type LeaveHandlers = {
  onLeave: () => void;
  onReturn: (awayMs: number) => void;
};

export function useLeaveDetection(handlers: LeaveHandlers) {
  // När man lämnade appen (null = man är i appen)
  const leftAt = useRef<number | null>(null);
  // Senaste versionen av funktionerna (komponenten skickar nya vid varje rendering)
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background" && leftAt.current === null) {
        // man lämnade appen: kom ihåg när, och säg till direkt
        leftAt.current = Date.now();
        handlersRef.current.onLeave();
      } else if (state === "active" && leftAt.current !== null) {
        // man kom tillbaka: räkna ut hur länge man var borta
        const awayMs = Date.now() - leftAt.current;
        leftAt.current = null;
        handlersRef.current.onReturn(awayMs);
      }
    });

    return () => subscription.remove();
  }, []);
}
