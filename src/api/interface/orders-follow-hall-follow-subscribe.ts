
import request from "../request";


// 删除用户自动跟单信息
export function deleteCustomerAutoFollowApi(pathParams: HallFollowSubscribe.DeleteCustomerAutoFollowCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/orders/follow-hall/follow-subscribe/${pathParams.subscribeID}` })
}


// 获取C端用户自动跟单信息
export function getCustomerAutoFollowSubscribeApi(query: HallFollowSubscribe.GetCustomerAutoFollowSubscribeCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSubscribe.CustomerAutoFollowSubscribeInfo>>({ method: 'GET', url: '/api/v1/orders/follow-hall/follow-subscribe/follow/subscribe', query })
}


// 获取用户自动跟单执行记录列表
export function listAutoFollowExecutionLogApi(query: HallFollowSubscribe.ListAutoFollowExecutionLogCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSubscribe.ListAutoFollowExecutionLogResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/follow-subscribe/executionLog', query })
}


// 获取用户自动跟单列表
export function listCustomerAutoFollowApi(query: HallFollowSubscribe.ListCustomerAutoFollowCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSubscribe.ListCustomerAutoFollowResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/follow-subscribe', query })
}


// 获取用户开启或停止自动跟单历史列表
export function listSubscribeUnsubscribeAutoFollowHistoryApi(query: HallFollowSubscribe.ListSubscribeUnsubscribeAutoFollowHistoryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSubscribe.ListSubscribeUnsubscribeAutoFollowHistoryResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/follow-subscribe/history', query })
}


// 开启自动跟单
export function subscribeFollowApi(data: HallFollowSubscribe.SubscribeFollowCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/orders/follow-hall/follow-subscribe/subscribe', data })
}


// 停止自动跟单
export function unsubscribeFollowApi(data: HallFollowSubscribe.UnsubscribeFollowCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/orders/follow-hall/follow-subscribe/unsubscribe', data })
}


// 跟单订阅
const ordersFollowHallFollowSubscribeApi = {
    deleteCustomerAutoFollowApi, getCustomerAutoFollowSubscribeApi, listAutoFollowExecutionLogApi, listCustomerAutoFollowApi, listSubscribeUnsubscribeAutoFollowHistoryApi, subscribeFollowApi, unsubscribeFollowApi
}

export default ordersFollowHallFollowSubscribeApi
