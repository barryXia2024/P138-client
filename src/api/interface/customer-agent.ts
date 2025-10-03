
import request from "../request";


// 本月(今日)开户人数-推荐数据-投注数据
export function agentUnderOrder(data: ServerCoreAgent.GetAgentUnderOrderCommand, query: ServerCoreAgent.GetAgentUnderOrderCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetAgentUnderOrderResult>>({ method: 'POST', url: '/api/v1/agent/agent_under/order', data, query })
}


// 获取投注总金额和赢奖总金额
export function agentUnderOrderAmount(data: ServerCoreAgent.GetAgentUnderOrderAmountCommand, query: ServerCoreAgent.GetAgentUnderOrderAmountCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetAgentUnderOrderAmountResult>>({ method: 'POST', url: '/api/v1/agent/agent_under/order_amount', data, query })
}


// 累计本月(今日)销量-我的统计
export function myStatistic(data: ServerCoreAgent.GetMyStatisticCommand, query: ServerCoreAgent.GetMyStatisticCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetMyStatisticResult>>({ method: 'POST', url: '/api/v1/agent/my_statistic', data, query })
}


// 代理统计信息(C B端使用)
export function proxyCountData(data: ServerCoreAgent.GetProxyCountDataCommand, query: ServerCoreAgent.GetProxyCountDataCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetProxyCountDataResult>>({ method: 'POST', url: '/api/v1/agent/proxy_count_data', data, query })
}


// 本月(今日)开户人数-推荐数据-注册数据
export function proxyUnderUser(data: ServerCoreAgent.GetProxyUnderUserCommand, query: ServerCoreAgent.GetProxyUnderUserCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetProxyUnderUserResult>>({ method: 'POST', url: '/api/v1/agent/proxy_under_user', data, query })
}


// 我的-用户管理
const customerAgentApi = {
    agentUnderOrder, agentUnderOrderAmount, myStatistic, proxyCountData, proxyUnderUser
}

export default customerAgentApi
