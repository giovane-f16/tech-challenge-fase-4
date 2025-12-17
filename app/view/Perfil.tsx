import { getUserData, updateNameAccount, updateUserPassword } from "@/app/src/Services/auth";
import { deleteProfessor } from "@/app/src/Services/user";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Perfil: React.FC = () => {
    const [email, setEmail]                     = useState("");
    const [name, setName]                       = useState("");
    const [id, setId]                           = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword]         = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameAtualizado, setNameAtualizado]   = useState("");
    const [userType, setUserType]               = useState("");
    const [loading, setLoading]                 = useState(false);

    const fetchUserData = async () => {
        const data = await getUserData();
        if (!data) {
            return;
        }

        setEmail(data.email);
        setName(data.name);
        setId(data.id);
        setUserType(data.userType);
    };

    useEffect(() => {
        fetchUserData();
    }, [id, name, email]);

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

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
                    onPress: () => {
                        if (userType === "professor") {
                            router.replace("/view/admin/professores");
                            return;
                        }

                        if (userType === "aluno") {
                            router.replace("/view/admin/alunos");
                            return;
                        }

                        router.replace("/view/Home");
                    },
                },
            ]);
            setNameAtualizado("");
        } catch (error) {
            Alert.alert("Erro", "Erro ao atualizar nome");
        }
    }

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
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            Alert.alert("Sucesso", "Senha atualizada com sucesso! Faça login novamente com a nova senha.", [
                {
                    text: "OK",
                    onPress: () => {
                        router.back();
                    }
                }
            ]);
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
    };

    const confirmDelete = async () => {
        setLoading(true);
        try {
            await deleteProfessor(id);

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
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meus dados</Text>
                    <Text style={styles.sectionText}>
                        Nome:
                        <Text style={styles.sectionData}> {name}</Text>
                    </Text>
                    <Text style={styles.sectionText}>
                        Email:
                        <Text style={styles.sectionData}> {email}</Text>
                    </Text>
                    <Text style={styles.sectionText}>
                        Tipo:
                        <Text style={styles.sectionData}> {userType}</Text>
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
                            <Text style={styles.deleteButtonText}>Excluir minha conta</Text>
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

export default Perfil;