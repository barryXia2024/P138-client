import {env} from '@/config/env';

export const setWindowsLocation = () => {
  // 手机端没有location，所以需要手动设置配置
  if (typeof window !== 'undefined' && !window.location) {
    window.location = {
      protocol: 'https:',
      host: env.H5_Client_URL,
      hostname: env.H5_Client_URL,
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      href: env.H5_Client_URL,
      origin: env.H5_Client_URL,
      assign: () => {},
      replace: () => {
        return '';
      },
      reload: () => {},
    };
  }
};
