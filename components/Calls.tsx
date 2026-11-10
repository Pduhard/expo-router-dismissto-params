import { router, usePathname } from "expo-router";
import { Button, Text, View } from "react-native";

export function Calls() {
  const pathname = usePathname();
  return (
    <View>
      <Text style={{ fontSize: 24, padding: 16 }}>Screen: {pathname}</Text>
      <Button title="router.push('/1')" onPress={() => router.push("/1")} />
      <Button title="router.push('/modal')" onPress={() => router.push("/modal")} />
      <Button title="router.dismissTo('/2')" onPress={() => router.dismissTo("/2")} />
      <Button title="router.back()" onPress={() => router.back()} />
    </View>
  );
}
