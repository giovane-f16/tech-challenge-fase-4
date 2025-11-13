import { db } from "@/app/src/Config/firebase";
import { getCurrentUser, logoutUser } from "@/app/src/Services/authService";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const UserInfo: React.FC = () => {
    const [userName, setUserName] = useState<string>("Usuário");

    useEffect(() => {
        loadUserName();
    }, []);

    const loadUserName = async () => {
        const user = getCurrentUser();
        if (!user || !user.uid) return;

        try {
            // Buscar o nome do professor no Firestore
            const q = query(
                collection(db, "professors"),
                where("uid", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const professorData = querySnapshot.docs[0].data();
                setUserName(professorData.name || user.email?.split("@")[0] || "Usuário");
            } else {
                // Se não encontrar no Firestore, usa o email
                setUserName(user.email?.split("@")[0] || "Usuário");
            }
        } catch (error) {
            console.error("Erro ao carregar nome do usuário:", error);
            // Em caso de erro, usa o email como fallback
            if (user.email) {
                setUserName(user.email.split("@")[0]);
            }
        }
    };

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
    };

    return (
        <View style={styles.container}>
            <Text style={styles.userName}>{userName}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 10,
    },
    userName: {
        color: "#ffffff",
        fontSize: 14,
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