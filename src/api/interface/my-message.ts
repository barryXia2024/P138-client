
import request from "../request";


// 新增公告或者消息(后台使用)
export function createMessageApi(data: ServerCoreMessage.CreateMessageCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreMessage.CreateMessageResult>>({ method: 'POST', url: '/api/v1/my-message', data })
}


// 删除公告或者消息(后台使用)
export function deleteMessageApi(pathParams: ServerCoreMessage.DeleteMessageCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/my-message/${pathParams.messageID}` })
}


// 按类型分类返回未读公告或者消息数量(C端使用)
export function getGroupByTypeNotReadCount(query: ServerCoreMessage.GetNotReadCountCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreMessage.GetNotReadCountResult>>({ method: 'GET', url: '/api/v1/my-message/getGroupByTypeNotReadCount', query })
}


// 获取公告或者消息详情(后台使用)
export function getMessageApi(pathParams: ServerCoreMessage.GetMessageCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreRepo.Message>>({ method: 'GET', url: `/api/v1/my-message/${pathParams.messageID}/info` })
}


// 获取我的公告或者消息列表(C端使用)
export function getMyMessageApi(query: ServerCoreMessage.GetMyMessageCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreMessage.GetMyMessageResult>>({ method: 'GET', url: '/api/v1/my-message/myMessage', query })
}


// 获取未读公告或者消息数量(C端使用)
export function getNotReadCountApi(query: ServerCoreMessage.GetNotReadCountCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<number>>({ method: 'GET', url: '/api/v1/my-message/getNotReadCount', query })
}


// 获取公告或者消息列表(后台使用)
export function listMessageApi(query: ServerCoreMessage.ListMessageCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreMessage.ListMessageResult>>({ method: 'GET', url: '/api/v1/my-message/listMessage', query })
}


// 标记公告或者消息为已读(C端使用,一键标记已读)
export function markAsReadApi(data: ServerCoreMessage.MarkAsReadCommand) {
    return request<BasicTypes.DefaultResponseWrapper<number>>({ method: 'POST', url: '/api/v1/my-message/oneClickRead', data })
}


// 标记公告或者消息为已读,并获取消息详情(C端使用)
export function markAsReadByMessageId(pathParams: ServerCoreMessage.MarkAsReadByMessageIDCommandPathParams, query: ServerCoreMessage.MarkAsReadByMessageIDCommandQueryWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreMessage.MarkAsReadByMessageIDResult>>({ method: 'GET', url: `/api/v1/my-message/detail/${pathParams.messageID}`, query })
}


// 发布公告或者消息(后台使用)
export function publishMessageApi(data: ServerCoreMessage.PublishMessageCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreMessage.PublishMessageResult>>({ method: 'POST', url: '/api/v1/my-message/publish', data })
}


// 修改公告或者消息(后台使用)
export function updateMessageApi(data: ServerCoreMessage.UpdateMessageCommandWithoutPath, pathParams: ServerCoreMessage.UpdateMessageCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/my-message/${pathParams.messageID}`, data })
}


// 我的-我的消息
const myMessageApi = {
    createMessageApi, deleteMessageApi, getGroupByTypeNotReadCount, getMessageApi, getMyMessageApi, getNotReadCountApi, listMessageApi, markAsReadApi, markAsReadByMessageId, publishMessageApi, updateMessageApi
}

export default myMessageApi
