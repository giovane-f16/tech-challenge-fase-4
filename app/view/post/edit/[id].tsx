import { PostModel } from "@/app/src/Model/post";
import { PostProvider } from "@/app/src/Provider/post";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Edit() {
    const { id, post: postParam } = useLocalSearchParams<{ id: string; post?: string }>();
    const router = useRouter();
    const postProvider = new PostProvider();
    const postData = postParam ? JSON.parse(postParam) : null;
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        titulo: postData?.titulo || "",
        conteudo: postData?.conteudo || "",
        autor: postData?.autor || "",
        thumbnail: postData?.thumbnail || "",
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
            let response = await postProvider.updatePost(id, formData);
            if (!(response instanceof PostModel)) {
                Alert.alert("Erro", "Falha ao atualizar o post. Tente novamente.");
                return;
            }

            Alert.alert(
                "Sucesso",
                "Post atualizado com sucesso!",
                [
                    {
                        text: "OK",
                        onPress: () => router.push({ pathname: `/view/post/${response.getId()}`, params: { post: JSON.stringify(response) }} as any),
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Erro", "Falha ao atualizar o post. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ScrollView style={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Digite o título do post"
                            value={formData.titulo}
                            onChangeText={(text) =>{ setFormData({ ...formData, titulo: text }) }}
                            editable={!loading}
                        />
                    </View>


                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Autor</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Digite o autor do post"
                            value={formData.autor}
                            onChangeText={(text) =>{ setFormData({ ...formData, autor: text }) }}
                            editable={!loading}
                        />
                    </View>


                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Thumbnail</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Digite a URL da thumbnail"
                            value={formData.thumbnail}
                            onChangeText={(text) =>{ setFormData({ ...formData, thumbnail: text }) }}
                            editable={!loading}
                        />
                    </View>


                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Conteúdo</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="default"
                            placeholder="Digite o conteúdo do post"
                            value={formData.conteudo}
                            numberOfLines={10}
                            textAlignVertical="top"
                            onChangeText={(text) =>{ setFormData({ ...formData, conteudo: text }) }}
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
                                Atualizar Post
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
        backgroundColor: "#33b612ff",
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
