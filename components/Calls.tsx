import { router } from "expo-router";
import { Button, View } from "react-native";

export function Calls() {
  return (
    <View>
      <Button title="router.push('/1')" onPress={() => router.push("/1")} />
      <Button title="router.push('/modal')" onPress={() => router.push("/modal")} />
      <Button title="router.dismissTo('/2')" onPress={() => router.dismissTo("/2")} />
      <Button title="router.back()" onPress={() => router.back()} />
    </View>
  );
}
