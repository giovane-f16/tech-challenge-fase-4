import { Config } from "@/app/src/Config/config";
import { Post, PostCreate, PostModel } from "@/app/src/Model/post";

export class PostProvider {
    private baseURL: string = Config.getApiEndpoint();
    private token: string   = Config.getAuthToken();

    async getAllPosts(): Promise<PostModel[]> {
        try {
            const url = `${this.baseURL}/posts`;
            console.log("Fetching posts from:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Erro ao buscar posts: ${response.status} - ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Response is not JSON:", text.substring(0, 200));
                throw new Error("A resposta da API não está em formato JSON");
            }

            const data = await response.json();
            return data.map((post: any) => new PostModel(post));
        } catch (error) {
            console.error("Erro ao buscar todos os posts:", error);
            throw error;
        }
    }

    async getPostById(id: string): Promise<PostModel> {
        try {
            const response = await fetch(`${this.baseURL}/posts/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar post: ${response.statusText}`);
            }

            const data = await response.json();
            return new PostModel(data);
        } catch (error) {
            console.error(`Erro ao buscar post com ID ${id}:`, error);
            throw error;
        }
    }

    async searchPosts(params: Post): Promise<PostModel[]> {
        try {
            const queryParams = new URLSearchParams();

            if (params.titulo) queryParams.append("titulo", params.titulo);
            if (params.conteudo) queryParams.append("conteudo", params.conteudo);
            if (params.autor) queryParams.append("autor", params.autor);

            const response = await fetch(
                `${this.baseURL}/posts/search?${queryParams.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Erro ao buscar posts: ${response.statusText}`);
            }

            const data = await response.json();
            return data.map((post: any) => new PostModel(post));
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            throw error;
        }
    }

    async getPostsByDate(date: string): Promise<PostModel[]> {
        try {
            const response = await fetch(`${this.baseURL}/posts/date/${date}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar posts por data: ${response.statusText}`);
            }

            const data = await response.json();
            return data.map((post: any) => new PostModel(post));
        } catch (error) {
            console.error(`Erro ao buscar posts da data ${date}:`, error);
            throw error;
        }
    }

    async createPost(postData: PostCreate): Promise<PostModel> {
        try {
            const response = await fetch(`${this.baseURL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`,
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar post: ${response.statusText}`);
            }

            const data = await response.json();
            return new PostModel(data);
        } catch (error) {
            console.error("Erro ao criar post:", error);
            throw error;
        }
    }

    async updatePost(id: string, postData: Post): Promise<PostModel> {
        try {
            const response = await fetch(`${this.baseURL}/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.token}`,
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar post: ${response.statusText}`);
            }

            const data = await response.json();
            return new PostModel(data);
        } catch (error) {
            console.error(`Erro ao atualizar post ${id}:`, error);
            throw error;
        }
    }

    async deletePost(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseURL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao deletar post: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error(`Erro ao deletar post ${id}:`, error);
            throw error;
        }
    }

    public formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
}

export default PostProvider;