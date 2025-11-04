import { Href, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const createPostButton = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push("view/post/create" as Href)}
            style={styles.button}
        >
            <Text style={styles.buttonText}>
                + Novo Post
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 16,
        backgroundColor: "#ffffff20",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default createPostButton;