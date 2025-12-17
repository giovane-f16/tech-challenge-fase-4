import { auth } from "@/app/src/Config/firebase";
import { getUserData, logoutUser } from "@/app/src/Services/auth";
import { router } from "expo-router";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const UserInfo: React.FC = () => {
    const [userName, setUserName] = useState<string>("Usuário");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                loadUserName(user);
            } else {
                setUserName("Usuário");
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserName = async (user: User) => {
        if (!user || !user.uid) return;

        try {
            const userData = await getUserData();
            if (!userData || !userData.name) {
                setUserName(user.email?.split("@")[0] || "Usuário");
            }

            setUserName(userData?.name || user.email?.split("@")[0] || "Usuário");
        } catch (error) {
            console.error("Erro ao carregar nome do usuário:", error);
            if (user.email) {
                setUserName(user.email.split("@")[0]);
            }
        }
    }

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logoutUser();
                            router.replace("/");
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível fazer logout");
                        }
                    },
                },
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.userName}>Olá, {userName}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    userName: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 10,
    },
    logoutButton: {
        backgroundColor: "#ffffff20",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    logoutText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default UserInfo;