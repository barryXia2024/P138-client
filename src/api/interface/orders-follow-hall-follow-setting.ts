
import request from "../request";


// 新增发单-跟单设置信息
export function createOrderFollowSetting(data: HallFollowSetting.CreateOrderFollowSettingCommand) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSetting.CreateOrderFollowSettingResult>>({ method: 'POST', url: '/api/v1/orders/follow-hall/follow-setting/create', data })
}


// 删除发单-跟单设置信息
export function deleteOrderFollowSetting(pathParams: HallFollowSetting.DeleteOrderFollowSettingCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSetting.DeleteOrderFollowSettingResult>>({ method: 'DELETE', url: `/api/v1/orders/follow-hall/follow-setting/${pathParams.followSettingID}` })
}


// 获取发单-跟单设置信息
export function getOrderFollowSetting() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreRepo.OrderFollowSetting>>({ method: 'GET', url: '/api/v1/orders/follow-hall/follow-setting' })
}


// 修改发单-跟单设置信息
export function updateOrderFollowSetting(data: HallFollowSetting.UpdateOrderFollowSettingCommandWithoutPath, pathParams: HallFollowSetting.UpdateOrderFollowSettingCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<HallFollowSetting.UpdateOrderFollowSettingResult>>({ method: 'PATCH', url: `/api/v1/orders/follow-hall/follow-setting/${pathParams.followSettingID}`, data })
}


// 发单-跟单设置
const ordersFollowHallFollowSettingApi = {
    createOrderFollowSetting, deleteOrderFollowSetting, getOrderFollowSetting, updateOrderFollowSetting
}

export default ordersFollowHallFollowSettingApi
