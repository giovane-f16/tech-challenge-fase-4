import { Href, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

const createPostButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("view/post/create" as Href)}
      style={{
        marginRight: 16,
        backgroundColor: "#ffffff20",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
      }}
    >
      <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
        + Novo Post
      </Text>
    </TouchableOpacity>
  );
}

export default createPostButton;