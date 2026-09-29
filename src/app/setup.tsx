// välj mål och tid

import { ReactElement, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Setup() {
  const [time, setTimer] = useState(25);

  const buttons: ReactElement[] = [];
  for (let index: number = 1; index < 6; index++) {
    const minutes = index * 5;

    buttons.push(
      <Pressable onPress={() => setTimer(minutes)}>
        <Text>{minutes} min</Text>
      </Pressable>,
    );
  }
  return (
    <View>
      <Text>Setup meny</Text>
      <Text>Vald tid: {time} min</Text>
      {buttons}
    </View>
  );
}
