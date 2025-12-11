import { getAlunos } from "@/app/src/Services/user";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Aluno {
    docId: string;
    uid: string;
    name: string;
    email: string;
    createdAt: string;
}

const AlunosScreen: React.FC = () => {
    const [alunos, setAlunos] = useState<Array<Aluno>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useFocusEffect(
        useCallback(() => {
            loadAlunos();
        }, [])
    );

    const loadAlunos = async () => {
        setLoading(true);
        try {
            let alunos = await getAlunos();
            setAlunos(alunos);
        } catch (error) {

        }
        setLoading(false);
    }

    const handleCreateAluno = () => {
        router.push("/view/admin/create-aluno");
    }

    const handleEditAluno = (aluno: Aluno) => {
        router.push({
            pathname: "/view/admin/edit-aluno/[id]",
            params: {
                id: aluno.docId,
                email: aluno.email
            }
        });
    }

    const renderAluno = ( { item }: { item: Aluno } ) => {
        return (
            <TouchableOpacity
                style={styles.professorCard}
                onPress={() => handleEditAluno(item)}
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
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Alunos Cadastrados</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateAluno}
                >
                    <Text style={styles.createButtonText}>+ Novo Aluno</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={alunos}
                renderItem={renderAluno}
                keyExtractor={(item) => item.docId}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
                    </View>
                }
            />
        </View>
    );
}

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

export default AlunosScreen;