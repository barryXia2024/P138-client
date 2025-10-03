
import request from "../request";


// 奖金计算器
export function bonusCalculator(data: ServerCoreOrder.BonusCalculatorCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.BonusCalculatorResult>>({ method: 'POST', url: '/api/v1/orders/bet/bonus/jc', data })
}


// 奖金计算器v2
export function bonusCalculatorNew(data: ServerCoreOrder.BonusCalculatorV2Command) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.BonusCalculatorV2Result>>({ method: 'POST', url: '/api/v1/orders/bet/bonus/jcv2', data })
}


// 奖金优化
export function bonusOptimization(data: ServerCoreOrder.BonusOptimizationCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.BonusOptimizationResult>>({ method: 'POST', url: '/api/v1/orders/bet/bonus/optimization', data })
}


// 跟单
export function createFollowOrder(data: ServerCoreOrder.CreateFollowOrderCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.CreateFollowOrderResult>>({ method: 'POST', url: '/api/v1/orders/bet/follow', data })
}


// 用户投注
export function createLotteryOrder(data: ServerCoreOrder.CreateOrderCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.CreateOrderResult>>({ method: 'POST', url: '/api/v1/orders/bet/create-order', data })
}


// C端用户取消订单
export function customerCancelOrder(data: ServerCoreOrder.UserCancelOrderCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PATCH', url: '/api/v1/orders/bet/customer-cancel-order', data })
}


// 点击中奖消息弹窗后回调
export function customerConfirmWinningMessage(data: ServerCoreOrder.CustomerConfirmWinningMessageCommandWithoutPath, pathParams: ServerCoreOrder.CustomerConfirmWinningMessageCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: `/api/v1/orders/bet/getWinningBroadcast/${pathParams.userID}`, data })
}


// 刪除订单或删除方案
export function deleteLotteryOrderOrSchemeByOrderId(pathParams: ServerCoreOrder.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/orders/bet/${pathParams.orderId}` })
}


// 获取北京单场M串N的玩法
export function getBdMxnPlays(query: ServerCoreOrder.GetBDMxNPlaysCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<string[] | null>>({ method: 'GET', url: '/api/v1/orders/bet/getBdMxN', query })
}


// 获取订单列表(投注记录)
export function getBetList(query: ServerCoreOrder.ListOrderCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.ListOrderResult>>({ method: 'GET', url: '/api/v1/orders/bet', query })
}


// 获取投注记录(待出票,待开奖,已中奖的个数)
export function getBetRecord(pathParams: ServerCoreOrder.GetBetRecordCountCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.GetBetRecordCountResult>>({ method: 'GET', url: `/api/v1/orders/bet/record/${pathParams.userID}/count` })
}


// 获取追号详情
export function getChaseNumberRecordDetail(pathParams: ServerCoreOrder.GetChaseNumberRecordDetailCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.GetChaseNumberRecordDetailResult>>({ method: 'GET', url: `/api/v1/orders/bet/list-chase-number-record/${pathParams.chaseNumberRecordID}` })
}


// 获取订单或方案详情
export function getOrderOrSchemeDetailsByOrderId(pathParams: ServerCoreOrder.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.LotteryOrder>>({ method: 'GET', url: `/api/v1/orders/bet/${pathParams.orderId}` })
}


// 获取中奖广播信息
export function getUserWinningBroadcast(pathParams: ServerCoreOrder.GetUserWinningBroadcastCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.WinNotice[] | null>>({ method: 'GET', url: `/api/v1/orders/bet/getWinningBroadcast/${pathParams.userID}` })
}


// 获取追号列表
export function listChaseNumberRecord(data: ServerCoreOrder.ListChaseNumberCommand, query: ServerCoreOrder.ListChaseNumberCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.ListChaseNumberResult>>({ method: 'POST', url: '/api/v1/orders/bet/list-chase-number-record', data, query })
}


// 获取追号任务列表
export function listChaseNumberTask(query: ServerCoreOrder.ListOrderChaseNumberTaskCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.ListOrderChaseNumberTaskResult>>({ method: 'GET', url: '/api/v1/orders/bet/list-order-chase-number-task', query })
}


// 获取需要手动确认开奖结果的彩种订单
export function listManualDrawOrders(data: ServerCoreOrder.ListManualDrawOrdersCommand, query: ServerCoreOrder.ListManualDrawOrdersCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.ListManualDrawOrdersResult>>({ method: 'POST', url: '/api/v1/orders/bet/manual-draw-orders', data, query })
}


// 获取中奖广播信息列表
export function listUserWinningBroadcast(query: ServerCoreOrder.ListUserWinningBroadcastCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.ListUserWinningBroadcastResult>>({ method: 'GET', url: '/api/v1/orders/bet/listWinningBroadcast', query })
}


// 发单
export function postLotteryOrder(data: ServerCoreOrder.PostOrderCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.PostOrderResult>>({ method: 'POST', url: '/api/v1/orders/bet/post-order', data })
}


// 保存方案
export function saveLotteryScheme(data: ServerCoreOrder.SaveSchemeCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOrder.SaveSchemeResult>>({ method: 'POST', url: '/api/v1/orders/bet/save-lottery-scheme', data })
}


// 终止追号
export function stopChaseNumber(pathParams: ServerCoreOrder.StopChaseNumberCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: `/api/v1/orders/bet/stop-chase-number/${pathParams.chaseNumberRecordID}` })
}


// C端订单
const ordersBetApi = {
    bonusCalculator, bonusCalculatorNew, bonusOptimization, createFollowOrder, createLotteryOrder, customerCancelOrder, customerConfirmWinningMessage, deleteLotteryOrderOrSchemeByOrderId, getBdMxnPlays, getBetList, getBetRecord, getChaseNumberRecordDetail, getOrderOrSchemeDetailsByOrderId, getUserWinningBroadcast, listChaseNumberRecord, listChaseNumberTask, listManualDrawOrders, listUserWinningBroadcast, postLotteryOrder, saveLotteryScheme, stopChaseNumber
}

export default ordersBetApi
