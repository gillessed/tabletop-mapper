import { Filer } from "./filer";
import { etn } from "../etn";

let appDir: Filer | undefined;

const appDirName = 'tabletopMapper';

export function getAppDir(): Filer {
  if (appDir == null) {
    const hostDataDirName = etn().process.env.APPDATA ??
      (etn().process.platform == 'darwin'
        ? (etn().process.env.HOME + '/Library/Preferences')
        : (etn().process.env.HOME + "/.local/share")
      );
    appDir = Filer.open(hostDataDirName).resolve(appDirName);
  }
  return appDir;
}
