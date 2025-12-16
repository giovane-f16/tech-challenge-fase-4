import { PostModel } from "@/app/src/Model/post";
import { PostProvider } from "@/app/src/Provider/post";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Edit() {
    const { id, post: postParam } = useLocalSearchParams<{ id: string; post?: string }>();
    const router = useRouter();
    const postProvider = new PostProvider();
    const postData = postParam ? new PostModel(JSON.parse(postParam)) : null;

    const [loading, setLoading] = useState<boolean>(false);
    const [imageUri, setImageUri] = useState<string | null>(postData?.getThumbnail() || null);
    const [formData, setFormData] = useState({
        titulo: postData?.getTitulo() || "",
        conteudo: postData?.getConteudo() || "",
        autor: postData?.getAutor() || "",
        thumbnail: postData?.getThumbnail() || "",
    });

    const loadData = () => {
        if (!postParam) {
            return;
        }

        let postParse = JSON.parse(postParam);
        let postModel = new PostModel(postParse);

        setFormData({
            titulo: postModel.getTitulo(),
            conteudo: postModel.getConteudo(),
            autor: postModel.getAutor(),
            thumbnail: postModel.getThumbnail() || "",
        });
        setImageUri(postModel.getThumbnail() || null);
    }

    useEffect(() => {
        loadData();
    }, [id, postParam]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permissão necessária", "Precisamos de permissão para acessar suas fotos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
            base64: true
        });

        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
            if (!result.assets[0].base64) {
                return;
            }

            const mimeType = result.assets[0].mimeType || result.assets[0].uri.match(/\.(png|jpg|jpeg|gif)$/i)?.[1];
            let contentType = "image/jpeg";

            if (mimeType) {
                if (mimeType.includes("png") || mimeType === "png") {
                    contentType = "image/png";
                } else if (mimeType.includes("gif") || mimeType === "gif") {
                    contentType = "image/gif";
                } else if (mimeType.includes("webp") || mimeType === "webp") {
                    contentType = "image/webp";
                }
            }

            const base64WithPrefix = `data:${contentType};base64,${result.assets[0].base64}`;
            setFormData({ ...formData, thumbnail: base64WithPrefix });
        }
    };

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

    const confirmDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este post?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: handleDelete
                }
            ]
        );
    };

    const handleDelete = async () => {
        try {
            await postProvider.deletePost(id);
            Alert.alert("Sucesso", "Post excluído com sucesso!");
            router.replace("/view/Home");
        } catch (error) {
            Alert.alert("Erro", "Falha ao excluir o post. Tente novamente.");
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
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
                        <Text style={styles.label}>Imagem do Post</Text>
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={pickImage}
                            disabled={loading}
                        >
                            <Text style={styles.imagePickerButtonText}>
                                {imageUri ? "Alterar Imagem" : "Selecionar Imagem da Galeria"}
                            </Text>
                        </TouchableOpacity>

                        {imageUri && (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => {
                                        setImageUri(null);
                                        setFormData({ ...formData, thumbnail: "" });
                                    }}
                                >
                                    <Text style={styles.removeImageButtonText}>Remover</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Conteúdo</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
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
                        style={[
                            styles.submitDeleteButton,
                            loading && styles.submitButtonDisabled,
                        ]}
                        onPress={confirmDelete}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                Excluir Post
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.replace("/view/Home")}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    scrollContent: {
        flexGrow: 1,
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
        textAlignVertical: 'top',
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
    submitDeleteButton: {
        backgroundColor: "#d21f12ff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 1,
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
    imagePickerButton: {
        backgroundColor: "#e5e7eb",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    imagePickerButtonText: {
        color: "#374151",
        fontSize: 16,
        fontWeight: "600",
    },
    imagePreviewContainer: {
        marginTop: 12,
        alignItems: "center",
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        backgroundColor: "#e5e7eb",
    },
    removeImageButton: {
        marginTop: 8,
        backgroundColor: "#ef4444",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    removeImageButtonText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },
});
