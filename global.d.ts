// global.d.ts
import { ToastService } from "./p138-react-common/components/toast/ToastService"; // 引入 ToastService 类型

declare global {
  var Toast: typeof ToastService; // 扩展 globalThis，允许 toast.show() 调用
}
