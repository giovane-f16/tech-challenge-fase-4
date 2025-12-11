import { loginUser, registerUser } from "@/app/src/Services/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<"professor" | "aluno">("aluno");
    const [name, setName] = useState("");

    const handleSubmit = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                await loginUser(email, password, userType);
            } else {
                await registerUser(email, password, name, userType);
            }

            setTimeout(() => {
                router.replace("/view/Home");
            }, 100);
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro na autenticação");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isLogin ? "Login" : "Cadastro"}
            </Text>

            {!isLogin && (
                <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    value={name}
                    onChangeText={setName}
                    keyboardType="default"
                    autoCapitalize="words"
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                <Checkbox
                    status={userType === "aluno" ? "checked" : "unchecked"}
                    onPress={() => setUserType("aluno")}
                    color="#007AFF"
                />
                <Text style={{ marginLeft: 2 }}>Aluno</Text>

                <Checkbox
                    status={userType === "professor" ? "checked" : "unchecked"}
                    onPress={() => setUserType("professor")}
                    color="#007AFF"
                />
                <Text style={{ marginLeft: 2 }}>Professor</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>
                        {isLogin ? "Entrar" : "Cadastrar"}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => setIsLogin(!isLogin)}
            >
                <Text style={styles.linkText}>
                    {isLogin
                        ? "Não tem conta? Cadastre-se"
                        : "Já tem conta? Faça login"
                    }
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    linkButton: {
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        color: "#007AFF",
        fontSize: 16,
    },
});

export default LoginScreen;