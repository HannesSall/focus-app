import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fontSize } from "@/constants/theme";

export default function Timer() {
  const params = useLocalSearchParams<{ durationMs: string }>();
  const durationMs = Number(params.durationMs);

  // sparas en gång när sidan öppnas
  const [startAt] = useState(Date.now());
  // totalt antal sekunder kvar, uppdateras av intervallet
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0);

  // räknas fram vid varje rendering (inget eget state)
  const minutesLeft = Math.floor(totalSecondsLeft / 60);
  const secondsLeft = totalSecondsLeft -(minutesLeft * 60); 

  useEffect(() => {
    const id = setInterval(() => {
      const seconds = checkTimer(startAt, durationMs);
      // tiden är slut → sluta ticka
      if (seconds <= 0) {
        clearInterval(id);
      }
    }, 100);
    return () => {
      clearInterval(id);
    };
  }, []);


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
