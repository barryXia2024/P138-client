
import request from "../request";


// 创建彩票商店(后台使用,B端不需要调用这个API)
export function createShopApi(data: ServerCoreShop.CreateShopCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreShop.CreateShopResult>>({ method: 'POST', url: '/api/v1/lottery/shop', data })
}


// 删除店铺
export function deleteShop(pathParams: ServerCoreShop.DeleteShopCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/lottery/shop/delete/${pathParams.shopCode}` })
}


// 根据彩票商店编码获取商店信息(getShopMessage)
export function getByShopCodeApi(pathParams: ServerCoreShop.ShopCodePathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreShop.LotteryShop>>({ method: 'GET', url: `/api/v1/lottery/shop/shopCode/${pathParams.shopCode}/getShopMessage` })
}


// 获取彩票商店列表
export function listShopApi(query: ServerCoreShop.ListShopCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreShop.PageData>>({ method: 'GET', url: '/api/v1/lottery/shop', query })
}


// 后台管理获取彩票商店列表V2
export function listShopApiAdmin(query: ServerCoreShop.ListShopV2CommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreShop.ListShopV2Result>>({ method: 'GET', url: '/api/v1/lottery/shop/list-shop', query })
}


// 注销店铺
export function logoutShopApi(pathParams: ServerCoreShop.LogoutShopCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/lottery/shop/${pathParams.shopCode}` })
}


// 店铺设置-店铺信息
export function settingShopBasicInfoApi(data: ServerCoreShop.SettingShopCommandWithoutPath, pathParams: ServerCoreShop.SettingShopCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PATCH', url: `/api/v1/lottery/shop/${pathParams.shopCode}`, data })
}


// 店铺入驻
export function settledInShopApi(data: ServerCoreShop.SettledInShopCommandWithoutPath, pathParams: ServerCoreShop.SettledInShopCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PUT', url: `/api/v1/lottery/shop/${pathParams.shopCode}`, data })
}


// 修改店铺信息
export function updateShop(data: ServerCoreShop.UpdateShopCommandWithoutPath, pathParams: ServerCoreShop.UpdateShopCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PATCH', url: `/api/v1/lottery/shop/update/${pathParams.shopCode}`, data })
}


// 彩票店铺
const lotteryShopApi = {
    createShopApi, deleteShop, getByShopCodeApi, listShopApi, listShopApiAdmin, logoutShopApi, settingShopBasicInfoApi, settledInShopApi, updateShop
}

export default lotteryShopApi
