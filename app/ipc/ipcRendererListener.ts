declare global {
  interface Window {
    ipcEvents: {
      listernForSave: (callback: (url: string) => void) => void;
    };
  }
}

export function registerIpcListener() {
  window.ipcEvents.listernForSave((url: string) => {
    console.log(url);
  });
}
