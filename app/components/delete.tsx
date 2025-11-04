import { PostModel } from "@/app/src/Model/post";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const deleteButton = (post: PostModel) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(`view/post/delete/${post._id}` as any)}
            style={styles.button}
        >
            <Text style={styles.buttonText}>
                <MaterialIcons name="delete" size={18} color="#ffffff" />
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 16,
        backgroundColor: "#d21f12ff",
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

export default deleteButton;