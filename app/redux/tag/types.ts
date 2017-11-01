export interface UpsertTagPayload {
    id: string;
    name: string;
    tagType: string;
    cover?: string;
    create: boolean;
}

export interface RemoveTagPayload {
    tagId: string;
    galleryId: string;
}