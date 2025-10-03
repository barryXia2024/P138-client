
import request from "../request";


// 建群
export function createGroupApi(data: CoreImGroup.CreateGroupCommand) {
    return request<BasicTypes.DefaultResponseWrapper<CoreImGroup.CreatedGroupResult>>({ method: 'POST', url: '/api/v1/im/groups', data })
}


// 取得群信息
export function getGroupApi(pathParams: CoreImGroup.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreImGroup.Group>>({ method: 'GET', url: `/api/v1/im/groups/${pathParams.groupID}` })
}


// 获取群列表
export function listGroupApi() {
    return request<BasicTypes.DefaultResponseWrapper<CoreImGroup.Group[] | null>>({ method: 'GET', url: '/api/v1/im/groups' })
}


// 修改群信息
export function updateGroupApi(data: CoreImGroup.UpdateGroupCommandWithoutPath, pathParams: CoreImGroup.UpdateGroupCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/im/groups/${pathParams.groupID}`, data })
}


// 群
const imGroupsApi = {
    createGroupApi, getGroupApi, listGroupApi, updateGroupApi
}

export default imGroupsApi
