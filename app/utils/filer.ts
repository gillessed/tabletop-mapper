import { etn } from '../etn';
import { copyQueue } from './fileCopier';

function trimSlashesEnd(str: string) {
  let result = str;
  while (str.endsWith('/')) {
    result = result.substr(0, result.length - 1);
  }
  return result;
}

function trimSlashesStart(str: string) {
  let result = str;
  while (str.startsWith('/')) {
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
    return Filer.open(`${trimSlashesEnd(this.fullPath)}/${trimSlashesStart(file)}`);
  }

  public getParent(): Filer {
    const pathElements = this.fullPath.split('/');
    const parentElements = pathElements.slice(0, pathElements.length - 1);
    return Filer.open(parentElements.join('/'));
  }

  public getFilename(): string {
    const split = this.fullPath.split('/');
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
    return etn().util.promisify(etn().fs.exists)(this.fullPath);
  }
  
  public isDirectory = async (): Promise<boolean> => {
    return etn().util.promisify(etn().fs.lstat)(this.fullPath)
      .then((stats) => stats.isDirectory());
  }

  public deleteRecursive = async (): Promise<void> => {
    const isDirectory = await this.isDirectory();
    if (isDirectory) {
      const children = await this.readDir();
      for (const child of children) {
        await child.deleteRecursive();
      }
      return etn().util.promisify(etn().fs.rmdir)(this.fullPath);
    } else {
      return etn().util.promisify(etn().fs.unlink)(this.fullPath);
    }
  }

  public mkdirP = async (): Promise<void> => {
    const exists = await this.exists();
    if (exists) {
      return Promise.resolve();
    }
    const parent = this.getParent();
    await parent.mkdirP();
    return etn().util.promisify(etn().fs.mkdir)(this.fullPath);
  }

  public readDir = async (): Promise<Filer[]> => {
    return etn().util.promisify(etn().fs.readdir)(this.fullPath)
    .then((contents) => contents.map((file) => this.resolve(file)));
  }

  public writeFile = async(data: string): Promise<void> => {
    return etn().util.promisify(etn().fs.writeFile)(this.fullPath, data);
  }

  public readFile = async(): Promise<string> => {
    return etn().util.promisify(etn().fs.readFile)(this.fullPath, 'utf8');
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
