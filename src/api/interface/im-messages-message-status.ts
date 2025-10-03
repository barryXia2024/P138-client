
import request from "../request";


// 取得消息状态
export function getMessageStatusApi(pathParams: ImMessageStatus.MessageStatusPathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ImMessageStatus.MessageStatus>>({ method: 'GET', url: `/api/v1/im/messages/message-status/message/${pathParams.messageStatusID}` })
}


// 获取消息状态列表
export function listMessageStatusApi(pathParams: ImMessageStatus.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ImMessageStatus.MessageStatus[] | null>>({ method: 'GET', url: `/api/v1/im/messages/message-status/${pathParams.userID}` })
}


// 通知已读消息
export function noticeUpdateMassageIsRead(pathParams: ImMessageStatus.MessageStatusPathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<any>>({ method: 'GET', url: `/api/v1/im/messages/message-status/read/${pathParams.messageStatusID}` })
}


// 消息状态
const imMessagesMessageStatusApi = {
    getMessageStatusApi, listMessageStatusApi, noticeUpdateMassageIsRead
}

export default imMessagesMessageStatusApi
