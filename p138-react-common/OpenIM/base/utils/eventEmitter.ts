/**
 * 简单的事件发射器
 * 用于 P138OpenIM 的事件通信
 */

export class EventEmitter {
  private events: Record<string, ((data: any) => void)[]> = {};

  /**
   * 监听事件
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // 返回取消监听的函数
    return () => this.off(event, callback);
  }

  /**
   * 取消监听
   */
  off(event: string, callback: (data: any) => void): void {
    if (!this.events[event]) return;
    
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  /**
   * 发射事件
   */
  emit(event: string, data?: any): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`事件 ${event} 回调执行失败:`, error);
      }
    });
  }

  /**
   * 清除所有监听
   */
  clear(): void {
    this.events = {};
  }

  /**
   * 清除指定事件的所有监听
   */
  clearEvent(event: string): void {
    delete this.events[event];
  }
}
