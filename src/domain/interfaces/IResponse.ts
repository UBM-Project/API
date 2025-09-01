export interface IResponseHateoas<T> {
    data: T; // o payload principal
    _links: {
        self: string; // link para o próprio recurso
        [key: string]: string; // outros links HATEOAS dinâmicos (update, delete, etc)
    };
}
