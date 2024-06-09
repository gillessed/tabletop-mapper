export interface QueueTask {
  callback: (error?: any) => void;
}

export class BlockingQueue<T> {
  public items: T[] = [];
  public callback: (item: T) => void | undefined = undefined;

  public constructor(initialCallback: (item: T) => void) {
    this.callback = initialCallback;
  }

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

export interface QueueConsumerOptions<T> {
  maxActiveTasks?: number;
  backingQueue?: BlockingQueue<T & QueueTask>;
}

export class QueueConsumer<T> {
  public maxActiveTaskCount: number;
  public activeTaskCount: number = 0;
  public waitingForConsume: boolean = false;
  public readonly queue: BlockingQueue<T & QueueTask>;
  constructor(
    public executor: (task: T) => Promise<void>,
    options: QueueConsumerOptions<T>,
  ) {
    const { backingQueue, maxActiveTasks } = options;
    if (backingQueue) {
      this.queue = backingQueue;
    } else {
      this.queue = new BlockingQueue<T & QueueTask>(this.consume);
    }
    this.maxActiveTaskCount = maxActiveTasks ?? 1;
  }

  public performTask(task: T): Promise<void> {
    return new Promise((resolve: () => void, reject: (err: any) => void) => {
      return this.queue.enqueue({
        ...task,
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

  public consume = (task: T & QueueTask) => {
    this.waitingForConsume = false;
    this.activeTaskCount++;
    this.executor(task).then(() => {
      task.callback();
      this.activeTaskCount--;
      this.attempt();
    });
    this.attempt();
  }

  public attempt = () => {
    if (!this.waitingForConsume && this.activeTaskCount < this.maxActiveTaskCount) {
      this.waitingForConsume = true;
      this.queue.dequeue(this.consume);
    }
  }
}