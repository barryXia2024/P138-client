
import request from "../request";


// 获取用户提现申请列表
export function listUserWithdraw(query: ServerCoreWallet.ListUserWithdrawCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.ListUserWithdrawResult>>({ method: 'GET', url: '/api/v1/wallets/withdraw/apply-for/list', query })
}


// 审核用户提现申请
export function reviewUserWithdraw(data: ServerCoreWallet.ReviewUserWithdrawCommandWithoutPath, pathParams: ServerCoreWallet.ReviewUserWithdrawCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: `/api/v1/wallets/withdraw/review/${pathParams.withdrawApplyID}`, data })
}


// 修改用户钱包充提限制
export function setWalletLimit(data: ServerCoreWallet.SetWalletLimitCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PATCH', url: '/api/v1/wallets/withdraw/setting/user/withdraw/limit', data })
}


// 用户提现申请
export function userWithdrawApplyFor(data: ServerCoreWallet.UserWithdrawApplyForCommand, query: ServerCoreWallet.UserWithdrawApplyForCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/wallets/withdraw/apply-for', data, query })
}


// 查看用户提现申请进度
export function userWithdrawProcess(pathParams: ServerCoreWallet.UserWithdrawProcessCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.UserApplyForWithdrawRecord>>({ method: 'GET', url: `/api/v1/wallets/withdraw/process/${pathParams.withdrawApplyID}` })
}


// 获取店铺充提限制信息
export function withdrawLimitQuery(query: ServerCoreWallet.WithdrawLimitQueryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.WithdrawLimitQueryResult>>({ method: 'GET', url: '/api/v1/wallets/withdraw/withdraw-limit-query', query })
}


// 提现管理
const walletsWithdrawApi = {
    listUserWithdraw, reviewUserWithdraw, setWalletLimit, userWithdrawApplyFor, userWithdrawProcess, withdrawLimitQuery
}

export default walletsWithdrawApi
