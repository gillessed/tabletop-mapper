import * as React from "react";
import { getIpc } from "../app/ipc/ipc";
import { isIpcError } from "../app/ipc/ipcError";
import { generateRandomString } from "../app/utils/randomId";
import { FileCopier } from "./fileCopier";
import {
  fileExtension,
  FileType,
  isArchive,
  isImage,
  isVideo,
} from "./fileExtension";
import { pathBasename, pathJoin, PathSeparator } from "./path";

let FilerSeparator = "/";
export function setFilerSeparator(s: string) {
  FilerSeparator = s;
}

function trimSlashesEnd(str: string) {
  let result = str;
  while (str.endsWith(FilerSeparator)) {
    result = result.substr(0, result.length - 1);
  }
  return result;
}

function trimSlashesStart(str: string) {
  let result = str;
  while (str.startsWith(FilerSeparator)) {
    result = result.substr(0, result.length - 1);
  }
  return result;
}

export interface ReadDirOptions {
  onlyDirectories?: boolean;
  onlyFiles?: boolean;
  filter?: (filer: Filer) => boolean;
}

export type FileWriteOptions = {
  encoding?: string | null;
  mode?: number | string;
  flag?: string;
};

function getFileType(ext: string | null): FileType {
  if (ext == null) {
    return FileType.Other;
  }
  if (isVideo(ext)) {
    return FileType.Video;
  } else if (isImage(ext)) {
    return FileType.Image;
  } else if (isArchive(ext)) {
    return FileType.Archive;
  } else {
    return FileType.Other;
  }
}

export class Filer {
  static open(file: string) {
    return new Filer(file);
  }

  public readonly filename: string;
  public readonly fileType: FileType;
  public readonly extension: string;
  constructor(public readonly fullPath: string) {
    this.filename = pathBasename(fullPath);
    this.extension = fileExtension(this.fullPath);
    this.fileType = getFileType(this.extension);
  }

  public exists = async () => {
    return getIpc().fsExists(this.fullPath);
  };

  public isDirectory = async (): Promise<boolean> => {
    return await getIpc().fsIsDir(this.fullPath);
  };

  public getFilenameWithoutExtension = (): string => {
    return this.filename.slice(
      0,
      this.filename.length - this.extension.length - 1
    );
  };

  public isImage = () => {
    return this.fileType === FileType.Image;
  };

  public isVideo = () => {
    return this.fileType === FileType.Video;
  };

  public isArchive = () => {
    return this.fileType === FileType.Archive;
  };

  public isMedia = () => {
    return this.isImage() || this.isVideo();
  };

  public withoutExtension = (): Filer => {
    const newPath = this.fullPath.substring(
      0,
      this.fullPath.length - this.extension.length - 1
    );
    return Filer.open(newPath);
  };

  public resolve(file: string): Filer {
    return Filer.open(
      `${trimSlashesEnd(this.fullPath)}${FilerSeparator}${trimSlashesStart(
        file
      )}`
    );
  }

  public getParent = (): Filer | undefined => {
    if (this.fullPath.indexOf(PathSeparator) < 0) {
      return undefined;
    }
    const dirChain = this.fullPath.split(PathSeparator);
    if (dirChain[dirChain.length - 1] === "") {
      return undefined;
    }
    dirChain.pop();
    let newPath = dirChain.join(PathSeparator);
    if (newPath.match(/[a-zA-z]\:$/g)) {
      newPath += PathSeparator;
    }
    return Filer.open(newPath);
  };

  private readDirInternal = async (
    files: string[],
    options?: ReadDirOptions
  ): Promise<Filer[]> => {
    let filers: Filer[] = [];
    for (const filename of files) {
      const filerPath = pathJoin(this.fullPath, filename);
      const filer = Filer.open(filerPath);
      filers.push(filer);
    }
    if (options && options.filter) {
      filers = filers.filter(options.filter);
    }
    return filers;
  };

  private filterFiles = (
    filers: Filer[],
    options?: ReadDirOptions
  ): Filer[] => {
    const filtered: Filer[] = [];
    for (const filer of filers) {
      if (
        options == null ||
        (options.onlyDirectories === true && filer.isDirectory()) ||
        (options.onlyFiles === true && !filer.isDirectory())
      ) {
        filtered.push(filer);
      }
    }
    return filtered;
  };

  public readDir = async (options?: ReadDirOptions): Promise<Filer[]> => {
    if (!this.isDirectory()) {
      throw Error(
        "Error reading dir " + this.fullPath + ". It it not a directory."
      );
    }
    const filenames = await getIpc().fsReadDir(this.fullPath);
    const filers = await this.readDirInternal(filenames, options);
    return this.filterFiles(filers, options);
  };

  public mkdir = (): Promise<void> => {
    return getIpc().fsMkdir(this.fullPath);
  };

  public mkdirP = async (): Promise<void> => {
    if (await this.exists()) {
      return;
    } else {
      const parent = await this.getParent();
      if (parent) {
        await parent.mkdirP();
        await this.mkdir();
      } else {
        return this.mkdir();
      }
    }
  };

  public deleteRecursive = async (): Promise<void> => {
    const exists = await this.exists();
    if (!exists) {
      return;
    }

    const isDirectory = await this.isDirectory();

    if (isDirectory) {
      const children = await this.readDir();
      await Promise.all(children.map((child) => child.deleteRecursive()));
      return getIpc().fsRmdir(this.fullPath);
    } else {
      const error = await getIpc().fsUnlink(this.fullPath);
      if (isIpcError(error)) {
        if (error.type !== "NO_OP") {
          console.error(error);
          throw error;
        } else {
          console.warn(error);
        }
      }
    }
  };

  public readFile = (): Promise<string> => {
    return getIpc().fsReadFile({
      path: this.fullPath,
      options: { encoding: "utf-8" },
    });
  };

  public writeFile = async (data: string): Promise<void> => {
    try {
      getIpc().fsWriteFile({ path: this.fullPath, data });
    } catch (error) {
      console.error(error);
      return Promise.reject(
        "Error writing data to directory: " + this.fullPath
      );
    }
  };

  public queueCopyTo = (target: Filer, copier: FileCopier): Promise<void> => {
    return copier.copyFile({
      from: this.fullPath,
      to: target.fullPath,
    });
  };

  public getHash = async (
    hashName?: "sha1" | "sha256" | "md5"
  ): Promise<string> => {
    return getIpc().fsGetHash({ path: this.fullPath, hashName });
  };

  public getDataId = async (): Promise<string> => {
    const hash = await this.getHash();
    return `${hash}.${this.extension}`;
  };

  public getTmpFile = (prefix: string = "", extension?: string): Filer => {
    return this.resolve(
      prefix +
        generateRandomString() +
        (extension != null ? `.${extension}` : "")
    );
  };

  /**
   * Performs a depth-first walk over the file structure with this as the
   * root node. Safe even if root node is a file.
   */
  public treeWalk = async (options: {
    onFile?: (file: Filer) => void;
    onDirectory?: (dir: Filer) => void;
  }): Promise<void> => {
    const toVisit: Filer[] = [this];
    while (toVisit.length > 0) {
      const currentFile = toVisit.pop();
      const isDirectory = await currentFile.isDirectory();
      if (isDirectory) {
        if (options.onDirectory != null) {
          options.onDirectory(currentFile);
        }
        const children = await currentFile.readDir();
        toVisit.push(...children);
      } else if (options.onFile != null) {
        options.onFile(currentFile);
      }
    }
  };
}

export function useFiler(path: string) {
  return React.useMemo(() => Filer.open(path), [path]);
}
