
import request from "../request";


// 新增店铺充值支付方式
export function createShopPaymentMethod(data: ServerCorePayment.CreateShopPaymentMethodCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/payment/shop/create-shop-payment-method', data })
}


// 删除店铺充值支付方式
export function deleteShopPaymentMethod(pathParams: ServerCorePayment.DeleteShopPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/payment/shop/delete-shop-payment-method/${pathParams.shopPaymentMethodID}` })
}


// 获取店铺充值支付方式详细信息
export function getShopPaymentMethod(pathParams: ServerCorePayment.GetShopPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ListShopPaymentMethodRow>>({ method: 'GET', url: `/api/v1/payment/shop/get-shop-payment-method/${pathParams.shopPaymentMethodID}` })
}


// 获取店铺充值支付方式列表
export function listShopPaymentMethod(query: ServerCorePayment.ListShopPaymentMethodCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ListShopPaymentMethodResult>>({ method: 'GET', url: '/api/v1/payment/shop/list-shop-payment-method', query })
}


// 修改店铺充值支付方式
export function updateShopPaymentMethod(data: ServerCorePayment.UpdateShopPaymentMethodCommandWithoutPath, pathParams: ServerCorePayment.UpdateShopPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: `/api/v1/payment/shop/update-shop-payment-method/${pathParams.shopPaymentMethodID}`, data })
}


// 店铺充值渠道管理
const paymentShopApi = {
    createShopPaymentMethod, deleteShopPaymentMethod, getShopPaymentMethod, listShopPaymentMethod, updateShopPaymentMethod
}

export default paymentShopApi
