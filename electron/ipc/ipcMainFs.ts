import crypto from "crypto";
import fs from "fs";
import { ipcMainHandle } from "./ipcMainHandler";
import { IpcChannels } from "../../app/ipc/ipcChannels";
import { IpcError } from "../../app/ipc/ipcError";

export function registerIpcFsHandlers() {
  ipcMainHandle(IpcChannels.fsExists, async (path: string) => {
    return new Promise((resolve: (result: boolean | IpcError) => void) => {
      fs.lstat(path, (error) => {
        if (error == null) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  });

  ipcMainHandle(IpcChannels.fsIsDir, async (path: string) => {
    return new Promise((resolve: (result: boolean | IpcError) => void) => {
      fs.lstat(path, (error, stats) => {
        if (error == null) {
          resolve(stats.isDirectory());
        } else {
          resolve({ isError: true, message: error.message, type: "FAILURE" });
        }
      });
    });
  });

  ipcMainHandle(IpcChannels.fsMkdir, async (path: string) => {
    return new Promise((resolve: (error?: IpcError) => void) => {
      fs.mkdir(path, (error) => {
        if (error == null) {
          resolve();
        } else {
          resolve({ isError: true, message: error.message, type: "NO_OP" });
        }
      });
    });
  });

  ipcMainHandle(IpcChannels.fsReadDir, async (path: string) => {
    return new Promise((resolve: (result: string[] | IpcError) => void) => {
      fs.readdir(path, (error, files) => {
        if (error == null) {
          resolve(files);
        } else {
          resolve({ isError: true, message: error.message, type: "NO_OP" });
        }
      });
    });
  });

  ipcMainHandle(IpcChannels.fsRmdir, async (path: string) => {
    return new Promise((resolve: (ipcError?: IpcError) => void) => {
      fs.rmdir(path, (error) => {
        if (error == null) {
          resolve();
        } else {
          resolve({
            isError: true,
            message: "Error with rmdir " + error.message,
            type: "NO_OP",
          });
        }
      });
    });
  });

  ipcMainHandle(IpcChannels.fsUnlink, async (path: string) => {
    return new Promise((resolve: (ipcError?: IpcError) => void) => {
      fs.unlink(path, (error) => {
        if (error == null) {
          resolve();
        } else {
          resolve({
            isError: true,
            message: "Error with unlink " + error.message,
            type: "NO_OP",
          });
        }
      });
    });
  });

  ipcMainHandle(IpcChannels.fsReadFile, async (path: string) => {
    return fs.promises.readFile(path, "utf-8");
  });

  ipcMainHandle(IpcChannels.fsWriteFile, async ({ path, data }) => {
    return fs.promises.writeFile(path, data);
  });

  ipcMainHandle(IpcChannels.fsGetHash, async ({ path, hashName }) => {
    return new Promise(
      (resolve: (value: string) => void, reject: (err: any) => void) => {
        const hashStream = crypto.createHash(hashName ?? "md5");
        const fileStream = fs.createReadStream(path);
        hashStream.once("readable", () => {
          const hashValue = hashStream.read().toString("hex");
          resolve(hashValue);
        });
        fileStream.pipe(hashStream);
      }
    );
  });
}
