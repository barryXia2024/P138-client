
import request from "../request";


// 新增数据源提供商彩种信息
export function createDataSourceLottery(data: LotteryDataSource.CreateDataSourceLotteryCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery', data })
}


// 删除数据源提供商彩种信息
export function deleteDataSourceLottery(pathParams: LotteryDataSource.DeleteDataSourceLotteryCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/${pathParams.dataSourceLotteryID}` })
}


// 获取手动确认彩种开奖结果的数据源提供商开奖数据
export function getDataSourceDrawResult() {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/dataSourceDrawResult' })
}


// 获取数据源提供商彩种信息
export function getDataSourceLottery(pathParams: LotteryDataSource.GetDataSourceLotteryCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.DataSourceLottery>>({ method: 'GET', url: `/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/${pathParams.dataSourceLotteryID}` })
}


// 获取待手动确认开奖结果总数
export function getPendingManualDrawResultConfirmLotteryCount() {
    return request<BasicTypes.DefaultResponseWrapper<number>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/get-pending-manual-draw-result-confirm-lottery-count' })
}


// 获取数据源提供商彩种信息列表
export function listDataSourceLottery(query: LotteryDataSource.ListDataSourceLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.ListDataSourceLotteryResult>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery', query })
}


// 获取手动确认开奖结果执行日志
export function listManualResultConfirmationLog(query: LotteryDataSource.ListManualDrawResultConfirmLogCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.ListManualDrawResultConfirmLogResult>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/list-manual-result-confirmation-log', query })
}


// 获取需要手动确认开奖结果的彩种
export function listNeedManualResultConfirmLottery(query: LotteryDataSource.ListNeedManualDrawResultConfirmLotteryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDataSource.ListNeedManualDrawResultConfirmLotteryCommandResult>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/list-need-manual-result-confirm-lottery', query })
}


// 手动取消同步数据源彩种数据
export function manualCancelSync(data: LotteryDataSource.ManualTriggerSyncCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/manual/cancel', data })
}


// 手动确认开奖结果
export function manualDrawResultConfirmation(data: LotteryDataSource.ManualDrawResultConfirmationCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/manual-draw-result-confirmation', data })
}


// 手动启动同步数据源彩种数据
export function manualTriggerSync(data: LotteryDataSource.ManualTriggerSyncCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: '/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/manual/trigger', data })
}


// 修改数据源提供商彩种信息
export function updateDataSourceLottery(data: LotteryDataSource.UpdateDataSourceLotteryCommandWithoutPath, pathParams: LotteryDataSource.UpdateDataSourceLotteryCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/lottery/lottery-type/data/sync-data-source/data-source-lottery/${pathParams.dataSourceLotteryID}`, data })
}


// 彩种同步管理
const lotteryLotteryTypeDataSyncDataSourceDataSourceLotteryApi = {
    createDataSourceLottery, deleteDataSourceLottery, getDataSourceDrawResult, getDataSourceLottery, getPendingManualDrawResultConfirmLotteryCount, listDataSourceLottery, listManualResultConfirmationLog, listNeedManualResultConfirmLottery, manualCancelSync, manualDrawResultConfirmation, manualTriggerSync, updateDataSourceLottery
}

export default lotteryLotteryTypeDataSyncDataSourceDataSourceLotteryApi
