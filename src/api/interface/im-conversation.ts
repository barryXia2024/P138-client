
import request from "../request";


// 获取会话列表
export function listConversationApi(query: CoreImConversation.ListConversationCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<CoreImConversation.ListConversationResult>>({ method: 'GET', url: '/api/v1/im/conversation', query })
}


// 会话管理
const imConversationApi = {
    listConversationApi
}

export default imConversationApi
