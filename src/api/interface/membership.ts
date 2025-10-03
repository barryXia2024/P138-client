
import request from "../request";


// 新增会员等级
export function createVipLevelsApi(data: ServerCoreVip.CreateVIPCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreVip.CreateVIPResult>>({ method: 'POST', url: '/api/v1/membership', data })
}


// 删除会员等级
export function deleteVipLevelsApi(pathParams: ServerCoreVip.DeleteListVIPCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/membership/${pathParams.vipID}` })
}


// 获取最大会员等级ID
export function getMaxVipLevelidApi() {
    return request<BasicTypes.DefaultResponseWrapper<number>>({ method: 'GET', url: '/api/v1/membership/getMaxVipLevelId' })
}


// 根据会员等级ID获取会员等级信息
export function getVipLevelsByVipIdApi(pathParams: ServerCoreVip.GetVIPCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreVip.VIP>>({ method: 'GET', url: `/api/v1/membership/${pathParams.vipID}/info` })
}


// 获取会员等级code和levelID列表
export function listVipLevelcodeAndLevelidApi() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreVip.VIPLevelCodeAndLevelID[] | null>>({ method: 'GET', url: '/api/v1/membership/getVIPLevelCodeAndLevelId' })
}


// 获取会员等级列表
export function listVipLevelsApi(query: ServerCoreVip.ListVIPCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreVip.ListVIPResult>>({ method: 'GET', url: '/api/v1/membership', query })
}


// 修改会员等级
export function updateVipLevelsApi(data: ServerCoreVip.UpdateVIPCommandWithoutPath, pathParams: ServerCoreVip.UpdateVIPCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreVip.VIP>>({ method: 'PATCH', url: `/api/v1/membership/${pathParams.vipID}`, data })
}


// 会员管理
const membershipApi = {
    createVipLevelsApi, deleteVipLevelsApi, getMaxVipLevelidApi, getVipLevelsByVipIdApi, listVipLevelcodeAndLevelidApi, listVipLevelsApi, updateVipLevelsApi
}

export default membershipApi
