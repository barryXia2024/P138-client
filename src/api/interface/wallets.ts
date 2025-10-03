
import request from "../request";


// 根据用户ID或者用户名获取钱包信息
export function getUserWallet(query: ServerCoreWallet.GetUserWalletCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<WalletWalletCommon.Wallet>>({ method: 'GET', url: '/api/v1/wallets/info', query })
}


// 获取总金额
export function getWalletTotalAmount(query: ServerCoreWallet.GetWalletTotalAmountCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.GetWalletTotalAmountResult>>({ method: 'GET', url: '/api/v1/wallets/count', query })
}


// 获取所有用户钱包列表(UserType是被查询的用户的)
export function list(query: ServerCoreWallet.ListUserWalletsCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.ListUserWalletsResult>>({ method: 'GET', url: '/api/v1/wallets', query })
}


// 充值
export function recharge(data: ServerCoreWallet.UserWalletRechargeCommandWithoutPath, pathParams: ServerCoreWallet.UserWalletRechargeCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.UserWalletRechargeResult>>({ method: 'POST', url: `/api/v1/wallets/${pathParams.walletID}/recharge`, data })
}


// 转账
export function transfer(data: ServerCoreWallet.UserWalletTransferCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PATCH', url: '/api/v1/wallets/transfer', data })
}


// 提现申请
export function withdrawalApplication(data: ServerCoreWallet.WithdrawalApplicationCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.WithdrawalApplicationResult>>({ method: 'POST', url: '/api/v1/wallets/withdrawal-application', data })
}


// 钱包(余额)
const walletsApi = {
    getUserWallet, getWalletTotalAmount, list, recharge, transfer, withdrawalApplication
}

export default walletsApi
