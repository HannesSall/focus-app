import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";
import { useSessions } from "@/state/sessions";

// id tas emot som prop från focus.tsx: <Timer id={id} />
export default function Timer({ id }: { id: string }) {
  // hämta passet ur lådan med id:t
  const { getSession } = useSessions();
  const session = getSession(id);
  const durationMs = session ? session.durationMin * 60000 : 0;

  // sparas en gång när sidan öppnas
  const [startAt] = useState(Date.now());
  // totalt antal sekunder kvar, uppdateras av intervallet
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0);

  // räknas fram vid varje rendering (inget eget state)
  const minutesLeft = Math.floor(totalSecondsLeft / 60);
  const secondsLeft = totalSecondsLeft -(minutesLeft * 60); 

  useEffect(() => {
    // vänta tills passet har hittats i listan
    if (durationMs === 0) return;

    // intervalId (inte id) så att det inte krockar med passets id
    const intervalId = setInterval(() => {
      const seconds = checkTimer(startAt, durationMs);
      // tiden är slut → sluta ticka och gå till resultatet för passet
      if (seconds <= 0) {
        clearInterval(intervalId);
        router.replace({ pathname: "/session/[id]", params: { id } });
      }
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [durationMs]);


  const minutesText = String(minutesLeft);
  const secondsText = String(secondsLeft).padStart(2, "0");

  return (
    <View>
      <Text style={styles.time}>
        {minutesText}:{secondsText}
      </Text>
    </View>
  );

  function checkTimer(startTime: number, durationTime: number) {
    const seconds = Math.max(0, Math.ceil(((startTime + durationTime) - Date.now()) / 1000));
    setTotalSecondsLeft(seconds);
    return seconds;
  }
}

const styles = StyleSheet.create({
  time: {
    color: colors.text,
    fontSize: fontSize.timer,
    fontWeight: "200",
    // alla siffror lika breda, så att texten inte hoppar när den tickar
    fontVariant: ["tabular-nums"],
  },
});
