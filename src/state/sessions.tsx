import { createContext, ReactNode, useContext, useState } from "react";

import { FocusSession } from "@/interface/interface";

// Det som ligger i "lådan": listan och funktionerna som skärmarna kan använda
type SessionsContextValue = {
    sessions: FocusSession[];
    createSession: (goal: string, durationMin: number) => string;
    getSession: (id: string) => FocusSession | undefined;
    completeSession: (id: string, goalCompleted: boolean) => void;
    addFlip: (id: string) => void;
    addLeave: (id: string) => void;
};

// 1. Lådan. null = ingen Provider har fyllt den än
const SessionsContext = createContext<SessionsContextValue | null>(null);

// 2. Provider: håller listan i state och lägger den i lådan.
// Läggs runt <Stack> i _layout.tsx så att alla skärmar når den.
export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessions, setSessions] = useState<FocusSession[]>([]);

    // Tar emot det användaren valt, fyller i resten själv och returnerar id:t
    function createSession(goal: string, durationMin: number): string {
        const newSession: FocusSession = {
            id: Date.now().toString(),
            goal,
            durationMin,
            startedAt: Date.now(),
            flips: 0,
            leaves: 0,
        };

        // ny lista: alla gamla pass + det nya sist
        setSessions((prev) => [...prev, newSession]);

        return newSession.id;
    }

    // Hämtar ett pass med ett visst id (undefined om det inte finns)
    function getSession(id: string): FocusSession | undefined {
        return sessions.find((session) => session.id === id);
    }

    // Sparar svaret på "Gjorde du det?" i rätt pass
    function completeSession(id: string, goalCompleted: boolean) {
        // ny lista där bara passet med rätt id byts mot en kopia med svaret
        setSessions((prev) =>
            prev.map((session) => (session.id === id ? { ...session, goalCompleted } : session)),
        );
    }

    // Avdrag: telefonen vändes upp (anropas av sensorn i Fas 3)
    function addFlip(id: string) {
        setSessions((prev) =>
            prev.map((session) => (session.id === id ? { ...session, flips: session.flips + 1 } : session)),
        );
    }

    // Avdrag: man lämnade appen (anropas i Fas 2)
    function addLeave(id: string) {
        setSessions((prev) =>
            prev.map((session) => (session.id === id ? { ...session, leaves: session.leaves + 1 } : session)),
        );
    }

    return (
        <SessionsContext.Provider
            value={{ sessions, createSession, getSession, completeSession, addFlip, addLeave }}
        >
            {children}
        </SessionsContext.Provider>
    );
}

// 3. Nyckeln: skärmarna skriver const { sessions, getSession } = useSessions();
export function useSessions() {
    const value = useContext(SessionsContext);
    if (!value) {
        throw new Error("useSessions måste användas inuti SessionProvider");
    }
    return value;
}
