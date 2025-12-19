import { PostModel } from "@/app/src/Model/post";
import { PostProvider } from "@/app/src/Provider/post";

export class PostController {
    private postProvider: PostProvider;

    constructor(postProvider: PostProvider) {
        this.postProvider = postProvider;
    }

    getPostById(id: string): Promise<PostModel | null> {
        try {
            const post = this.postProvider.getPostById(id);
            return post;
        } catch (error) {
            console.error("Erro ao obter dados do post:", error);
            throw error;
        }
    }

    getPostByItem(item: any): PostModel {
        try {
            const post = new PostModel(item);
            return post;
        } catch (error) {
            console.error("Erro ao criar PostModel a partir do item:", error);
            throw error;
        }
    }
}

export default PostController;