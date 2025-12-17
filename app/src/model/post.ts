import Config from "@/app/src/Config/config";

export interface Post {
    _id: string;
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: Date;
    thumbnail: string;
    thumbnail_id?: string;
    data_atualizacao?: Date;
}

export interface PostCreateOrUpdate {
    titulo: string;
    conteudo: string;
    autor: string;
    thumbnail: string;
}

export class PostModel implements Post {
    _id: string;
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: Date;
    thumbnail: string;
    thumbnail_id?: string;
    data_atualizacao?: Date;

    constructor(post: Post) {
        this._id = post._id;
        this.titulo = post.titulo;
        this.conteudo = post.conteudo;
        this.autor = post.autor;
        this.data_criacao = post.data_criacao;
        this.thumbnail = post.thumbnail;
        this.thumbnail_id = post.thumbnail_id;
        this.data_atualizacao = post.data_atualizacao ?? undefined;
    }

    getId(): string {
        return this._id;
    }

    getTitulo(): string {
        return this.titulo;
    }

    getConteudo(): string {
        return this.conteudo;
    }

    getAutor(): string {
        return this.autor;
    }

    getDataCriacao(): Date {
        return this.data_criacao;
    }

    getThumbnailId(): string | undefined {
        return this.thumbnail_id;
    }

    getThumbnail(): string {
        if (!this.thumbnail) {
            return `${Config.getApiEndpoint()}/posts/${this.getId()}/thumbnail/${this.getThumbnailId()}`;
        }

        if (this.thumbnail.startsWith("http") || this.thumbnail.startsWith("data:")) {
            return this.thumbnail;
        }

        const prefix = this.thumbnail.startsWith("/") ? "" : "/";
        return `${Config.getApiEndpoint()}${prefix}${this.thumbnail}`;
    }

    getDataAtualizacao(): Date | undefined {
        return this.data_atualizacao;
    }

    toJSON(): Post {
        return {
            _id: this._id,
            titulo: this.titulo,
            conteudo: this.conteudo,
            autor: this.autor,
            data_criacao: this.data_criacao,
            thumbnail: this.thumbnail,
            thumbnail_id: this.thumbnail_id,
            data_atualizacao: this.data_atualizacao,
        }
    }

    getConteudoResumido(lenght: number): string {
        if (this.conteudo.length <= lenght) {
            return this.conteudo;
        }
        return this.conteudo.substring(0, lenght) + "...";
    }
}

export default PostModel;