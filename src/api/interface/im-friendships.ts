
import request from "../request";


// 添加好友
export function addFriendshipApi(data: CoreImFriendship.AddFriendshipCommandWithoutPath, pathParams: CoreImFriendship.AddFriendshipCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreImFriendship.AddFriendshipResult>>({ method: 'POST', url: `/api/v1/im/friendships/${pathParams.userID}`, data })
}


// 删除好友
export function deleteFriendshipApi(data: CoreImFriendship.DeleteFriendshipCommandWithoutPath, pathParams: CoreImFriendship.DeleteFriendshipCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'DELETE', url: `/api/v1/im/friendships/${pathParams.userID}`, data })
}


// 好友
const imFriendshipsApi = {
    addFriendshipApi, deleteFriendshipApi
}

export default imFriendshipsApi
