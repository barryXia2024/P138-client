import {AxiosError} from 'axios';
import {ErrorType} from './encryp/constants';

export const errorMiddleware: P138Api.IMiddleware = {
  name: 'error',
  async onError(context) {
    const {error, config} = context;

    if (!error) return;
    if (error.code === AxiosError.ERR_NETWORK) {
      // config.toast.error(` ${JSON.stringify(error)}`);
      config.toast.error(`网络链接异常，请稍后再试 ！  `);
      // setTimeout(() => {
      //   config.toast.error(` ${JSON.stringify(error)}`);
      // }, 5000);

      // 设置一个默认响应，防止错误继续传播
      context.response = {
        data: {success: false, message: error.message},
      } as any;
      return;
    }

    // 处理网络错误
    if (!error.response) {
      config.toast.error(`${error.message} ${error.response} ${error} `);

      // 设置一个默认响应，防止错误继续传播
      context.response = {
        data: {success: false, message: error.message},
      } as any;
      return;
    }

    const {status, data} = error.response;
    console.log('error', data);
    // 处理HTTP错误
    switch (status) {
      case 400:
        if (data.error?.type === ErrorType.TypeDecryptRequestParamFailed) {
          context.response = {
            data: {success: false, message: error.message},
          } as any;
          break;
        }
        if(data.error?.message === '没有找到任何代理'){
          context.response = {
            data: {success: true, message: error.message},
          } as any;
          break;
        }
        config.toast.error(
          data.message || data.error?.message || '请求参数错误',
        );
        // 设置一个默认响应，防止错误继续传播
        context.response = {
          data: {
            success: false,
            message: data.error?.message || '请求参数错误',
          },
        } as any;
        break;
      // 401 未授权 - 让token中间件处理，这里只显示提示
      case 401:
        // 只显示错误提示，不执行登出操作，让token中间件处理
        config.toast.error('登录已过期，请重新登录');
        // 设置一个默认响应，防止错误继续传播
        context.error = {
          code: 401,
          message: '登录已过期，请重新登录',
        };
        context.response = {
          data: {
            success: false,
            message: '登录已过期，请重新登录',
          },
        } as any;

        return;
        
      case 403:
        config.toast.error(data.error?.message || '没有权限访问');
        // 设置一个默认响应，防止错误继续传播
        context.response = {
          data: {
            success: false,
            message: data.error?.message || '没有权限访问',
          },
        } as any;
        break;
      case 404:
        config.toast.error(data.error?.message || '请求的资源不存在');
        // 设置一个默认响应，防止错误继续传播
        context.response = {
          data: {
            success: false,
            message: data.error?.message || '请求的资源不存在',
          },
        } as any;
        break;
      case 500:
        config.toast.error(data.message || '网络连接失败，请稍后重试');
        // 设置一个默认响应，防止错误继续传播
        context.response = {
          data: {
            success: false,
            message: data.error?.message || '服务器错误，请稍后重试',
          },
        } as any;
        break;
      default:
        // config.toast.error(data?.error?.message || '请求失败，请稍后重试');
        // // 设置一个默认响应，防止错误继续传播
        // context.response = {
        //   data: {
        //     success: false,
        //     message: data?.error?.message || '请求失败，请稍后重试',
        //   },
        // } as any;
        break;
    }
  },
};
