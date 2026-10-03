// välj mål och tid

import { router } from "expo-router";
import { ReactElement, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Setup() {
  const [time, setTimer] = useState(25);


  return (
    <View>
      <Text>Setup meny</Text>
      <Text>Vald tid: {time} min</Text>
  
      {[5,10,15,20,25,30].map((_, index) => <Pressable key={index} onPress={() => setTimer((index +1) * 5)}>
        <Text>{(index +1) * 5} min</Text>
      </Pressable>)}
      <Pressable
        onPress={() =>
          router.push({ pathname: "/focus", params: { durationMin: time * 60000 } })
        }
      >
        <Text>Starta timer</Text>
      </Pressable>
    </View>
  );
}
