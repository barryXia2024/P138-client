import murmur from 'murmurhash3js';
import cryptoHelper from './cryptoHelper';
import CryptoJS from 'crypto-js';

/**
 * 序列化对象为 URL 查询参数字符串（支持嵌套一层）
 *
 * @param {Object} obj - 参数对象
 * @returns {string} - query 字符串
 */
function serializeNestedQuery(obj: Record<string, any>) {
  const result: string[] = [];

  const keys = Object.keys(obj).sort();

  keys
    .filter(key => obj[key] !== undefined && (obj[key] || obj[key] === 0))
    .forEach(key => {
      let value = obj[key];
      if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      }

      if (Object.prototype.toString.call(value) === '[object Object]') {
        Object.keys(value)
          .filter(subKey => value[subKey] || value[subKey] === 0)
          .forEach(subKey => {
            const compoundKey = `${key}[${subKey}]`;
            result.push(
              `${encodeURIComponent(compoundKey)}=${encodeURIComponent(value[subKey])}`,
            );
          });
      } else {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });

  return result.join('&');
}

const XCaNonceSDK = {
  /**
   * AES 解密 hex 字符串，得到密钥（c）
   * @param {string} hexStr - 十六进制密文
   * @param {string} aesSecret - AES 密钥（如 "enduresurv1ve"）
   * @returns {string} 解密后的明文 key
   */
  decryptKey(hexStr: string, aesSecret: string) {
    const key = CryptoJS.enc.Utf8.parse(aesSecret);
    const iv = CryptoJS.enc.Utf8.parse(aesSecret.substring(0, 16));
    const hex = CryptoJS.enc.Hex.parse(hexStr);
    const base64 = CryptoJS.enc.Base64.stringify(hex);
    const decrypted = CryptoJS.AES.decrypt(base64, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },

  /**
   * 生成 x-ca-nonce 哈希值
   * @param {object} options
   * @param {string} options.path - 请求路径
   * @param {object|null} options.params - GET 参数对象
   * @param {number} options.timestamp - 时间戳
   * @param {{
   *   encryptedKeyHex: string,
   *   aesKey: string,
   *   aesIV: string
   * }} options.cryptoInfo - 加密信息
   * @param {boolean} options.isGet - 是否为 GET 请求
   * @returns {string} x-ca-nonce 签名值
   */
  generateNonce({
    path,
    params,
    timestamp,
    body,
    cryptoInfo,
    isGet = true,
  }: {
    path: string;
    params: object;
    timestamp: number;
    body: object | null;
    cryptoInfo: {
      encryptedKeyHex: string;
      aesKey: string;
      aesIV: string;
    };
    isGet: boolean;
  }) {
    const key = cryptoHelper.decrypt(
      cryptoInfo.encryptedKeyHex,
      cryptoInfo.aesKey,
      cryptoInfo.aesIV,
    );
    console.log(key);
    const fullPath = this.buildFullPath(path, params, isGet);
    console.log('fullPath', fullPath);
    // const bodyStr = !isGet && body ? JSON.stringify(this.stable(body)) : "";
    const bodyStr = !isGet && body ? JSON.stringify(body) : '';
    console.log('bodyStr====', bodyStr);
    const signStr =
      fullPath + cryptoInfo.encryptedKeyHex + timestamp + bodyStr + key;
    console.log('signStr====', signStr);
    const base64Str = cryptoHelper.toBase64(signStr);
    console.log('base64Str====', base64Str);
    console.log('murmur====', murmur);
    const result = murmur.x64.hash128(base64Str);
    console.log('result====', result);
    return result;
  },

  /**
   * 构建 URL，带 GET 参数或清理路径
   */
  buildFullPath(url: string, params: object, isGet: boolean) {
    if (isGet && params) {
      const query = serializeNestedQuery(params);
      return query ? `${url}?${query}` : url;
    }
    const cleaned = url.endsWith('?') ? url.slice(0, -1) : url;
    return encodeURI(cleaned);
  },

  /**
   * 将对象稳定排序后序列化
   */
  // stable(obj) {
  //   return Object.keys(obj).sort().reduce((res, k) => {
  //     res[k] = obj[k];
  //     return res;
  //   }, {});
  // },

  /**
   * GET 参数序列化函数
   */
  serializeQuery(params: Record<string, any>) {
    return Object.keys(params)
      .sort()
      .map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
  },
};

export default XCaNonceSDK;
