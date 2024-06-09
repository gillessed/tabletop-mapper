const { contextBridge, ipcRenderer } = require("electron");

window.onload = () => {
  contextBridge.exposeInMainWorld("ipc", {
    platformInfo: () => ipcRenderer.invoke("platform-info"),
    reload: () => ipcRenderer.invoke("reload-event"),
    copyFile: (arg) => ipcRenderer.invoke("copy-file", arg),
    exec: (arg) => ipcRenderer.invoke("exec", arg),
    getWindowId: (arg) => ipcRenderer.invoke("get-window-id", arg),
    closeWindow: (arg) => ipcRenderer.invoke("close-window", arg),
    getAppPath: (arg) => ipcRenderer.invoke("get-app-path", arg),
    quit: (arg) => ipcRenderer.invoke("quit", arg),

    //fs
    fsExists: (arg) => ipcRenderer.invoke("fs-exists", arg),
    fsIsDir: (arg) => ipcRenderer.invoke("fs-isDir", arg),
    fsReadDir: (arg) => ipcRenderer.invoke("fs-readdir", arg),
    fsMkdir: (arg) => ipcRenderer.invoke("fs-mkdir", arg),
    fsRmdir: (arg) => ipcRenderer.invoke("fs-rmdir", arg),
    fsUnlink: (arg) => ipcRenderer.invoke("fs-unlink", arg),
    fsReadFile: (arg) => ipcRenderer.invoke("fs-read-file", arg),
    fsWriteFile: (arg) => ipcRenderer.invoke("fs-write-file", arg),
    fsGetHash: (arg) => ipcRenderer.invoke("fs-get-hash", arg),
  });
};
