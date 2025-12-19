import { updateNameAccount } from "@/app/src/Services/auth";
import { deleteAccount } from "@/app/src/Services/user";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const EditProfessorScreen: React.FC = () => {
    const { id, email, name } = useLocalSearchParams<{ id: string; email: string; name: string }>();
    const [loading, setLoading] = useState(false);
    const [nameAtualizado, setNameAtualizado] = useState("");

    const handleDelete = () => {
        Alert.alert(
            "Excluir Professor",
            "Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: confirmDelete,
                },
            ]
        );
    }

    const confirmDelete = async () => {
        setLoading(true);
        try {
            await deleteAccount(id);

            Alert.alert("Sucesso", "Professor excluído com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/view/admin/professores"),
                },
            ]);
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao excluir professor");
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateName = async () => {
        if (!nameAtualizado.trim()) {
            Alert.alert("Erro", "O nome não pode estar vazio");
            return;
        }

        try {
            await updateNameAccount(id, nameAtualizado);
            Alert.alert("Sucesso", "Nome atualizado com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/view/admin/professores"),
                },
            ]);
            setNameAtualizado("");
        } catch (error) {
            Alert.alert("Erro", "Erro ao atualizar nome");
        }
    }
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dados do Professor</Text>
                    <Text style={styles.sectionText}>
                        Nome:
                        <Text style={styles.sectionData}> {name}</Text>
                    </Text>
                    <Text style={styles.sectionText}>
                        Email:
                        <Text style={styles.sectionData}> {email}</Text>
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alterar Nome</Text>
                    <Text style={styles.label}>Novo nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o novo nome"
                        value={nameAtualizado}
                        onChangeText={setNameAtualizado}
                        editable={!loading}
                    />
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleUpdateName}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Atualizar Nome</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Zona de Perigo</Text>
                    <TouchableOpacity
                        style={[styles.deleteButton, loading && styles.buttonDisabled]}
                        onPress={handleDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.deleteButtonText}>Excluir Professor</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.replace("/view/admin/professores")}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Voltar</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    sectionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#161616ff",
        marginBottom: 5,
    },
    sectionData: {
        fontSize: 16,
        fontWeight: "normal",
        color: "#000000ff",
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: "#fafafa",
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 15,
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    adminNote: {
        fontSize: 14,
        color: "#007AFF",
        marginBottom: 15,
        fontStyle: "italic",
    },
    deleteButton: {
        backgroundColor: "#ff3b30",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#666",
        fontSize: 16,
    },
});

export default EditProfessorScreen;