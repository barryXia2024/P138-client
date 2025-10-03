
import request from "../request";


// 导入彩票走势数据
export function createTrend(data: CoreLotteryTrend.CreateTrendCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/lottery/lottery-type/trend', data })
}


// 获取彩票走势
export function listTrend(query: CoreLotteryTrend.ListTrendCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreLotteryTrend.Trend[] | null>>({ method: 'GET', url: '/api/v1/lottery/lottery-type/trend', query })
}


// 走势图
const lotteryLotteryTypeTrendApi = {
    createTrend, listTrend
}

export default lotteryLotteryTypeTrendApi
