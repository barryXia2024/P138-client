// src/components/toast/ToastContext.tsx
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {ToastService} from './ToastService'; // 引入 ToastService

interface ToastContextType {
  showToast: (
    message: string,
    duration?: number,
    position?: 'top' | 'bottom' | 'center',
  ) => void;
  hideToast: () => void;
  visible: boolean;
  message: string;
  position: 'top' | 'bottom' | 'center';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children}: {children: ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState<'top' | 'bottom' | 'center'>(
    'center',
  );

  const showToast = useCallback(
    (
      message: string,
      duration: number = 3000,
      position: 'top' | 'bottom' | 'center' = 'center',
    ) => {
 
      setMessage(message);
      setPosition(position);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, duration);
    },
    [],
  );

  const hideToast = useCallback(() => setVisible(false), []);

  useEffect(() => {
    console.log('ToastProvider useEffect register once');
    // 只在组件挂载时注册 showToast
    ToastService.registerToastListener(showToast);

    // 组件卸载时移除监听
    return () => {
      console.log('ToastProvider useEffect removeToastListener');
      ToastService.removeToastListener();
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{showToast, hideToast, visible, message, position}}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
