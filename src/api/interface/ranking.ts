
import request from "../request";


// 新增排名
export function create(data: PkgCustomerRanking.CreateCommand) {
    return request<BasicTypes.DefaultResponseWrapper<PkgCustomerRanking.CreatedResult>>({ method: 'POST', url: '/api/v1/ranking', data })
}


// 取得排名
export function get(pathParams: PkgCustomerRanking.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<PkgCustomerRanking.Ranking>>({ method: 'GET', url: `/api/v1/ranking/${pathParams.id}` })
}


// 获取排名列表
export function list() {
    return request<BasicTypes.DefaultResponseWrapper<PkgCustomerRanking.Ranking[] | null>>({ method: 'GET', url: '/api/v1/ranking' })
}


// 刪除排名
export function remove(pathParams: PkgCustomerRanking.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/ranking/${pathParams.id}` })
}


// 修改排名
export function updatePartial(data: PkgCustomerRanking.UpdateCommandWithoutPath, pathParams: PkgCustomerRanking.UpdateCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/ranking/${pathParams.id}`, data })
}


// 排名
const rankingApi = {
    create, get, list, remove, updatePartial
}

export default rankingApi
