import { getProfessors } from "@/app/src/Services/professorService";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Professor {
    docId: string;
    uid: string;
    name: string;
    email: string;
    createdAt: string;
}

const ProfessoresScreen: React.FC = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadProfessors();
        }, [])
    );

    const loadProfessors = async () => {
        try {
            const data = await getProfessors();
            setProfessors(data);
        } catch (error) {
            console.error("Erro ao carregar professores:", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de professores");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProfessor = () => {
        router.push("/view/admin/create-professor");
    };

    const handleEditProfessor = (professor: Professor) => {
        router.push({
            pathname: "/view/admin/edit-professor/[id]",
            params: {
                id: professor.docId,
                email: professor.email
            },
        });
    };

    const renderProfessor = ({ item }: { item: Professor }) => (
        <TouchableOpacity
            style={styles.professorCard}
            onPress={() => handleEditProfessor(item)}
        >
            <View style={styles.professorInfo}>
                <Text style={styles.professorName}>{item.name}</Text>
                <Text style={styles.professorEmail}>{item.email}</Text>
                <Text style={styles.professorDate}>
                    Criado em: {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Professores Cadastrados</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateProfessor}
                >
                    <Text style={styles.createButtonText}>+ Novo Professor</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={professors}
                renderItem={renderProfessor}
                keyExtractor={(item) => item.docId}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: "#fff",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    createButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    listContainer: {
        padding: 15,
    },
    professorCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    professorInfo: {
        flex: 1,
    },
    professorName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    professorEmail: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
        marginBottom: 4,
    },
    professorDate: {
        fontSize: 12,
        color: "#999",
    },
    arrow: {
        fontSize: 24,
        color: "#ccc",
        marginLeft: 10,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
    },
});

export default ProfessoresScreen;