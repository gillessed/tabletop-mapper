import { exec } from "child_process";
import fs from "fs";
import { IpcChannels, IpcCopyFileArgs } from "../../app/ipc/ipcChannels";
import { IpcError } from "../../app/ipc/ipcError";
import { ipcMainHandle } from "./ipcMainHandler";

export function registerIpcFileHandlers() {
  ipcMainHandle(IpcChannels.exec, async (command: string) => {
    return new Promise((resolve: () => void) => {
      exec(command, () => {
        resolve();
      });
    });
  });

  ipcMainHandle(
    IpcChannels.copyFile,
    async ({ filename, destination }: IpcCopyFileArgs) => {
      let done = false;
      return new Promise((resolve: (error?: IpcError) => void) => {
        let readStream = fs.createReadStream(filename);
        readStream.once("error", (error: any) => {
          console.log(error);
          resolve({ isError: true, type: "FAILURE", message: error.message });
        });

        let writeStream = fs.createWriteStream(destination);
        writeStream.once("error", (error: any) => {
          console.log(error);
          resolve({ isError: true, type: "FAILURE", message: error.message });
        });
        writeStream.once("close", () => {
          if (!done) {
            done = true;
            resolve();
          }
        });

        readStream.pipe(writeStream);
      });
    }
  );
}
