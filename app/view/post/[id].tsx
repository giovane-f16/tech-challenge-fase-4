import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PostController } from "@/app/src/Controller/post";
import { PostProvider } from "@/app/src/Provider/post";
import { PostModel } from "@/app/src/Model/post";

export default function PostDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [post, setPost] = useState<PostModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const postProvider = new PostProvider();
    const postController = new PostController(postProvider);

    const loadPost = async () => {
        try {
            setError(null);
            if (id) {
                const data = await postController.getPost(id);
                setPost(data);
            }
        } catch (err) {
            setError("Erro ao carregar post. Tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Carregando post...</Text>
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || "Post não encontrado"}
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Voltar</Text>
                </TouchableOpacity>

                <Image
                    source={{ uri: post.getThumbnail() }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />

                <View style={styles.content}>
                    <Text style={styles.title}>{post.getTitulo()}</Text>

                    <View style={styles.metadata}>
                        <View style={styles.authorContainer}>
                            <Text style={styles.authorLabel}>Por:</Text>
                            <Text style={styles.authorName}>
                                {post.getAutor()}
                            </Text>
                        </View>
                        <Text style={styles.date}>
                            {postProvider.formatDate(post.getDataCriacao())}
                        </Text>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.postContent}>{post.getConteudo()}</Text>

                    {post.getDataAtualizacao() && (
                        <View style={styles.updateInfo}>
                            <Text style={styles.updateText}>
                                Atualizado em:{" "}
                                {postProvider.formatDate(post.getDataAtualizacao()!)}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6b7280",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444",
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#3b82f6",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    scrollContent: {
        paddingBottom: 40,
    },
    backButton: {
        padding: 16,
        paddingTop: 50,
        backgroundColor: "#ffffff",
    },
    backButtonText: {
        fontSize: 16,
        color: "#3b82f6",
        fontWeight: "600",
    },
    thumbnail: {
        width: "100%",
        height: 300,
        backgroundColor: "#e5e7eb",
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#111827",
        lineHeight: 36,
        marginBottom: 16,
    },
    metadata: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    authorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    authorLabel: {
        fontSize: 14,
        color: "#9ca3af",
        marginRight: 6,
    },
    authorName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#3b82f6",
    },
    date: {
        fontSize: 14,
        color: "#9ca3af",
    },
    divider: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginBottom: 20,
    },
    postContent: {
        fontSize: 16,
        color: "#374151",
        lineHeight: 26,
        textAlign: "justify",
    },
    updateInfo: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    updateText: {
        fontSize: 13,
        color: "#9ca3af",
        fontStyle: "italic",
    },
});
