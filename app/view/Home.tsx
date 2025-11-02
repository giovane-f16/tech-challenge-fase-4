import { HomeController } from "@/app/src/Controller/home";
import { PostModel } from "@/app/src/Model/post";
import { PostProvider } from "@/app/src/Provider/post";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const postProvider   = new PostProvider();
    const homeController = new HomeController(postProvider);

    const loadPosts = async () => {
        try {
            setError(null);
            const data = await homeController.getHomeData();
            setPosts(data);
        } catch (err) {
            setError("Erro ao carregar posts. Tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    const renderPostItem = ({ item }: { item: PostModel }) => (
        <TouchableOpacity
            style={styles.postCard}
            activeOpacity={0.7}
            onPress={() => router.push(`view/post/${item.getId()}` as Href)}
        >
            <Image
                source={{ uri: item.getThumbnail() }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.postContent}>
                <Text style={styles.postTitle} numberOfLines={2}>
                    {item.getTitulo()}
                </Text>
                <Text style={styles.postExcerpt} numberOfLines={3}>
                    {item.getConteudoResumido(50)}
                </Text>
                <View style={styles.postFooter}>
                    <View style={styles.authorContainer}>
                        <Text style={styles.authorLabel}>Por:</Text>
                        <Text style={styles.authorName}>{item.getAutor()}</Text>
                    </View>
                    <Text style={styles.postDate}>
                        {postProvider.formatDate(item.getDataCriacao())}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post encontrado</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Posts</Text>
            <Text style={styles.headerSubtitle}>
                Últimas publicações
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Carregando posts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <FlatList
                data={posts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item.getId()}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyComponent}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#3b82f6"]}
                        tintColor="#3b82f6"
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
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
    listContainer: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
        paddingTop: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#6b7280",
    },
    postCard: {
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: "hidden",
    },
    thumbnail: {
        width: "100%",
        height: 200,
        backgroundColor: "#e5e7eb",
    },
    postContent: {
        padding: 16,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
        lineHeight: 28,
    },
    postExcerpt: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
        marginBottom: 12,
    },
    postFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    authorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    authorLabel: {
        fontSize: 12,
        color: "#9ca3af",
        marginRight: 4,
    },
    authorName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#3b82f6",
    },
    postDate: {
        fontSize: 12,
        color: "#9ca3af",
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#9ca3af",
    },
});
