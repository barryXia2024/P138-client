import {getEnableRequestParamCryptoInfoApi} from '@/api/interface/crypto';
import {defaultAesSecretInfo, ErrorType} from './encryp/constants';
import {decrypt, encrypt} from './encryp/utils';
// import { getEncryptionKey } from './encryp/request';
import XCaNonceSDK from './encryp/utils/xCaNonce';
import { removeUndefinedOrEmpty } from '../client';

// import HeaderFieldHelper from '@/p138-common/api/utils/encrytorUtils/HeaderFieldHelper'; // 如有
// const accessToken =
//   'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjoxMDA0ODg1OTYsInVzZXJfa2V5IjoiMzY2ZTk4NGUtMTQ1MS00YWZhLThjZTUtMmU1MDhlMWQ0ZmJiIiwiZGV2aWNlSWQiOiIxNzQ4MDY4MzM2OTUwNzQyNzI0NyIsInBsYXRmb3JtIjoiQXBwIiwidXNlcm5hbWUiOiIxMzY1NzcyNjg1NiJ9.ENpk7md1Amh_t_ugTio51vQGWZ3g_vV_JHMb401FJpLW-7xHatz66Kky3d3PtZHAZdufgT7Zr0sPDUntMgWDUQ';
// // 根据平台动态导入requestId中间件

//说明
//TypeDecryptRequestParamFailed HTTPS解密失败
// X-Crypto-Switch  是否是加密请求
let cryptoInfo: ProductDatasourceHelper.GetEnabledRequestParamCryptoInfoResult | null =
  null;

let isCryptoSame: boolean = false;
let isGettingCryptoInfo: boolean = false;

// 🔷 公共的更新逻辑
const updateCryptoInfo = async (now: number) => {
  try {
    if (isGettingCryptoInfo) return;
    isGettingCryptoInfo = true;
    setTimeout(() => {
      isGettingCryptoInfo = false;
    }, 500);
    const res = await getEnableRequestParamCryptoInfoApi();

    if (res.success && res.data) {
      const newCryptoInfo = {
        encryptedKeyHex: decrypt(
          res.data.encryptedKeyHex,
          defaultAesSecretInfo.xxTeaSecret,
        ),
        xxTeaSecret: decrypt(
          res.data.xxTeaSecret,
          defaultAesSecretInfo.xxTeaSecret,
        ),
        aesIV: decrypt(res.data.aesIV, defaultAesSecretInfo.xxTeaSecret),
        aesKey: decrypt(res.data.aesKey, defaultAesSecretInfo.xxTeaSecret),
        requestParamCryptoStatus: res.data.requestParamCryptoStatus,
      };

      // 只有数据不同才更新
      if (JSON.stringify(newCryptoInfo) !== JSON.stringify(cryptoInfo)) {
        cryptoInfo = newCryptoInfo;
        isCryptoSame = false;
      } else {
        isCryptoSame = true;
      }
    }
  } catch (e) {
    console.error('请求加密信息失败：', e);
  }
};

const getCryptoInfo = async (isHttpsError: boolean = false) => {
  const now = Date.now();
  // const EXPIRE_TIME = 300000; // 5分钟

  // ✅ 如果缓存为空，直接请求更新
  if (!cryptoInfo) {
    console.log('缓存为空，先去请求更新密钥。');
    await updateCryptoInfo(now);
    return cryptoInfo;
  }

  // ✅ 正常请求时，直接返回缓存
  if (!isHttpsError) {
    return cryptoInfo;
  }

  // ✅ isHttpsError=true时，5分钟内不重复请求
  if (isCryptoSame) {
    console.log('加密错误5分钟内已更新过，使用缓存。');
    return cryptoInfo;
  }
  isCryptoSame = false;

  // ✅ 5分钟外，才真正请求更新
  await updateCryptoInfo(now);
  return cryptoInfo;
};

export const debounceGetCryptoInfo = getCryptoInfo;

export const encryptMiddleware: P138Api.IMiddleware = {
  name: 'encryptMiddleware',
  async onRequest(ctx) {
    if (!ctx.request) return;

    /**
     * 不加密的接口
     */
    if (ctx.request.url.includes('/api/v1/crypto')) {
      ctx.request.header!['X-Crypto-Switch'] = '2';
      return;
    }



    const cryptoInfo = await debounceGetCryptoInfo();

    // 2为开启
    if (
      !cryptoInfo ||
      !cryptoInfo.requestParamCryptoStatus ||
      cryptoInfo.requestParamCryptoStatus === 1
    ) {
      ctx.request.header!['X-Crypto-Switch'] = '2';
      return;
    }
    if (!(ctx.request?.data instanceof FormData)) {
      ctx.request.data = removeUndefinedOrEmpty(ctx.request?.data);
    }
    ctx.request.params = removeUndefinedOrEmpty(ctx.request?.params);
    const body =
      ctx.request.method === 'GET' ? ctx.request.params : ctx.request.data;
    // 1. 处理 GET
    if (ctx.request.method === 'GET' && ctx.request.params) {
      const queryString = Object.keys(ctx.request.params)
        .sort()
        .map(
          key =>
            `${encodeURIComponent(key)}=${encodeURIComponent(ctx.request?.params?.[key])}`,
        )
        .join('&');
      console.log('queryString', queryString);

      const encrypted = encrypt(queryString, cryptoInfo.xxTeaSecret);
      ctx.request.url =
        ctx.request.url.replace(/[?&]$/, '') +
        '?' +
        encodeURIComponent(encrypted);
      ctx.request.params = {};
    }

    // let aesSecret = decrypt(cryptoInfo.xxTeaSecret, defaultAesSecretInfo.xxTeaSecret);
    // if (!aesSecret) {
    //   aesSecret = cryptoInfo.xxTeaSecret;
    // }

    // 2. 处理 POST
    if (ctx.request.method !== 'GET' && ctx.request.data) {
      const dataJson = JSON.stringify(ctx.request.data);
      const encrypted = encrypt(dataJson, cryptoInfo.xxTeaSecret);
      ctx.request.data = encrypted;
      ctx.request.header!['Content-Type'] = 'text/plain'; //使用application 会导致变成字典
    }
    // console.log('ctx.request.method', dict, ctx.request);
    const path = ctx.request.url.split('?')[0];
    // const params = ctx.request.params; // GET参数对象，如果有的话

    const encryptedKeyHex = cryptoInfo.encryptedKeyHex; // 你的密钥

    console.log(
      defaultAesSecretInfo.encryptedKeyHex,
      'cryptoInfo.encryptedKeyHex',
    );
    const isGet = ctx.request.method === 'GET';

    const timestamp = Date.now();
    // const path = "/competition/luck/homePage/getHomeBdCompetition";
    // const params = { playType: 1 };
    // const isGet = true;
    //重新登录
    // 生成 x-ca-nonce 签名

    let replacePath = path.replace('/api/v1', '');
    console.log(replacePath, 'replacePath', body);
    const xCaNonce = XCaNonceSDK.generateNonce({
      path: replacePath,
      params: body,
      timestamp,
      body: body,
      cryptoInfo: {
        encryptedKeyHex,
        aesKey: cryptoInfo?.aesKey ?? defaultAesSecretInfo.aesKey,
        aesIV: cryptoInfo?.aesIV ?? defaultAesSecretInfo.aesIV,
      },
      isGet,
    });

    ctx.request.header!['X-Ca-Key'] = Math.random().toString(16).slice(3);
    ctx.request.header!['X-Ca-Timestamp'] = timestamp.toString();
    ctx.request.header!['X-Ca-Nonce'] = xCaNonce;
    ctx.request.header!['X-Crypto-Switch'] = '1';
    ctx.request.header!['Platform'] = 'App';
    // ctx.request.header!['Authorization'] = accessToken;
    ctx.request.header!['Client-Type'] = 'user_h5';
  },
  async onResponse(ctx: any) {
    // 暂时不需要解密
    // console.log(ctx.response, 'ctx.response');
    // if (ctx.response && typeof ctx.response.data === 'string') {
    //   ctx.response.data = cryptoHelper.decrypt(
    //     ctx.response.data,
    //     cryptoInfo?.aesKey ?? defaultAesSecretInfo.aesKey,
    //     cryptoInfo?.aesIV ?? defaultAesSecretInfo.aesIV,
    //   );
    // }
  },
  async onError(ctx) {
    const {error} = ctx;
    if (!error) return;
    console.log(error, ctx, 'data');
    const {response} = error;

    // 如果是60000，则可能秘钥变更或错误需要重新请求秘钥，比对新老秘钥，如果一样则秘钥没有问题，参数问题。如果不一样替换
    if (
      response?.data?.error?.type === ErrorType.TypeDecryptRequestParamFailed
    ) {
      await debounceGetCryptoInfo(true);
      return;
    }
  },
};
