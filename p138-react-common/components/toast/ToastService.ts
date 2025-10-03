// src/components/toast/ToastService.ts
type ToastListener = (message: string, duration: number, position: "top" | "bottom" | "center") => void;

let toastListener: ToastListener | null = null;
const pendingQueue: Array<{ message: string; duration: number; position: "top" | "bottom" | "center" }> = [];

export const ToastService = {
  registerToastListener(listener: ToastListener) {
    if (!toastListener) {
      toastListener = listener; // 确保只注册一次
      // flush pending
      if (pendingQueue.length) {
        const items = pendingQueue.splice(0, pendingQueue.length);
        items.forEach(({ message, duration, position }) => listener(message, duration, position));
      }
    }
  },
  removeToastListener() {
    toastListener = null; // 清除监听器
  },
  show(message: string, duration: number = 3000, position: "top" | "bottom" | "center" = "center") {
 
    if (toastListener) {
      toastListener(message, duration, position); // 调用注册的 listener
    } else {
      // 未注册时暂存，注册后自动回放，避免丢消息
      pendingQueue.push({ message, duration, position });
    }
  },
};

// **暴露为全局变量**
if (typeof global !== "undefined") {
  global.Toast = ToastService; // 将 ToastService 暴露为 `global.toast`
}
