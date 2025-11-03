import PostModel from "@/app/src/Model/post";
import { PostProvider } from "@/app/src/Provider/post";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CreatePost() {
    const router = useRouter();
    const postProvider = new PostProvider();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        conteudo: "",
        autor: "",
        thumbnail: "", // @toDo: ver como foi tratado na fase 3
    });

    const handleSubmit = async () => {
        if (!formData.titulo.trim()) {
            Alert.alert("Erro", "O título é obrigatório");
            return;
        }
        if (!formData.conteudo.trim()) {
            Alert.alert("Erro", "O conteúdo é obrigatório");
            return;
        }
        if (!formData.autor.trim()) {
            Alert.alert("Erro", "O autor é obrigatório");
            return;
        }

        setLoading(true);
        try {
            let response = await postProvider.createPost(formData);
            if (!(response instanceof PostModel)) {
                Alert.alert("Erro", "Falha ao criar o post. Tente novamente.");
                return;
            }

            Alert.alert(
                "Sucesso",
                "Post criado com sucesso!",
                [
                    {
                        text: "OK",
                        onPress: () => router.push({ pathname: `/view/post/${response.getId()}`, params: { post: JSON.stringify(response) }} as any),
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Erro", "Falha ao criar o post. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#39558eff" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Título *</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Digite o título do post"
                            value={formData.titulo}
                            onChangeText={(text) =>
                                setFormData({ ...formData, titulo: text })
                            }
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Autor *</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Nome do autor"
                            value={formData.autor}
                            onChangeText={(text) =>
                                setFormData({ ...formData, autor: text })
                            }
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>URL da Imagem</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={formData.thumbnail}
                            onChangeText={(text) =>
                                setFormData({ ...formData, thumbnail: text })
                            }
                            editable={!loading}
                            keyboardType="url"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Conteúdo *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            keyboardType="default"
                            placeholder="Escreva o conteúdo do post"
                            value={formData.conteudo}
                            onChangeText={(text) =>
                                setFormData({ ...formData, conteudo: text })
                            }
                            multiline
                            numberOfLines={10}
                            textAlignVertical="top"
                            editable={!loading}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            loading && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                Criar Post
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    form: {
        gap: 20,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    input: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#111827",
    },
    textArea: {
        minHeight: 150,
        maxHeight: 300,
    },
    submitButton: {
        backgroundColor: "#39558eff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    cancelButtonText: {
        color: "#6b7280",
        fontSize: 16,
        fontWeight: "600",
    },
});
