export interface Post {
    _id: string;
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: Date;
    thumbnail: string;
    data_atualizacao?: Date;
}

export class PostModel implements Post {
    _id: string;
    titulo: string;
    conteudo: string;
    autor: string;
    data_criacao: Date;
    thumbnail: string;
    data_atualizacao?: Date;

    constructor(post: Post) {
        this._id = post._id;
        this.titulo = post.titulo;
        this.conteudo = post.conteudo;
        this.autor = post.autor;
        this.data_criacao = post.data_criacao;
        this.thumbnail = post.thumbnail;
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

    getThumbnail(): string {
        return this.thumbnail;
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
            data_atualizacao: this.data_atualizacao,
        };
    }
}