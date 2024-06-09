export enum FileType {
  Image = "image",
  Video = "video",
  Archive = "archive",
  Other = "other",
}

export const ImageTypes: string[] = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "tiff",
  "webp",
];
export const VideoTypes: string[] = ["rm", "mp4", "wmv", "avi", "mov", "mpg"];
export const ArchiveTypes: string[] = ["zip", "rar", "tar", "tgz", "gz"];

export const isImage = (ending: string) => {
  return ImageTypes.indexOf(ending.toLowerCase()) >= 0;
};

export const isVideo = (ending: string) => {
  return VideoTypes.indexOf(ending.toLowerCase()) >= 0;
};

export const isArchive = (ending: string) => {
  return ArchiveTypes.indexOf(ending.toLowerCase()) >= 0;
};

export function fileExtension(path: string): string | null {
  if (path.indexOf(".") < 0) {
    return null;
  }
  return path.split(".").pop();
}
