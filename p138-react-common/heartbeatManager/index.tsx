 

let taskIdCounter = 0;

export interface HeartbeatTask {
  key: string;
  delay: number; // 倒计时时长（秒）
  callback: () => void;
  recurring?: boolean; // 是否循环执行（默认 true）
  triggerTime?: number; // 任务应在此时间戳触发
}

class HeartbeatManager {
  private timer: NodeJS.Timeout | null = null;
  private tasks: Map<string, HeartbeatTask> = new Map();

  /** 启动心跳调度器 */
  start(intervalMs = 1000) {
    if (this.timer) return;
    this.timer = setInterval(() => {
      // console.log('this.tasks', this.tasks);
      const now = Date.now();
      this.tasks.forEach((task, key) => {
        if (!task.triggerTime) return;
        if (now >= task.triggerTime) {
          try {
            task.callback();
          } catch (e) {
            console.error(`[heartbeat] task "${key}" error`, e);
          }

          if (task.recurring ?? true) {
            task.triggerTime = now + task.delay * 1000;
          } else {
            this.tasks.delete(key);
          }
        }
      });
    }, intervalMs);
  }

  /** 停止心跳调度器 */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** 注册一个倒计时任务 */
  register(task: HeartbeatTask) {
    if (this.tasks.has(task.key)) {
      console.warn(`[heartbeat] task with key "${task.key}" already exists.`);
      return;
    }
    const now = Date.now();
    task.triggerTime = now + task.delay * 1000;
    // 默认 recurring 为 true
    if (task.recurring === undefined) {
      task.recurring = true;
    }
    this.tasks.set(task.key, task);
  }

  /** 注册一个一次性匿名任务（自动生成 key） */
  registerOnce(delay: number, callback: () => void) {
    const key = `__temp_task_${taskIdCounter++}`;
    this.register({ key, delay, callback, recurring: false });
  }

  /** 注销一个任务 */
  unregister(key: string) {
    this.tasks.delete(key);
  }

  /** 获取任务剩余时间（秒） */
  getRemainingTime(key: string): number | null {
    const task = this.tasks.get(key);
    if (!task || !task.triggerTime) return null;
    const now = Date.now();
    return Math.max(0, Math.ceil((task.triggerTime - now) / 1000));
  }

  /** 清空所有任务并停止 */
  reset() {
    this.stop();
    this.tasks.clear();
  }
}

export const heartbeatManager = new HeartbeatManager();
