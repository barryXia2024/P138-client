
import request from "../request";


// 新增彩票种类
export function createLotteryTypeApi(data: ServerCoreLottery.CreateLotteryCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLottery.CreatedLotteryResult>>({ method: 'POST', url: '/api/v1/lottery/lottery-type', data })
}


// 刪除(下架)彩票种类
export function deleteLotteryTypeApi(pathParams: ServerCoreLottery.DeleteLotteryCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/lottery/lottery-type/${pathParams.lotteryTypeID}` })
}


// 获取允许跟单彩票种类列表
export function getAllowFollowLottery() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLottery.Lottery[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/queryBilling' })
}


// 获取彩种类型详情
export function getLotteryTypeApi(pathParams: ServerCoreLottery.GetLotteryCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLottery.Lottery>>({ method: 'GET', url: `/api/v1/lottery/lottery-type/${pathParams.lotteryTypeID}` })
}


// 获取彩票种类(C端使用)
export function listCustomLotteryApi(query: ServerCoreLottery.ListCustomLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLottery.ListCustomLotteryResult[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/custom/get-game-list', query })
}


// 获取彩票种类列表v2
export function listLotteryApiAdmin(query: ServerCoreLottery.ListLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLottery.ListLotteryResult>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/admin/v2', query })
}


// 获取彩票名称列表
export function listLotteryName() {
    return request<BasicTypes.DefaultResponseWrapper<CoreCommonEnum.LotteryInfo[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/list-lottery-name' })
}


// 获取彩票种类列表
export function listLotteryTypeApi() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLottery.Lottery[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type' })
}


// 修改彩票种类
export function updateLotteryTypeApi(data: ServerCoreLottery.UpdateLotteryCommandWithoutPath, pathParams: ServerCoreLottery.UpdateLotteryCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/lottery/lottery-type/${pathParams.lotteryTypeID}`, data })
}


// 彩票种类API
const lotteryLotteryTypeApi = {
    createLotteryTypeApi, deleteLotteryTypeApi, getAllowFollowLottery, getLotteryTypeApi, listCustomLotteryApi, listLotteryApiAdmin, listLotteryName, listLotteryTypeApi, updateLotteryTypeApi
}

export default lotteryLotteryTypeApi
