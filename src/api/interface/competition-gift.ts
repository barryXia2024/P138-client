
import request from "../request";


// 新增礼物
export function createLiveStreamGift(data: CoreLiveLiveStreamGift.CreateLiveStreamGiftCommand) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.CreateLiveStreamGiftResult>>({ method: 'POST', url: '/api/v1/competition/gift/create', data })
}


// 删除礼物
export function deleteLiveStreamGift(pathParams: CoreLiveLiveStreamGift.DeleteLiveStreamGiftCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.DeleteLiveStreamGiftResult>>({ method: 'DELETE', url: `/api/v1/competition/gift/${pathParams.liveStreamGiftID}` })
}


// 查看礼物
export function getLiveStreamGift(pathParams: CoreLiveLiveStreamGift.GetLiveStreamGiftCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.LiveStreamGift>>({ method: 'GET', url: `/api/v1/competition/gift/${pathParams.liveStreamGiftID}` })
}


// 赠送礼物
export function giveLiveStreamGift(data: CoreLiveLiveStreamGift.GiveLiveStreamGiftCommand) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.GiveLiveStreamGiftResult>>({ method: 'POST', url: '/api/v1/competition/gift/give-gift', data })
}


// 获取赠送礼物列表
export function listGiveLiveStreamGift(query: CoreLiveLiveStreamGift.ListGiveLiveStreamGiftCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.ListGiveLiveStreamGiftResult>>({ method: 'GET', url: '/api/v1/competition/gift/gift/list', query })
}


// 获取礼物列表
export function listLiveStreamGift(query: CoreLiveLiveStreamGift.ListLiveStreamGiftCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.ListLiveStreamGiftResult>>({ method: 'GET', url: '/api/v1/competition/gift/list', query })
}


// 修改礼物
export function updateLiveStreamGift(data: CoreLiveLiveStreamGift.UpdateLiveStreamGiftCommandWithoutPath, pathParams: CoreLiveLiveStreamGift.UpdateLiveStreamGiftCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLiveLiveStreamGift.UpdateLiveStreamGiftResult>>({ method: 'PUT', url: `/api/v1/competition/gift/${pathParams.liveStreamGiftID}`, data })
}


// 主播礼物管理
const competitionGiftApi = {
    createLiveStreamGift, deleteLiveStreamGift, getLiveStreamGift, giveLiveStreamGift, listGiveLiveStreamGift, listLiveStreamGift, updateLiveStreamGift
}

export default competitionGiftApi
