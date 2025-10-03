
/**
 * @file ClockManager
 * @description 全局时间心跳控制器，每 intervalMs 毫秒广播一次当前时间
 */
class ClockManager {
  private timer: NodeJS.Timeout | null = null;
  private listeners = new Set<(now: number) => void>();
  private currentNow: number = Date.now();

  /**
   * 启动时钟 每 intervalMs 毫秒广播一次当前时间
   * @param {number} [intervalMs=1000] - 广播间隔时间，单位毫秒 默认1秒
   * @returns {void}
   */
  start(intervalMs = 1000): void {
    if (this.timer) return;
    this.currentNow = Date.now();
    this.timer = setInterval(() => {
      this.currentNow = Date.now();
      this.listeners.forEach(fn => fn(this.currentNow));
    }, intervalMs);
  }

  /**
   * 停止时钟
   * @returns {void}
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * 获取当前时钟时间（毫秒）
   * @returns {number}
   */
  getNow(): number {
    return this.currentNow;
  }

  /**
   * 获取当前对齐后的时间（单位：秒）
   * @returns {number}
   */
  getAlignedNowSec(): number {
    return Math.ceil(this.currentNow / 1000);
  }

  /**
   * 订阅时钟信号
   * @param {(now: number) => void} fn - 每次 tick 时调用的回调
   * @returns {() => void} 取消订阅函数
   */
  subscribe(fn: (now: number) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const clockManager = new ClockManager();
