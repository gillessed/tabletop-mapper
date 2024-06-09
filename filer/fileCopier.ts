import { getIpc } from "../app/ipc/ipc";
import { BlockingQueue } from "./blockingQueue";

export type FileCopyQueue = BlockingQueue<CopyTaskInternal>;

export interface CopyTask {
  from: string;
  to: string;
}

export interface CopyTaskInternal extends CopyTask {
  callback: (error?: any) => void;
}

export class FileCopier {
  private readonly queue: FileCopyQueue;
  constructor(backingQueue?: FileCopyQueue) {
    if (backingQueue) {
      this.queue = backingQueue;
    } else {
      this.queue = new BlockingQueue<CopyTaskInternal>(this.consume);
    }
  }

  public copyFile(copyTask: CopyTask): Promise<void> {
    return new Promise((resolve: () => void, reject: (err: any) => void) => {
      this.queue.enqueue({
        ...copyTask,
        callback: (error?: any) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      });
    });
  }

  private attempt = () => {
    this.queue.dequeue(this.consume);
  };

  private consume = (copyTask: CopyTaskInternal) => {
    copyFile(copyTask.from, copyTask.to)
      .then(() => {
        copyTask.callback();
        this.attempt();
      })
      .catch((error) => {
        copyTask.callback(error);
        this.attempt();
      });
  };
}

export function copyFile(source: string, target: string): Promise<void> {
  return getIpc().copyFile({ filename: source, destination: target });
}
