// Spelreglerna för poäng. Allt som har med poäng att göra finns i den här filen.

import { FocusSession } from "@/interface/interface";

// Hur mycket varje avdrag kostar
export const FLIP_PENALTY = 3; // vända upp telefonen
export const LEAVE_PENALTY = 10; // lämna appen

// 1. Grundpoäng: +1 för varje hel minut, men bara om man svarade Ja
export function getBasePoints(session: FocusSession): number {
  if (session.goalCompleted === true) {
    return Math.floor(session.durationMin);
  }
  return 0;
}

// 2. Avdrag: räknas alltid, oavsett svar
export function getPenaltyPoints(session: FocusSession): number {
  // ?? 0: saknas värdet (t.ex. ett äldre pass) räknas det som 0 i stället för NaN
  const flips = session.flips ?? 0;
  const leaves = session.leaves ?? 0;
  return flips * FLIP_PENALTY + leaves * LEAVE_PENALTY;
}

// 3. Poängen för ett pass = grundpoäng − avdrag
export function calculateScore(session: FocusSession): number {
  return getBasePoints(session) - getPenaltyPoints(session);
}

// Är tidpunkten idag?
function isToday(timestamp: number): boolean {
  return new Date(timestamp).toDateString() === new Date().toDateString();
}

// 4. Dagens poäng: summan av alla besvarade pass som startade idag
export function getTodayScore(sessions: FocusSession[]): number {
  let total = 0;
  for (const session of sessions) {
    if (session.goalCompleted !== undefined && isToday(session.startedAt)) {
      total += calculateScore(session);
    }
  }
  return total;
}

// 5. Topplistan: de besvarade pass som gav mest poäng, bäst först
export function getTopSessions(sessions: FocusSession[], count: number): FocusSession[] {
  const answered = sessions.filter((session) => session.goalCompleted !== undefined);
  const sorted = [...answered].sort((a, b) => calculateScore(b) - calculateScore(a));
  return sorted.slice(0, count);
}
