import { Ipc } from '../ipc/ipcCommands';
import { ipcInvoke } from '../ipc/ipcInvoke';

class Queue<T> {
  private items: T[] = [];
  private callback: (item: T) => void | undefined = undefined;

  public enqueue(item: T) {
    if (this.callback) {
      const callback = this.callback;
      this.callback = undefined;
      callback(item);
    } else {
      this.items.push(item);
    }
  }

  public dequeue(callback: (item: T) => void) {
    if (this.items.length >= 1) {
      callback(this.items.shift());
    } else {
      this.callback = callback;
    }
  }
}

export interface CopyTask {
  from: string;
  to: string;
  callback: (error?: any) => void;
}

export const copyQueue = new Queue<CopyTask>();

function attempt() {
  copyQueue.dequeue(consume);
}

function consume(copyTask: CopyTask) {
  copyFile(copyTask.from, copyTask.to).then(() => {
    copyTask.callback();
    attempt();
  }).catch((error) => {
    copyTask.callback(error);
    attempt();
  });
}

function copyFile(source: string, target: string): Promise<void> {
  return ipcInvoke(Ipc.CopyFile, source, target);
}

attempt();
