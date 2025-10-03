
import request from "../request";


// 批量插入竞技彩开奖公告
export function createDigitalDrawAnnouncement(data: LotteryDrawAnnoumcememt.CreateDigitalDrawAnnouncementCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/digital', data })
}


// 批量插入数字彩开奖公告
export function createSportsDrawAnnouncement(data: LotteryDrawAnnoumcememt.CreateSportsDrawAnnouncementCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/sports', data })
}


// 批量插入竞技彩的统计信息
export function createSportsStatistics(data: LotteryDrawAnnoumcememt.CreateSportsStatisticsCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/sports/statistics', data })
}


// 删除彩票统计数据
export function deleteSportsStatistics(pathParams: LotteryDrawAnnoumcememt.DeleteSportsStatisticsCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/lottery/lottery-type/draw/sports/statistics/${pathParams.sportsStatisticsID}` })
}


// 获取数字彩或传统足彩开奖公告
export function listDigitalDrawAnnouncement(data: LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementCommand) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDrawAnnoumcememt.DigitalDrawAnnouncement[] | null>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/get/digital', data })
}


// 根据彩种名称获取数字彩或传统足彩开奖公告
export function listDigitalDrawAnnouncementByLotteryName(data: LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementByLotteryNameCommand, query: LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementByLotteryNameCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementByLotteryNameCommandResult>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/list-by-lottery-name/digital', data, query })
}


// 获取竞技彩开奖公告
export function listSportsDrawAnnouncement(data: LotteryDrawAnnoumcememt.ListSportsDrawAnnouncementCommand) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/get/sports', data })
}


// 获取竞技彩的统计信息
export function listSportsStatistics(data: LotteryDrawAnnoumcememt.ListSportsStatisticsCommand) {
    return request<BasicTypes.DefaultResponseWrapper<LotteryDrawAnnoumcememt.LotteryStatistics[] | null>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/draw/get/sports/statistics', data })
}


// 开奖公告
const lotteryLotteryTypeDrawApi = {
    createDigitalDrawAnnouncement, createSportsDrawAnnouncement, createSportsStatistics, deleteSportsStatistics, listDigitalDrawAnnouncement, listDigitalDrawAnnouncementByLotteryName, listSportsDrawAnnouncement, listSportsStatistics
}

export default lotteryLotteryTypeDrawApi
