import { PostProvider } from "@/app/src/Provider/post";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

interface DeleteButtonProps {
    postId: string
}

const deleteButton = ({ postId }: DeleteButtonProps) => {
    const router = useRouter();
    const postProvider = new PostProvider();

    const confirmDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este post?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: handleDelete
                }
            ]
        );
    };

    const handleDelete = async () => {
        try {
            await postProvider.deletePost(postId);
            Alert.alert("Sucesso", "Post excluído com sucesso!");
            router.dismissAll();
            router.replace("/");
        } catch (error) {
            Alert.alert("Erro", "Falha ao excluir o post. Tente novamente.");
            console.error(error);
        }
    };

    return (
        <TouchableOpacity
            onPress={confirmDelete}
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