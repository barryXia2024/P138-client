
import request from "../request";


// 批量插入福利彩票数据源
export function createCharityLotteryData(data: LotteryDataSource.CreateCharityLotteryCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/data/charity', data })
}


// 创建同步配置信息
export function createDatasourceConfigApi(data: LotteryDataSource.CreateDataSourceConfigCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/data/sync/config', data })
}


// 批量插入体育彩票数据源
export function createSportsLotteryData(data: LotteryDataSource.CreateLeagueSportsLotteryCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/data/sports', data })
}


// 获取福利彩票数据源
export function getCharityLotteryData(query: LotteryDataSource.ListCharityLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.CharityLotteryDataSource>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/charity', query })
}


// 按联赛获取体育彩票数据源
export function getLeagueSportsLotteryData(query: LotteryDataSource.ListLeagueSportsLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.SportsLotteryDataSource[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sports/league', query })
}


// 按联赛获取体育彩票数据源V2
export function getLeagueSportsLotteryDataNew(query: LotteryDataSource.ListLeagueSportsLotteryNewCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.SportsLotteryDataSource[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sports/league/new', query })
}


// 按时间获取体育彩票数据源
export function getTimeSportsLotteryData(query: LotteryDataSource.ListTimeSportsLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.TimeSportsLotteryResult[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sports/time', query })
}


// 手动触发同步
export function triggerSyncDatasourceApi(data: LotteryDataSource.TriggerSyncDatasourceCommandWithoutPath, pathParams: LotteryDataSource.TriggerSyncDatasourceCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: `/api/v1/lottery/lottery-type/data/sync/config/trigger/${pathParams.dataSourceConfigID}`, data })
}


// 修改同步配置信息
export function updateDatasourceConfigApi(data: LotteryDataSource.UpdateDataSourceConfigCommandWithoutPath, pathParams: LotteryDataSource.UpdateDataSourceConfigCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PUT', url: `/api/v1/lottery/lottery-type/data/sync/config/${pathParams.dataSourceConfigID}`, data })
}


// 彩票数据源
const lotteryLotteryTypeDataApi = {
    createCharityLotteryData, createDatasourceConfigApi, createSportsLotteryData, getCharityLotteryData, getLeagueSportsLotteryData, getLeagueSportsLotteryDataNew, getTimeSportsLotteryData, triggerSyncDatasourceApi, updateDatasourceConfigApi
}

export default lotteryLotteryTypeDataApi
