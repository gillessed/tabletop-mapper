const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'tiff'];
const videoTypes = ['rm', 'mp4', 'wmv', 'avi', 'mov', 'mpg'];

export const isImage = (ending: string) => {
    return imageTypes.indexOf(ending) >= 0;
}

export const isVideo = (ending: string) => {
    return videoTypes.indexOf(ending) >= 0;
}

export function fileExtension(path: string) {
    return path.split('.').pop();
}