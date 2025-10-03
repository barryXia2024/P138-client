
import request from "../request";


// 获取所有用户钱包交易明细列表
export function getAllUserWalletTransaction(query: ServerCoreWallet.GetAllUserWalletTransactionCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.GetAllUserWalletTransactionResult>>({ method: 'GET', url: '/api/v1/wallets/transactions/getAllUserWalletTransaction', query })
}


// 获取服务费钱包交易总额(B端使用)
export function getTransactionSummary(query: ServerCoreWallet.GetTransactionSummaryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.GetTransactionSummaryResult>>({ method: 'GET', url: '/api/v1/wallets/transactions/summary', query })
}


// 获取店铺服务费钱包交易明细列表
export function listShopServiceChargeWalletTransaction(pathParams: ServerCoreWallet.GetShopServiceChargeWalletTransactionCommandPathParams, query: ServerCoreWallet.GetShopServiceChargeWalletTransactionCommandQueryWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.GetShopServiceChargeWalletTransactionResult>>({ method: 'GET', url: `/api/v1/wallets/transactions/service-charge-wallet/${pathParams.walletID}`, query })
}


// 获取用户交易明细列表
export function listWalletTransaction(pathParams: ServerCoreWallet.GetUserWalletTransactionCommandPathParams, query: ServerCoreWallet.GetUserWalletTransactionCommandQueryWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreWallet.GetUserWalletTransactionResult>>({ method: 'GET', url: `/api/v1/wallets/transactions/${pathParams.walletID}`, query })
}


// 钱包交易明细
const walletsTransactionsApi = {
    getAllUserWalletTransaction, getTransactionSummary, listShopServiceChargeWalletTransaction, listWalletTransaction
}

export default walletsTransactionsApi
