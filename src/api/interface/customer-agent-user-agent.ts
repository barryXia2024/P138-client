
import request from "../request";


// 设为用户代理或取消代理
export function editProxy(data: ServerCoreAgent.EditProxyCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/agent/user-agent/edit-proxy', data })
}


// 获取投注数据或者中奖数据总金额
export function getProxyUnderUserOrderAmount(data: ServerCoreAgent.GetProxyUnderUserOrderAmountCommand, query: ServerCoreAgent.GetProxyUnderUserOrderAmountCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetProxyUnderUserOrderAmountResult>>({ method: 'POST', url: '/api/v1/agent/user-agent/order-amount', data, query })
}


// 获取代理下的用户余额
export function getTotalUserBalance(data: ServerCoreAgent.GetProxyUnderTotalUserBalanceCommand, query: ServerCoreAgent.GetProxyUnderTotalUserBalanceCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.GetProxyUnderTotalUserBalanceResult>>({ method: 'POST', url: '/api/v1/agent/user-agent/total-user-balance', data, query })
}


// 获取被代理的用户列表(注册数据)B端
export function listProxyUnderUser(data: ServerCoreAgent.ListProxyUnderUserCommand, query: ServerCoreAgent.ListProxyUnderUserCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.ListProxyUnderUserResult>>({ method: 'POST', url: '/api/v1/agent/user-agent/proxy-under-user', data, query })
}


// 投注数据/中奖数据
export function listProxyUnderUserBetDataOrWinData(data: ServerCoreAgent.ListProxyUnderUserBetDataOrWinDataCommand, query: ServerCoreAgent.ListProxyUnderUserBetDataOrWinDataCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.ListProxyUnderUserBetDataOrWinDataResult>>({ method: 'POST', url: '/api/v1/agent/user-agent/bet-data-or-win-data', data, query })
}


// 获取代理用户列表(B端用户)
export function listProxyUser(query: ServerCoreAgent.ListProxyUserCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAgent.ListProxyUserResult>>({ method: 'GET', url: '/api/v1/agent/user-agent/list', query })
}


// 代理转移(选择代理),用户默认代理人是店主,参数userID是被修改代理的那个人的ID
export function transferAgent(data: ServerCoreAgent.TransferAgentCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PUT', url: '/api/v1/agent/user-agent/transfer', data })
}


// 修改佣金比例(修改代理佣金)
export function updateAgentCommission(data: ServerCoreAgent.UpdateAgentCommissionCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: '/api/v1/agent/user-agent/commission', data })
}


// 用户管理-用户代理
const customerAgentUserAgentApi = {
    editProxy, getProxyUnderUserOrderAmount, getTotalUserBalance, listProxyUnderUser, listProxyUnderUserBetDataOrWinData, listProxyUser, transferAgent, updateAgentCommission
}

export default customerAgentUserAgentApi
