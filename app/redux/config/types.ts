import { etn } from '../../etn';
export interface Config {
    rootDirectory?: string;
}

export const JANNA_DB_FILENAME = 'janna-db.json';
export const JANNA_COVER_DIRNAME = 'covers';

export const ConfigPaths = {
    tagCoverDir: (rootDirectory?: string) => {
        return etn.path.join(checkRootDirectory(rootDirectory), JANNA_COVER_DIRNAME);
    },

    dbFile: (rootDirectory?: string) => {
        return etn.path.join(checkRootDirectory(rootDirectory), JANNA_DB_FILENAME);
    },

    subDir: (subDirName: string, rootDirectory: string) => {
        return etn.path.join(checkRootDirectory(rootDirectory), subDirName);
    },
}

function checkRootDirectory(rootDirectory?: string): string {
    if (!rootDirectory) {
        console.error('Root directory is null!');
        etn.app.quit();
    }
    return rootDirectory!;
}