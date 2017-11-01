export type PhotoViewState = OpenPhotoViewPayload | false;

export interface OpenPhotoViewPayload {
    images: string[];
    index: number;
    galleryId?: string;
}