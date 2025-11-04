import { PostModel } from "@/app/src/Model/post";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface EditButtonProps {
    post: PostModel;
}

const EditButton = ({ post }: EditButtonProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: `view/post/edit/${post._id}`,
                params: {
                    post: JSON.stringify(post)
                }
            } as any)}
            style={styles.button}
        >
            <Text style={styles.buttonText}>
                <MaterialIcons name="edit" size={18} color="#ffffff" />
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 16,
        backgroundColor: "#39d212ff",
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

export default EditButton;