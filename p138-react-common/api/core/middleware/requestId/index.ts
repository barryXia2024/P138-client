import {DeviceIdGenerator} from '@/utils/device';

export const requestIdMiddleware: P138Api.IMiddleware = {
  name: 'requestId',
  async onRequest(context) {
    if (!context.request) return;

    const whiteList = [
      '/api/v1/users/auth/captcha',
      '/api/v1/crypto/get/enable',
      '/api/v1/auth/captcha',
      '/api/v1/sys-management/auth/captcha',
      '/api/v1/auth/decode-referral-info',
      '/api/v1/users/auth/decode-referral-info',
      '/api/v1/users/auth/reset/password',
      '/api/v1/oss/get-app-download-auth'
    ];
    if (whiteList.includes(context.request.url)) {
      const requestId = await new DeviceIdGenerator().generateSnowflakeId();
      context.request.header = {
        ...context.request.header,
        'X-Request-ID': requestId,
 
      };
      return;
    }
    const requestId = await new DeviceIdGenerator().generateSnowflakeId();
    let deviceId = '';

    if (
      [
        '/api/v1/auth/sign-in',
        '/api/v1/users/auth/sign-in',
        '/api/v1/sys-management/auth/sign-in',
      ].includes(context.request.url)
    ) {
      const userName = context.request.data?.username;

      deviceId = await new DeviceIdGenerator().getDeviceIdWithUserName(
        userName,
      );
    } else {
      deviceId = await new DeviceIdGenerator().getDeviceIdWithUserName();
    }

    context.request.header = {
      ...context.request.header,
      'X-Request-ID': requestId,
      'X-Device-ID': deviceId,
    };
  },
};
