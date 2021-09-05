import { copyQueue } from './fileCopier';
import { ipcInvoke } from '../ipc/ipcInvoke';
import { Ipc } from '../ipc/ipcCommands';

let FilerSeparator = '/';
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

export const ImageExtensions = [
  'jpg', 'jpeg',
  'png', 'gif',
  'webp', 'svg',
  'tiff',
];

export class Filer {
  constructor(public fullPath: string) {}

  public static open = (fullPath: string) => new Filer(fullPath);

  public resolve(file: string): Filer {
    return Filer.open(`${trimSlashesEnd(this.fullPath)}${FilerSeparator}${trimSlashesStart(file)}`);
  }

  public getParent(): Filer {
    const pathElements = this.fullPath.split(FilerSeparator);
    const parentElements = pathElements.slice(0, pathElements.length - 1);
    return Filer.open(parentElements.join(FilerSeparator));
  }

  public getFilename(): string {
    const split = this.fullPath.split(FilerSeparator);
    return split[split.length - 1];
  }

  public getFilenameNoExtension(): string {
    const filename = this.getFilename();
    const split = filename.split('.');
    const stripped = split.slice(0, split.length - 1).join('.');
    return stripped;
  }

  public getExtension(): string {
    return this.fullPath.split('.').pop();
  }

  public isImage(): boolean {
    return ImageExtensions.indexOf(this.getExtension()) >= 0;
  }

  public exists = async (): Promise<boolean> => {
    return ipcInvoke(Ipc.FilerExists, this.fullPath);
  }
  
  public isDirectory = async (): Promise<boolean> => {
    return ipcInvoke(Ipc.FilerIsDirectory, this.fullPath);
  }

  public deleteRecursive = async (): Promise<void> => {
    const isDirectory = await this.isDirectory();
    if (isDirectory) {
      const children = await this.readDir();
      for (const child of children) {
        await child.deleteRecursive();
      }
      return ipcInvoke(Ipc.FilerRmdir, this.fullPath);
    } else {
      return ipcInvoke(Ipc.FilerUnlink, this.fullPath);
    }
  }

  public mkdirP = async (): Promise<void> => {
    const exists = await this.exists();
    if (exists) {
      return Promise.resolve();
    }
    const parent = this.getParent();
    await parent.mkdirP();
    return ipcInvoke(Ipc.FilerMkdir, this.fullPath);
  }

  public readDir = async (): Promise<Filer[]> => {
    const files = await ipcInvoke(Ipc.FilerReaddir, this.fullPath);
    return files.map((file) => this.resolve(file));
  }

  public writeFile = async(data: string): Promise<void> => {
    return ipcInvoke(Ipc.FilerWriteFile, this.fullPath, data);
  }

  public readFile = async(): Promise<string> => {
    return ipcInvoke(Ipc.FilerReadFile, this.fullPath);
  }

  public copyTo = async(dest: Filer): Promise<void> => {
    return new Promise((resolve: () => void, reject: (error: any) => void) => {
      copyQueue.enqueue({
        to: dest.fullPath, 
        from: this.fullPath,
        callback: (error) => {
          if (error) {
            reject(error)
          } else {
            resolve();
          }
        }
      })
    });
  }

  /**
   * Performs a depth-first walk over the file structure with this as the
   * root node. Safe even if root node is a file.
   */
  public treeWalk = async(options: {
    onFile?: (file: Filer) => void,
    onDirectory?: (dir: Filer) => void,
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
  }
}
