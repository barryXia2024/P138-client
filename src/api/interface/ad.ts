
import request from "../request";


// 获取广告列表(后端管理使用)
export function adminListAdApi(query: ServerCoreAd.AdminListAdCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAd.AdminListAdCommandResult>>({ method: 'GET', url: '/api/v1/ad/list/admin', query })
}


// 新增广告
export function createAdApi(data: ServerCoreAd.CreateAdCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAd.CreatedAdResult>>({ method: 'POST', url: '/api/v1/ad', data })
}


// 刪除广告
export function deleteAdApi(pathParams: ServerCoreAd.DeleteAdCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/ad/${pathParams.adID}` })
}


// 根据广告ID获取弹窗
export function getAdApi(pathParams: ServerCoreAd.GetAdCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAd.Ad>>({ method: 'GET', url: `/api/v1/ad/get/${pathParams.adID}` })
}


// 获取广告列表(C端或者B端使用)
export function listAdApi(query: ServerCoreAd.ListAdCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAd.Ad[] | null>>({ method: 'GET', url: '/api/v1/ad/list', query })
}


// 修改广告
export function updateAdApi(data: ServerCoreAd.UpdateAdCommandWithoutPath, pathParams: ServerCoreAd.UpdateAdCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAd.Ad>>({ method: 'PATCH', url: `/api/v1/ad/${pathParams.adID}`, data })
}


// 1.开启动图 2.开机弹窗(引导图) 3.首页弹窗图 4.跑马灯 5.轮播图广告 6.消息推送(赛事通知)管理
const adApi = {
    adminListAdApi, createAdApi, deleteAdApi, getAdApi, listAdApi, updateAdApi
}

export default adApi
