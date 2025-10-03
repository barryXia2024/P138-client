
import request from "../request";


// 关注
export function follow(data: HallFanFollow.FollowCommand) {
    return request<BasicTypes.DefaultResponseWrapper<HallFanFollow.FollowResult>>({ method: 'POST', url: '/api/v1/orders/follow-hall/fan-follow/follow', data })
}


// 获取粉丝列表
export function listFans(query: HallFanFollow.ListFansCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<HallFanFollow.ListFansResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/fan-follow/fans', query })
}


// 获取关注者列表
export function listFollowers(query: HallFanFollow.ListFollowerCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<HallFanFollow.ListFollowerResult>>({ method: 'GET', url: '/api/v1/orders/follow-hall/fan-follow/followers', query })
}


// 取消关注
export function unfollow(data: HallFanFollow.UnFollowCommand) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'POST', url: '/api/v1/orders/follow-hall/fan-follow/unfollow', data })
}


// 粉丝和关注
const ordersFollowHallFanFollowApi = {
    follow, listFans, listFollowers, unfollow
}

export default ordersFollowHallFanFollowApi
