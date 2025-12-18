import { PostModel } from "@/app/src/model/post";
import { PostProvider } from "@/app/src/Provider/post";

export class HomeController {
    private postProvider: PostProvider;

    constructor(postProvider: PostProvider) {
        this.postProvider = postProvider;
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

export default HomeController;