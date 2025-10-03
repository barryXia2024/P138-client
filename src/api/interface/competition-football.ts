
import request from "../request";


// 指数
export function getFootBallCompetitionOdds(query: ServerCoreLive.GetFootBallCompetitionOddsCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.GetFootBallCompetitionOddsResult>>({ method: 'GET', url: '/api/v1/competition/football/competition/odds', query })
}


// 赛况
export function getFootBallCompetitionStatistic(query: ServerCoreLive.GetFootBallCompetitionStatisticCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.GetFootBallCompetitionStatisticResult>>({ method: 'GET', url: '/api/v1/competition/football/competition/statistic', query })
}


// 情报
export function getFootBallCompetitionSupportScale(query: ServerCoreLive.GetFootBallCompetitionSupportScaleCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootballSupportScale>>({ method: 'GET', url: '/api/v1/competition/football/competition/support-scale', query })
}


// 赛程
export function getFootballCompetitionFuture(query: ServerCoreLive.GetFootBallCompetitionFutureCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.GetFootBallCompetitionFutureResult>>({ method: 'GET', url: '/api/v1/competition/football/competition/future/list', query })
}


// 根据比赛ID获取足球比赛直播详情
export function getFootballCompetitionLive(pathParams: ServerCoreLive.GetFootBallCompetitionLiveCommandPathParams, query: ServerCoreLive.GetFootBallCompetitionLiveCommandQueryWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootBallCompetition>>({ method: 'GET', url: `/api/v1/competition/football/competition/${pathParams.competitionID}`, query })
}


// 皇冠赛前赔率
export function getFootballCrownOdds(query: ServerCoreLive.GetFootBallCompetitionCrownOddsCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootBallCompetitionCrownOdds>>({ method: 'GET', url: '/api/v1/competition/football/competition/crown/odds', query })
}


// 比赛历史(历史交锋)
export function getFootballHistory(query: ServerCoreLive.GetFootBallCompetitionHistoryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootBallBattleHistory>>({ method: 'GET', url: '/api/v1/competition/football/competition/history', query })
}


// 联赛趋势
export function getFootballLeagueTrend(query: ServerCoreLive.GetFootBallCompetitionLeagueTrendCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootBallCompetitionLeagueTrend>>({ method: 'GET', url: '/api/v1/competition/football/competition/league-trend', query })
}


// 进攻防守
export function getFootballOffenseDefense(query: ServerCoreLive.GetFootBallCompetitionOffenseDefenseCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootBallCompetitionOffenseDefense>>({ method: 'GET', url: '/api/v1/competition/football/competition/offense-defense', query })
}


// 球队比赛记录
export function getFootballRecord(query: ServerCoreLive.GetFootBallCompetitionRecordCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.CompetitionRecordList>>({ method: 'GET', url: '/api/v1/competition/football/competition/record', query })
}


// 战绩统计
export function getFootballRecordStatistic(query: ServerCoreLive.GetFootBallCompetitionRecordStatisticCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.FootBallCompetitionRecordStatistic>>({ method: 'GET', url: '/api/v1/competition/football/competition/record/statistic', query })
}


// 方案
export function getOrderTrackHall(query: ServerCoreLive.GetOrderTrackHallCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.GetOrderTrackHallResult>>({ method: 'GET', url: '/api/v1/competition/football/order/order/track/hall', query })
}


// 获取足球比赛列表
export function listFootballCompetition(query: ServerCoreLive.ListFootBallCompetitionCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.ListFootBallCompetitionResult>>({ method: 'GET', url: '/api/v1/competition/football/list', query })
}


// 获取足球彩期号列表
export function listTraditionalFootballLotteryTermNo(query: ServerCoreLive.ListTraditionalFootballLotteryTermNoCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.ListTraditionalFootballLotteryTermNoResult>>({ method: 'GET', url: '/api/v1/competition/football/term-no/list', query })
}


// 足球比赛直播
const competitionFootballApi = {
    getFootBallCompetitionOdds, getFootBallCompetitionStatistic, getFootBallCompetitionSupportScale, getFootballCompetitionFuture, getFootballCompetitionLive, getFootballCrownOdds, getFootballHistory, getFootballLeagueTrend, getFootballOffenseDefense, getFootballRecord, getFootballRecordStatistic, getOrderTrackHall, listFootballCompetition, listTraditionalFootballLotteryTermNo
}

export default competitionFootballApi
