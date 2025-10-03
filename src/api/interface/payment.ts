
import request from "../request";


// 创建平台(系统)支付方式基本信息
export function createPlatformPaymentMethod(data: ServerCorePayment.CreatePlatformPaymentMethodCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.PlatformPaymentMethod>>({ method: 'POST', url: '/api/v1/payment/create-platform-payment-method', data })
}


// 删除平台(系统)支付方式
export function deletePlatformPaymentMethod(pathParams: ServerCorePayment.DeletePlatformPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/payment/delete-platform-payment-method/${pathParams.paymentMethodID}` })
}


// 获取平台(系统)支付方式详细信息
export function getPlatformPaymentMethod(pathParams: ServerCorePayment.GetPlatformPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.PlatformPaymentMethod>>({ method: 'GET', url: `/api/v1/payment/get-platform-payment-method/${pathParams.paymentMethodID}` })
}


// 获取平台(系统)支付方式列表
export function listPlatformPaymentMethod(query: ServerCorePayment.ListPlatformPaymentMethodCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ListPlatformPaymentMethodResult>>({ method: 'GET', url: '/api/v1/payment/list-platform-payment-method', query })
}


// 修改平台(系统)支付方式
export function updatePlatformPaymentMethod(data: ServerCorePayment.UpdatePlatformPaymentMethodCommandWithoutPath, pathParams: ServerCorePayment.UpdatePlatformPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.PlatformPaymentMethod>>({ method: 'PUT', url: `/api/v1/payment/update-platform-payment-method/${pathParams.paymentMethodID}`, data })
}


// 提收款渠道管理
const paymentApi = {
    createPlatformPaymentMethod, deletePlatformPaymentMethod, getPlatformPaymentMethod, listPlatformPaymentMethod, updatePlatformPaymentMethod
}

export default paymentApi
