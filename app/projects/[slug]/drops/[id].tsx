import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Drop() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  return (
    <View>
      <Text>
        drop {id} of {slug}
      </Text>
      <Link href="/projects/b/drops/2">open drop 2 of project b</Link>
      <Pressable onPress={() => router.dismissTo(`/projects/${slug}/drops`)}>
        <Text>dismissTo /projects/{slug}/drops</Text>
      </Pressable>
      <Pressable onPress={() => router.back()}>
        <Text>router.back()</Text>
      </Pressable>
    </View>
  );
}
