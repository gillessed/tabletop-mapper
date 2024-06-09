import { Api, IpcChannels } from "./ipcChannels";
import { isIpcError } from "./ipcError";

declare global {
  interface Window {
    ipc: Api<typeof IpcChannels>;
  }
}

let ipcWrapper: Api<typeof IpcChannels> | undefined = undefined;

function initializeIpcWrapper(): Api<typeof IpcChannels> {
  const wrapper: any = {};
  if (window.ipc == null) {
    throw Error("ipc is not being preloaded correctly");
  }
  for (const key of Object.keys(window.ipc)) {
    wrapper[key] = async (args: any) => {
      const result = await (window.ipc as any)[key](args);
      if (isIpcError(result) && result.type !== "NO_OP") {
        console.error(`error running ipc call: ${result.message}`, {
          key,
          args,
        });
        throw result;
      } else if (isIpcError(result) && result.type !== "NO_OP") {
        console.warn("Noop ipc", result);
      }
      return result;
    };
  }
  ipcWrapper = wrapper;
  return wrapper;
}

export const getIpc = () => {
  if (ipcWrapper == null) {
    return initializeIpcWrapper();
  } else {
    return ipcWrapper;
  }
};
