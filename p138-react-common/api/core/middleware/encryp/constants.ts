const defaultEncryptedKeyHex = '704C0B6213DBB9C4A5060FCE459E0639';
const defaultAesSecret = 'enduresurv1ve';
const defaultAesIVKey = 'ABCDEF1234123412';
const defaultAesKey = '1234123412ABCDEF';
export const REAL_SECRET_KEY = 'realSecret';

export const defaultAesSecretInfo: ProductDatasourceHelper.GetEnabledRequestParamCryptoInfoResult = {
  encryptedKeyHex: defaultEncryptedKeyHex,
  xxTeaSecret: defaultAesSecret,
  aesIV: defaultAesIVKey,
  aesKey: defaultAesKey,
  requestParamCryptoStatus: 2
};

export  const executeEncryptUrl=['/api/v1/crypto/get/enable','/api/v1/crypto'];

//错误类型
export  enum ErrorType {
  /**
   * HTTPS解密失败
  */
  TypeDecryptRequestParamFailed = 'TypeDecryptRequestParamFailed',
}