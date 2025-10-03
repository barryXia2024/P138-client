
import request from "../request";


// 新增发单声明
export function createDeclaration(data: FollowHallDeclaration.CreateDeclarationCommand) {
    return request<BasicTypes.DefaultResponseWrapper<FollowHallDeclaration.CreateDeclarationResult>>({ method: 'POST', url: '/api/v1/orders/follow-hall/declaration/create', data })
}


// 删除发单声明
export function deleteDeclaration(pathParams: FollowHallDeclaration.DeleteDeclarationCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<FollowHallDeclaration.DeleteDeclarationResult>>({ method: 'DELETE', url: `/api/v1/orders/follow-hall/declaration/${pathParams.declarationID}` })
}


// C端获取所有发单声明
export function getAllDeclaration() {
    return request<BasicTypes.DefaultResponseWrapper<FollowHallDeclaration.PostsOrderDeclaration[] | null>>({ method: 'GET', url: '/api/v1/orders/follow-hall/declaration/get-all-declaration' })
}


// 获取发单声明详情
export function getDeclaration(pathParams: FollowHallDeclaration.GetDeclarationCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<FollowHallDeclaration.PostsOrderDeclaration>>({ method: 'GET', url: `/api/v1/orders/follow-hall/declaration/${pathParams.declarationID}` })
}


// 获取发单声明列表
export function listDeclaration(query: FollowHallDeclaration.ListDeclarationCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<FollowHallDeclaration.ListDeclarationResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/declaration', query })
}


// 修改发单声明
export function updateDeclaration(data: FollowHallDeclaration.UpdateDeclarationCommandWithoutPath, pathParams: FollowHallDeclaration.UpdateDeclarationCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<FollowHallDeclaration.UpdateDeclarationResult>>({ method: 'PATCH', url: `/api/v1/orders/follow-hall/declaration/${pathParams.declarationID}`, data })
}


// 发单声明
const ordersFollowHallDeclarationApi = {
    createDeclaration, deleteDeclaration, getAllDeclaration, getDeclaration, listDeclaration, updateDeclaration
}

export default ordersFollowHallDeclarationApi
