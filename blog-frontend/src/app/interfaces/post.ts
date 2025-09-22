export interface Post {
    _id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    authorName: string;
    commentIds: string[];
}

export interface PostResponse {
    posts: Post[];
    total: number;
    page: number;
}   