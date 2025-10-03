
import request from "../request";


// 删除店铺用户充值支付方式
export function deleteShopCustomerPaymentMethod(pathParams: ServerCorePayment.DeleteShopCustomerPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/payment/customer/delete-shop-customer-payment-method/${pathParams.shopCustomerPaymentMethodID}` })
}


// 获取店铺用户充值支付方式详细信息
export function getShopCustomerPaymentMethod(pathParams: ServerCorePayment.GetShopCustomerPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ListShopCustomerPaymentMethodRow>>({ method: 'GET', url: `/api/v1/payment/customer/get-shop-customer-payment-method/${pathParams.shopCustomerPaymentMethodID}` })
}


// 获取店铺开通C端充提申请列表
export function listShopApplyForOpenCustomerPaymentMethod(query: ServerCorePayment.ListShopApplyForOpenCustomerPaymentMethodCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ListShopApplyForOpenCustomerPaymentMethodResult>>({ method: 'GET', url: '/api/v1/payment/customer/apply-for/list', query })
}


// 获取店铺用户充值支付方式列表
export function listShopCustomerPaymentMethod(query: ServerCorePayment.ListShopCustomerPaymentMethodCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ListShopCustomerPaymentMethodResult>>({ method: 'GET', url: '/api/v1/payment/customer/list-shop-customer-payment-method', query })
}


// 审核店主开通C端充提申请
export function reviewShopApplyForOpenCustomerPaymentMethod(data: ServerCorePayment.ReviewShopApplyForOpenCustomerPaymentMethodCommandWithoutPath, pathParams: ServerCorePayment.ReviewShopApplyForOpenCustomerPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: `/api/v1/payment/customer/review/${pathParams.applyID}`, data })
}


// 店主申请开通C端充提方式
export function shopApplyForOpenCustomerPaymentMethod(data: ServerCorePayment.ShopApplyForOpenCustomerPaymentMethodCommandWithoutPath, pathParams: ServerCorePayment.ShopApplyForOpenCustomerPaymentMethodCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: `/api/v1/payment/customer/shop-apply-for-open-customer-payment-method/${pathParams.paymentMethodID}`, data })
}


// 查看店主开通C端充提申请进度
export function shopApplyForOpenCustomerPaymentMethodProcess(data: ServerCorePayment.ShopApplyForOpenCustomerPaymentMethodProcessCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ShopApplyForOpenCustomerPaymentMethodRecord>>({ method: 'POST', url: '/api/v1/payment/customer/process', data })
}


// 通过申请ID查看店主开通C端充提申请进度
export function shopApplyForOpenCustomerPaymentMethodProcessByApplyId(pathParams: ServerCorePayment.ShopApplyForOpenCustomerPaymentMethodProcessByApplyIDCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCorePayment.ShopApplyForOpenCustomerPaymentMethodRecord>>({ method: 'GET', url: `/api/v1/payment/customer/process/${pathParams.applyID}` })
}


// 修改店铺用户充值支付方式
export function updateShopCustomerPaymentMethod(data: ServerCorePayment.UpdateShopCustomerPaymentMethodCommandWithoutPath, pathParams: ServerCorePayment.UpdateShopCustomerPaymentMethodCommandPathParams, query: ServerCorePayment.UpdateShopCustomerPaymentMethodCommandQueryWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: `/api/v1/payment/customer/update-shop-customer-payment-method/${pathParams.shopCustomerPaymentMethodID}`, data, query })
}


// 店铺提收款渠道管理
const paymentCustomerApi = {
    deleteShopCustomerPaymentMethod, getShopCustomerPaymentMethod, listShopApplyForOpenCustomerPaymentMethod, listShopCustomerPaymentMethod, reviewShopApplyForOpenCustomerPaymentMethod, shopApplyForOpenCustomerPaymentMethod, shopApplyForOpenCustomerPaymentMethodProcess, shopApplyForOpenCustomerPaymentMethodProcessByApplyId, updateShopCustomerPaymentMethod
}

export default paymentCustomerApi
