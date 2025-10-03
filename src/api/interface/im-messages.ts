
import request from "../request";


// 取得单个消息
export function getMessageApiByMessageId(pathParams: CoreImMessage.GetMessagePathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreImMessage.Message>>({ method: 'GET', url: `/api/v1/im/messages/getOne/${pathParams.messageID}` })
}


// 拉取消息
export function listMessageTypeApi(pathParams: CoreImMessage.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<CoreImMessage.Message[] | null>>({ method: 'GET', url: `/api/v1/im/messages/${pathParams.roomID}` })
}


// 消息
const imMessagesApi = {
    getMessageApiByMessageId, listMessageTypeApi
}

export default imMessagesApi
