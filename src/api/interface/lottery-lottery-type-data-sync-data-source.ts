
import request from "../request";


// 新增数据源提供商信息
export function createDataSourceProvider(data: LotteryDataSource.CreateDataSourceProviderCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/data/sync-data-source', data })
}


// 删除数据源提供商信息
export function deleteDataSourceProvider(pathParams: LotteryDataSource.DeleteDataSourceProviderCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/lottery/lottery-type/data/sync-data-source/${pathParams.providerID}` })
}


// 获取数据源提供商信息
export function getDataSourceProvider(pathParams: LotteryDataSource.GetDataSourceProviderCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.DataSourceProvider>>({ method: 'GET', url: `/api/v1/lottery/lottery-type/data/sync-data-source/${pathParams.providerID}` })
}


// 获取数据源提供商信息列表
export function listDataSourceProvider(query: LotteryDataSource.ListDataSourceProviderCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.ListDataSourceProviderResult>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source', query })
}


// 获取数据源同步日志
export function listDataSourceSyncLog(query: LotteryDataSource.ListDataSourceSyncTaskCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.ListDataSourceSyncTaskResult>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source/list-sync-log', query })
}


// 修改数据源提供商信息
export function updateDataSourceProvider(data: LotteryDataSource.UpdateDataSourceProviderCommandWithoutPath, pathParams: LotteryDataSource.UpdateDataSourceProviderCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/lottery/lottery-type/data/sync-data-source/${pathParams.providerID}`, data })
}


// 数据源同步管理
const lotteryLotteryTypeDataSyncDataSourceApi = {
    createDataSourceProvider, deleteDataSourceProvider, getDataSourceProvider, listDataSourceProvider, listDataSourceSyncLog, updateDataSourceProvider
}

export default lotteryLotteryTypeDataSyncDataSourceApi
