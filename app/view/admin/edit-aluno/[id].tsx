import { updateUserEmail, updateUserPassword } from "@/app/src/Services/auth";
import { deleteAluno } from "@/app/src/Services/user";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const EditAlunoScreen: React.FC = () => {
    const { id, email } = useLocalSearchParams<{ id: string; email: string; }>();
    const [emailAtualizado, setEmailAtualizado] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdateEmail = async () => {
        if (!email.trim() || !currentPassword.trim()) {
            Alert.alert("Erro", "Preencha o email e a senha atual");
            return;
        }

        setLoading(true);

        try {
            await updateUserEmail(email, currentPassword);
            Alert.alert("Sucesso", "Email atualizado com sucesso!");
            setCurrentPassword("");
        } catch (error: any) {
            let errorMessage = "Erro ao atualizar email";

            if (error.code === "auth/wrong-password") {
                errorMessage = "Senha atual incorreta";
            } else if (error.code === "auth/email-already-in-use") {
                errorMessage = "Este email já está em uso";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Email inválido";
            }

            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            Alert.alert("Erro", "Preencha todos os campos de senha");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Erro", "As novas senhas não coincidem");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Erro", "A nova senha deve ter no mínimo 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            await updateUserPassword(currentPassword, newPassword);
            Alert.alert("Sucesso", "Senha atualizada com sucesso!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            let errorMessage = "Erro ao atualizar senha";

            if (error.code === "auth/wrong-password") {
                errorMessage = "Senha atual incorreta";
            }

            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Excluir Aluno",
            "Tem certeza que deseja excluir este Aluno? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: confirmDelete,
                },
            ]
        );
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            await deleteAluno(id);

            Alert.alert("Sucesso", "Aluno excluído com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/view/admin/alunos"),
                },
            ]);
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao excluir Aluno");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View>
                    <Text style={styles.sectionTitle}>Editar Aluno - {email}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alterar Email</Text>
                    <Text style={styles.label}>Novo Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="email@exemplo.com"
                        value={emailAtualizado}
                        onChangeText={setEmailAtualizado}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />

                    <Text style={styles.label}>Senha Atual</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleUpdateEmail}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Atualizar Email</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alterar Senha</Text>
                    <Text style={styles.label}>Senha Atual</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha atual"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <Text style={styles.label}>Nova Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <Text style={styles.label}>Confirmar Nova Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a nova senha novamente"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleUpdatePassword}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Atualizar Senha</Text>
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
                            <Text style={styles.deleteButtonText}>Excluir Aluno</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => router.replace("/view/admin/alunos")}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Voltar</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

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

export default EditAlunoScreen;