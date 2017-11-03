import { JannaTag, JannaGallery, JannaState, CreateGalleryPayload, JannaLoadPayload, CreatePhotosetPayload, RenamePhotosetPayload, DeletePhotosetPayload } from './types';
import { Map, Set } from 'immutable';
import { Reducer } from 'redux';
import { newTypedReducer } from '../utils/typedReducer';
import { TypedAction } from '../utils/typedAction';
import { setLocked, createGallery, createTag, jannaLoad, addTagsToGallery, deleteTag, removeTag, deleteGallery, createPhotoset, renamePhotoset, deletePhotoset } from './actions';
import { UpsertTagPayload, RemoveTagPayload } from '../tag/types';
import { AddTagsToGalleryPayload } from '../import/types';

const INITIAL_STATE: JannaState = {
    loading: false,
    locked: false,
    tags: Map(),
    galleries: Map(),
    tagToGalleryIndex: Map(),
};

const jannaLoadReducer = (state: JannaState, action: TypedAction<JannaLoadPayload>) => {
    return {
        ...state,
        tags: action.payload.tags,
        galleries: action.payload.galleries,
        tagToGalleryIndex: action.payload.tagToGalleryIndex,
    };
}

const setLockedReducer = (state: JannaState, action: TypedAction<boolean>) => {
    return {
        ...state,
        locked: action.payload
    };
}

const createGalleryReducer = (state: JannaState, action: TypedAction<CreateGalleryPayload>) => {
    const newGalleries = state.galleries.withMutations((mutable) => {
        mutable.set(action.payload.id, {
            id: action.payload.id,
            value: action.payload.id,
            tags: [],
            photosets: [{
                id: action.payload.id,
                name: 'Photoset',
                imageCount: action.payload.imageCount,
            }],
        });
    });
    return {
        ...state,
        galleries: newGalleries
    };
}

const createPhotosetReducer = (state: JannaState, action: TypedAction<CreatePhotosetPayload>) => {
    const newGalleries = state.galleries.withMutations((mutable) => {
        const gallery = state.galleries.get(action.payload.galleryId);
        const newGallery = {
            ...gallery,
            photosets: [
                ...gallery.photosets,
                {
                    id: action.payload.id,
                    name: `Images ${gallery.photosets.length + 1}`,
                    imageCount: action.payload.imageCount,
                },
            ],
        };
        mutable.set(action.payload.galleryId, newGallery);
    });
    return {
        ...state,
        galleries: newGalleries
    };
}

const renamePhotosetReducer = (state: JannaState, action: TypedAction<RenamePhotosetPayload>) => {
    const newGalleries = state.galleries.withMutations((mutable) => {
        const gallery = state.galleries.get(action.payload.galleryId);
        const newPhotosets = gallery.photosets.map((photoset, index) => {
            if (index !== action.payload.index) {
                return photoset;
            }
            return {
                ...photoset,
                name: action.payload.name,
            };
        })
        const newGallery = {
            ...gallery,
            photosets: newPhotosets,
        };
        mutable.set(action.payload.galleryId, newGallery);
    });
    return {
        ...state,
        galleries: newGalleries
    };
}

const deletePhotosetReducer = (state: JannaState, action: TypedAction<DeletePhotosetPayload>) => {
    const newGalleries = state.galleries.withMutations((mutable) => {
        const gallery = state.galleries.get(action.payload.galleryId);
        const newPhotosets = gallery.photosets.filter((photoset, index) => {
            return index !== action.payload.index;
        })
        const newGallery = {
            ...gallery,
            photosets: newPhotosets,
        };
        mutable.set(action.payload.galleryId, newGallery);
    });
    return {
        ...state,
        galleries: newGalleries
    };
}


const createTagReducer = (state: JannaState, action: TypedAction<UpsertTagPayload>) => {
    const id = action.payload.id;
    const newTags = state.tags.withMutations((mutable) => {
        mutable.set(id, {
            id,
            value: action.payload.name,
            tagType: action.payload.tagType,
            cover: action.payload.cover,
        });
    });
    const newTagToGalleryIndex = state.tagToGalleryIndex.withMutations((mutable) => {
        if (action.payload.create) {
            mutable.set(id, Set<string>());
        }
    });
    return {
        ...state,
        tags: newTags,
        tagToGalleryIndex: newTagToGalleryIndex,
    };
}

const deleteTagReducer = (state: JannaState, action: TypedAction<string>) => {
    const tagId = action.payload;
    const newTags = state.tags.withMutations((mutable) => {
        mutable.remove(tagId);
    });
    const newGalleries = state.galleries.withMutations((mutable) => {
        state.galleries.forEach((gallery) => {
            if (gallery.tags.indexOf(tagId) >= 0) {
                const newGallery = {
                    ...gallery,
                    tags: gallery.tags.filter((galleryTagId) => galleryTagId !== tagId),
                };
                mutable.set(gallery.id, newGallery);
            }
        });
    });
    const newTagToGalleryIndex = state.tagToGalleryIndex.withMutations((mutable) => {
        mutable.remove(tagId);
    });
    return {
        ...state,
        tags: newTags,
        galleries: newGalleries,
        tagToGalleryIndex: newTagToGalleryIndex,
    };
}

const removeTagReducer = (state: JannaState, action: TypedAction<RemoveTagPayload>) => {
    const { tagId, galleryId } = action.payload;
    const gallery = state.galleries.get(galleryId);
    const newGallery = {
        ...gallery,
        tags: gallery.tags.filter((galleryTagId) => galleryTagId !== tagId),
    };
    const newGalleries = state.galleries.withMutations((mutable) => {
        mutable.set(galleryId, newGallery);
    });
    const newTagToGalleryIndex = state.tagToGalleryIndex.withMutations((mutable) => {
        const galleries = state.tagToGalleryIndex.get(tagId);
        mutable.set(tagId, galleries.remove(galleryId));
    });
    return {
        ...state,
        galleries: newGalleries,
        tagToGalleryIndex: newTagToGalleryIndex,
    };
}

const addTagsToGalleryReducer = (state: JannaState, action: TypedAction<AddTagsToGalleryPayload>) => {
    const gallery = state.galleries.get(action.payload.galleryId);
    if (!gallery) {
        return state;
    }
    const tagsToAdd = action.payload.tags.filter((tag) => {
        return gallery.tags.indexOf(tag) < 0;
    });
    const newGallery = {
        ...gallery,
        tags: [...gallery.tags, ...tagsToAdd],
    };
    const newGalleries = state.galleries.withMutations((mutable) => {
        mutable.set(gallery.id, newGallery);
    });
    const newTagToGalleryIndex = state.tagToGalleryIndex.withMutations((mutable) => {
        tagsToAdd.forEach((tagId) => {
            const galleries = mutable.get(tagId);
            mutable.set(tagId, galleries.add(gallery.id));
        });
    });
    return {
        ...state,
        galleries: newGalleries,
        tagToGalleryIndex: newTagToGalleryIndex,
    };
}

const deleteGalleryReducer = (state: JannaState, action: TypedAction<string>) => {
    const gallery = state.galleries.get(action.payload);
    const newGalleries = state.galleries.withMutations((mutable) => {
        mutable.remove(gallery.id);
    });
    const newTagToGalleryIndex = state.tagToGalleryIndex.withMutations((mutable) => {
        gallery.tags.forEach((tagId) => {
            const galleries = mutable.get(tagId);
            mutable.set(tagId, galleries.remove(gallery.id));
        });
    });
    return {
        ...state,
        galleries: newGalleries,
        tagToGalleryIndex: newTagToGalleryIndex,
    };
}

export const jannaReducer: Reducer<JannaState> = newTypedReducer<JannaState>()
    .handle(jannaLoad.type, jannaLoadReducer)
    .handle(setLocked.type, setLockedReducer)
    .handle(createGallery.type, createGalleryReducer)
    .handle(createPhotoset.type, createPhotosetReducer)
    .handle(renamePhotoset.type, renamePhotosetReducer)
    .handle(deletePhotoset.type, deletePhotosetReducer)
    .handle(createTag.type, createTagReducer)
    .handle(deleteTag.type, deleteTagReducer)
    .handle(removeTag.type, removeTagReducer)
    .handle(addTagsToGallery.type, addTagsToGalleryReducer)
    .handle(deleteGallery.type, deleteGalleryReducer)
    .handleDefault((state = INITIAL_STATE) => state)
    .build();