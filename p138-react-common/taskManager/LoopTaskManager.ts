import {clockManager} from './ClockManager';

function getAlignedTriggerTimeSec(now: number, delayMs: number): number {
  const raw = now + delayMs;
  return Math.ceil(raw / 1000);
}

interface LoopTask {
  key: string;
  intervalSec: number;
  callback: () => void;
  triggerTime: number;
  once?: boolean;
  paused?: boolean;
  maxExecutions?: number;
  executionCount?: number;
  startDelayMs?: number;
  tag?: string;
}

interface RegisterTaskOptions {
  key: string;
  intervalSec: number;
  callback: () => void;
  once?: boolean;
  paused?: boolean;
  maxExecutions?: number;
  startDelayMs?: number;
  tag?: string;
}

interface UpdateTaskOptions
  extends Partial<Omit<RegisterTaskOptions, 'key' | 'callback'>> {
  callback?: () => void;
}

class LoopTaskManager {
  private taskMap = new Map<number, Set<LoopTask>>();
  private keyIndex = new Map<string, LoopTask>();
  private now: number = clockManager.getAlignedNowSec();

  constructor() {
    clockManager.subscribe(this.tick);
  }

  register({
    key,
    intervalSec,
    callback,
    once = false,
    paused = false,
    maxExecutions,
    startDelayMs = 0,
    tag,
  }: RegisterTaskOptions): void {
    const now = clockManager.getNow();
    const firstDelay = startDelayMs > 0 ? startDelayMs : intervalSec * 1000;
    const triggerTime = getAlignedTriggerTimeSec(now, firstDelay);
    const task: LoopTask = {
      key,
      intervalSec,
      callback,
      triggerTime,
      once,
      paused,
      maxExecutions,
      executionCount: 0,
      startDelayMs,
      tag,
    };
    this.keyIndex.set(key, task);
    if (!paused) this.addTask(task);
  }

  update(key: string, updates: UpdateTaskOptions): void {
    const task = this.keyIndex.get(key);
    if (!task) return;
    Object.assign(task, updates);
    if (!task.paused) {
      this.unregister(key);
      const now = clockManager.getNow();
      const firstDelay = task.startDelayMs ?? task.intervalSec * 1000;
      task.triggerTime = getAlignedTriggerTimeSec(now, firstDelay);
      this.addTask(task);
    }
  }

  unregister(key: string): void {
    const task = this.keyIndex.get(key);
    if (task) {
      for (const [time, bucket] of this.taskMap.entries()) {
        if (bucket.has(task)) {
          bucket.delete(task);
          if (bucket.size === 0) this.taskMap.delete(time);
        }
      }
      this.keyIndex.delete(key);
    }
  }

  pause(key: string): void {
    const task = this.keyIndex.get(key);
    if (task) {
      task.paused = true;
      this.unregister(key);
    }
  }

  resume(key: string): void {
    const task = this.keyIndex.get(key);
    if (task && task.paused) {
      task.paused = false;
      const now = clockManager.getNow();
      const firstDelay = task.startDelayMs ?? task.intervalSec * 1000;
      task.triggerTime = getAlignedTriggerTimeSec(now, firstDelay);
      this.addTask(task);
    }
  }

  getAllTasks(): LoopTask[] {
    return Array.from(this.keyIndex.values());
  }

  getTasksByTag(tag: string): LoopTask[] {
    return Array.from(this.keyIndex.values()).filter(task => task.tag === tag);
  }

  private addTask(task: LoopTask): void {
    const timeKey = task.triggerTime;
    if (!this.taskMap.has(timeKey)) {
      this.taskMap.set(timeKey, new Set());
    }
    this.taskMap.get(timeKey)!.add(task);
  }

  private tick = (nowMs: number): void => {
    this.now = Math.ceil(nowMs / 1000);
    const bucket = this.taskMap.get(this.now);

    // console.log('bucket', bucket,this.taskMap,this.now);
    if (!bucket) return;

    bucket.forEach(task => {
      if (task.paused) return;
      try {
        task.callback();
      } catch (e) {
        console.error(`[loop-task error] key=${task.key}`, e);
      }
      task.executionCount = (task.executionCount ?? 0) + 1;
      const reachLimit =
        task.once ||
        (task.maxExecutions !== undefined &&
          task.executionCount >= task.maxExecutions);
      if (!reachLimit) {
        task.triggerTime = this.now + task.intervalSec;
        this.addTask(task);
      } else {
        this.keyIndex.delete(task.key);
      }
    });

    this.taskMap.delete(this.now);
  };
}

export const loopTaskManager = new LoopTaskManager();
