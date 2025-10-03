
import request from "../request";


// 创建推荐关系
export function create(data: PkgCustomerReferral.CreateReferralRelationshipCommand) {
    return request<BasicTypes.DefaultResponseWrapper<PkgCustomerReferral.CreatedReferralRelationshipResult>>({ method: 'POST', url: '/api/v1/referral', data })
}


// 根据推荐关系ID获取推荐关系
export function get(pathParams: PkgCustomerReferral.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<PkgCustomerReferral.ReferralRelationship>>({ method: 'GET', url: `/api/v1/referral/${pathParams.id}` })
}


// 获取推荐关系列表
export function list() {
    return request<BasicTypes.DefaultResponseWrapper<PkgCustomerReferral.ReferralRelationship[] | null>>({ method: 'GET', url: '/api/v1/referral' })
}


// 删除推荐关系
export function remove(pathParams: PkgCustomerReferral.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/referral/${pathParams.id}` })
}


// 更新推荐关系
export function updatePartial(data: PkgCustomerReferral.UpdateReferralRelationshipCommandWithoutPath, pathParams: PkgCustomerReferral.UpdateReferralRelationshipCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/referral/${pathParams.id}`, data })
}


// 推荐
const referralApi = {
    create, get, list, remove, updatePartial
}

export default referralApi
