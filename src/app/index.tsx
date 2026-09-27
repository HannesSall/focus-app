import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const score: number = 0; 
  return (
    <View style={styles.container}>
      <Text>Fokus</Text>
      <Text>Idag har du fått ihop {score}poäng</Text>
  <Link href={`/setup`}>Sätt up en timer</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// start