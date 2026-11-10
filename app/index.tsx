import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Link href="/projects/a/drops">open project a</Link>
    </View>
  );
}
