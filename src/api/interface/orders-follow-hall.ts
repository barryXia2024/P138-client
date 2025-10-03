
import request from "../request";


// 获取发单金额最低限制
export function getFollowAmountLimit() {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetFollowAmountLimitResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/followAmountLimit' })
}


// 跟单大厅发单列表(直播比赛中的方案)
export function getOrderTrackHall(query: CoreFollowHall.ListOrderTrackHallCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.ListOrderTrackHallResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/order/order/track/hall', query })
}


// 获取发单数
export function getTrackingOrderCount(query: CoreFollowHall.GetTrackingOrderCountCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetTrackingOrderCountResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/tracking/order/count', query })
}


// 获取发单详情
export function getTrackingOrderItem(pathParams: CoreFollowHall.GetTrackingOrderItemCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetTrackingOrderItemResult>>({ method: 'GET', url: `/api/v1/orders/follow-hall/tracking/order/item/${pathParams.orderNo}` })
}


// 获取用户发单列表
export function getUserPostsOrderList(query: CoreFollowHall.GetUserPostsOrderListCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetUserPostsOrderListResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/posts/order/list', query })
}


// 我的跟单
export function myTrackingOrder(query: CoreFollowHall.GetMyTrackingOrderCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetMyTrackingOrderResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/my/tracking_order', query })
}


// 我的方案
export function myTrackingOrderPlan(query: CoreFollowHall.GetMyTrackingOrderPlanCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetMyTrackingOrderPlanResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/my/tracking_order_plan', query })
}


// 根据昵称查询用户
export function searchUser(query: CoreFollowHall.SearchUserCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.SearchUserResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/search/user', query })
}


// 我的战绩(成就)
export function trackAchievements(query: CoreFollowHall.GetTrackAchievementsCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreFollowHall.GetTrackAchievementsResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/track/achievements', query })
}


// 跟单大厅
const ordersFollowHallApi = {
    getFollowAmountLimit, getOrderTrackHall, getTrackingOrderCount, getTrackingOrderItem, getUserPostsOrderList, myTrackingOrder, myTrackingOrderPlan, searchUser, trackAchievements
}

export default ordersFollowHallApi
