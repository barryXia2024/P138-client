
import request from "../request";


// 获取开启的请求参数加密信息
export function getEnableRequestParamCryptoInfoApi() {
    return request<BasicTypes.DefaultResponseWrapper<ProductDatasourceHelper.GetEnabledRequestParamCryptoInfoResult>>({ method: 'GET', url: '/api/v1/crypto/get/enable', ignoreAuth: true })
}


// 获取请求参数加密信息
const cryptoApi = {
    getEnableRequestParamCryptoInfoApi
}

export default cryptoApi
