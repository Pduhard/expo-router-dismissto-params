import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Drops() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return (
    <View>
      <Text>drops of {slug}</Text>
      <Link href={`/projects/${slug}/drops/1`}>open drop 1</Link>
      <Pressable onPress={() => router.back()}>
        <Text>router.back()</Text>
      </Pressable>
    </View>
  );
}
