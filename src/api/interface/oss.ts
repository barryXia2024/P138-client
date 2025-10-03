
import request from "../request";


// 新建oss文件存储配置信息
export function createOssConfigInfo(data: ServerCoreFilestroage.CreateOSSConfigCommand) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'POST', url: '/api/v1/oss/config', data })
}
createOssConfigInfo.permissionKey = "oss:create-oss-config-info"

// 获取oss上传APP配置信息以及下载URL
export function getAppDownloadUrl(query: ServerCoreFilestroage.GetOSSAuthCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.OssInfo>>({ method: 'GET', url: '/api/v1/oss/get-app-download-auth', ignoreAuth: true, query })
}


// 获取oss上传配置信息(上传文件使用)
export function getOssAuthInfo(query: ServerCoreFilestroage.GetOSSAuthCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.OssInfo>>({ method: 'GET', url: '/api/v1/oss/auth/enable', query })
}


// 获取oss文件存储配置信息
export function getOssConfigInfo(pathParams: ServerCoreFilestroage.GetOSSConfigCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.OssConfig>>({ method: 'GET', url: `/api/v1/oss/config/${pathParams.ossConfigID}` })
}
getOssConfigInfo.permissionKey = "oss:get-oss-config-info"

// 获取oss文件存储授权信息列表((上传文件使用)
export function listEnableOssOauthInfo(query: ServerCoreFilestroage.ListEnableOSSOauthInfoCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.ListEnableOSSOauthInfoCommandResult>>({ method: 'GET', url: '/api/v1/oss/auth/list', query })
}
listEnableOssOauthInfo.permissionKey = "oss:list-enable-oss-oauth-info"

// 获取oss文件存储配置信息列表
export function listOssConfigInfo(query: ServerCoreFilestroage.ListOSSConfigCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.ListOSSConfigResult>>({ method: 'GET', url: '/api/v1/oss/config/list', query })
}
listOssConfigInfo.permissionKey = "oss:list-oss-config-info"

// 修改oss文件存储配置信息
export function updateOssConfigInfo(data: ServerCoreFilestroage.UpdateOSSConfigCommandWithoutPath, pathParams: ServerCoreFilestroage.UpdateOSSConfigCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'PUT', url: `/api/v1/oss/config/${pathParams.ossConfigID}`, data })
}
updateOssConfigInfo.permissionKey = "oss:update-oss-config-info"

// 文件上传
export function uploadFileApi(pathParams: ServerCoreFilestroage.UploadFileCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreFilestroage.UploadFileApiResult>>({ method: 'POST', url: `/api/v1/oss/${pathParams.userID}` })
}
uploadFileApi.permissionKey = "oss:upload-file-api"

// 文件存储配置管理
const ossApi = {
    createOssConfigInfo, getAppDownloadUrl, getOssAuthInfo, getOssConfigInfo, listEnableOssOauthInfo, listOssConfigInfo, updateOssConfigInfo, uploadFileApi
}

export default ossApi
