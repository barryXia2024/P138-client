
import request from "../request";


// 数据(未来赛程)
export function getBasketballCompetitionFuture(query: ServerCoreLive.GetBasketBallCompetitionFutureCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.GetBasketBallCompetitionFutureResult>>({ method: 'GET', url: '/api/v1/competition/basketball/competition/future/list', query })
}


// 根据比赛ID获取篮球比赛直播详情
export function getBasketballCompetitionLive(pathParams: ServerCoreLive.GetBasketballCompetitionLiveCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.BasketBallCompetition>>({ method: 'GET', url: `/api/v1/competition/basketball/competition/${pathParams.competitionID}` })
}


// 篮球比赛历史(历史交锋)
export function getBasketballHistory(query: ServerCoreLive.GetBasketBallCompetitionHistoryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.BasketBallBattleHistory>>({ method: 'GET', url: '/api/v1/competition/basketball/competition/history', query })
}


// 篮球球队比赛记录
export function getBasketballRecord(query: ServerCoreLive.GetBasketBallCompetitionRecordCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.BasketBallCompetitionRecordList>>({ method: 'GET', url: '/api/v1/competition/basketball/competition/record', query })
}


// 获取篮球比赛列表
export function listBasketballCompetition(query: ServerCoreLive.ListBasketBallCompetitionCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.ListBasketBallCompetitionResult>>({ method: 'GET', url: '/api/v1/competition/basketball/list', query })
}


// 篮球比赛直播
const competitionBasketballApi = {
    getBasketballCompetitionFuture, getBasketballCompetitionLive, getBasketballHistory, getBasketballRecord, listBasketballCompetition
}

export default competitionBasketballApi
