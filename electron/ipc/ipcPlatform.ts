import process from "process";
import { ipcMainHandle } from "./ipcMainHandler";
import { IpcChannels } from "../../app/ipc/ipcChannels";

export function registerIpcPlatformHandlers() {
  ipcMainHandle(IpcChannels.platformInfo, async () => {
    const separatorChar = process.platform === "win32" ? "\\" : "/";
    const appDirName = "tabletopMapper";
    const hostDataDirName =
      process.env.APPDATA ??
      (process.platform == "darwin"
        ? process.env.HOME + "/Library/Preferences"
        : process.env.HOME + "/.local/share");
    console.log("App dir:", hostDataDirName);
    const appDirPath = hostDataDirName + separatorChar + appDirName;

    return {
      os: process.platform,
      appDirPath,
      separatorChar,
    };
  });
}
