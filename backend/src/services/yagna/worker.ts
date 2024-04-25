import {
  Allocation,
  WorkContext,
  ActivityStateEnum,
} from "@golem-sdk/golem-js";
import { BehaviorSubject } from "rxjs";

type WorkerType = {
  context: WorkContext;
  setState: (newState: "busy" | "free" | "connecting") => void;
  getState: () => string;
  isFree: (fileId: string) => Promise<void>;
  isConnected: () => Promise<void>;
  queue: any[];
  addFileToQueue: (fileId: string) => void;
};
//@ts-ignore
let executor;
export class Worker {
  constructor(public context?: WorkContext) {}
  private stateSubject: BehaviorSubject<string> = new BehaviorSubject(
    "connecting"
  );
  state$ = this.stateSubject.asObservable();
  private queue: any[] = [];

  addFileToQueue(fileId: string) {
    this.queue.push(fileId);
  }

  pullFileFromQueue(fileId: string) {
    this.queue = this.queue.filter((id) => id !== fileId);
  }

  setState(newState: "busy" | "free" | "connecting") {
    this.stateSubject.next(newState);
  }

  getState() {
    return this.stateSubject.value;
  }

  isFree(fileId: string): Promise<void> {
    return new Promise((resolve) => {
      const subscription = this.state$.subscribe((state) => {
        const isFirstInQueue = this.queue[this.queue.length - 1] === fileId;
        if (state === "free" && isFirstInQueue) {
          resolve();
        }
      });
    });
  }
  isConnected(): Promise<boolean> {
    return new Promise((resolve) => {
      const subscription = this.state$.subscribe(async (state) => {
        if (state !== "connecting") {
          const state = await this.context?.getState();
          resolve(ActivityStateEnum.Ready === state);
        }
      });
    });
  }
}
