
import request from "../request";


// 新增比赛主播信息
export function createLiveStream(data: ServerCoreLive.CreateLiveStreamCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.CreateLiveStreamResult>>({ method: 'POST', url: '/api/v1/competition/live-stream/create', data })
}


// 删除比赛主播信息
export function deleteLiveStream(pathParams: ServerCoreLive.DeleteLiveStreamCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.DeleteLiveStreamResult>>({ method: 'DELETE', url: `/api/v1/competition/live-stream/${pathParams.liveStreamID}` })
}


// 查看比赛主播信息
export function getLiveStream(pathParams: ServerCoreLive.GetLiveStreamCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.LiveStream>>({ method: 'GET', url: `/api/v1/competition/live-stream/${pathParams.liveStreamID}` })
}


// 获取比赛主播列表
export function listLiveStream(query: ServerCoreLive.ListLiveStreamCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.ListLiveStreamResult>>({ method: 'GET', url: '/api/v1/competition/live-stream/list', query })
}


// 开启主播解说(开启直播)
export function startLiveStream(pathParams: ServerCoreLive.StartLiveStreamCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.StartLiveStreamResult>>({ method: 'POST', url: `/api/v1/competition/live-stream/start/${pathParams.liveStreamID}` })
}


// 修改比赛主播信息
export function updateLiveStream(data: ServerCoreLive.UpdateLiveStreamCommandWithoutPath, pathParams: ServerCoreLive.UpdateLiveStreamCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.UpdateLiveStreamResult>>({ method: 'PUT', url: `/api/v1/competition/live-stream/${pathParams.liveStreamID}`, data })
}


// 主播解说
const competitionLiveStreamApi = {
    createLiveStream, deleteLiveStream, getLiveStream, listLiveStream, startLiveStream, updateLiveStream
}

export default competitionLiveStreamApi
