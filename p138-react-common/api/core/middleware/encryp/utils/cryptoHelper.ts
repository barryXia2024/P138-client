import CryptoJS from 'crypto-js';


// 固定密钥和 IV（必须 16 字节）
// export const AES_KEY = CryptoJS.enc.Utf8.parse(defaultAesSecretInfo.aesKey); 
// export const AES_IV = CryptoJS.enc.Utf8.parse(defaultAesSecretInfo.aesIV);
const cryptoHelper = {

  getAesKey: function (aesKey: string) {
    return CryptoJS.enc.Utf8.parse(aesKey);

  },
  getAesIV: function (aesIV: string) {
    return CryptoJS.enc.Utf8.parse(aesIV);
  },



  /**
   * AES 解密（输入为 HEX 字符串）
   */
  decrypt: function (hexStr: string, aesKey: string, aesIV: string) {
    const AES_KEY = this.getAesKey(aesKey);
    const AES_IV = this.getAesIV(aesIV);
    const hex = CryptoJS.enc.Hex.parse(hexStr); // HEX -> WordArray
    const base64Str = CryptoJS.enc.Base64.stringify(hex); // WordArray -> Base64
    const decrypted = CryptoJS.AES.decrypt(base64Str, AES_KEY, {
      iv: AES_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8); // 解密并转为字符串
  },

  /**
   * AES 加密（输出为大写 HEX 字符串）
   */
  encrypt: function (plainText: string, aesKey: string, aesIV: string) {
    const AES_KEY = this.getAesKey(aesKey);
    const AES_IV = this.getAesIV(aesIV);
    const utf8Data = CryptoJS.enc.Utf8.parse(plainText);
    const encrypted = CryptoJS.AES.encrypt(utf8Data, AES_KEY, {
      iv: AES_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString().toUpperCase(); // HEX upper case
  },

  /**
   * 字符串转 Base64
   */
  toBase64: function (str: string) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
  },

  /**
   * Base64 字符串转原始对象（UTF8 -> JSON.parse）
   */
  parseBase64: function (base64Str: string) {
    const decoded = CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decoded);
  },
};
export default cryptoHelper;
