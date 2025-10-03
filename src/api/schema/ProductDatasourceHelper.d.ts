
declare namespace ProductDatasourceHelper {

    interface GetEnabledRequestParamCryptoInfoResult {
        xxTeaSecret: string;
        aesKey: string;
        aesIV: string;
        encryptedKeyHex: string;
        requestParamCryptoStatus: ServerCoreRepo.RequestParamCryptoStatus;
    }

}
