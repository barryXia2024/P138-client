
import request from "../request";


// 获取比赛聊天配置
export function getChatCompetitionConfig() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.GetChatCompetitionConfigResult>>({ method: 'GET', url: '/api/v1/competition/chat/competition/config' })
}


// 获取快捷回复
export function getChatCompetitionQuick() {
    return request<BasicTypes.DefaultResponseWrapper<string[] | null>>({ method: 'GET', url: '/api/v1/competition/chat/competition/quick' })
}


// 获取比赛聊天历史消息
export function listChatCompetitionMessageHistory(query: ServerCoreLive.ListChatCompetitionMessageHistoryCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreLive.ListChatCompetitionMessageHistoryResult>>({ method: 'GET', url: '/api/v1/competition/chat/competition/message/history', query })
}


// 比赛直播
const competitionApi = {
    getChatCompetitionConfig, getChatCompetitionQuick, listChatCompetitionMessageHistory
}

export default competitionApi
