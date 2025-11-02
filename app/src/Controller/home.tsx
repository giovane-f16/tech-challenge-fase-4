import { PostProvider } from "@/app/src/Provider/post";
import { PostModel } from "@/app/src/Model/post";

export class HomeController {
    private postProvider: PostProvider;

    constructor() {
        this.postProvider = new PostProvider();
    }

    async getHomeData(): Promise<PostModel[]> {
        try {
            const posts = await this.postProvider.getAllPosts();
            return posts;
        } catch (error) {
            console.error("Erro ao obter dados da home:", error);
            throw error;
        }
    }
}