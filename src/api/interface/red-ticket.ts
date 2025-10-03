
import request from "../request";


// 获取红单回查列表
export function listRedTicket(data: CustomerRedTicket.ListRedTicketCommand) {
    return request<BasicTypes.DefaultResponseWrapper<CustomerRedTicket.ListRedTicketResult>>({ method: 'POST', url: '/api/v1/red-ticket/list', data })
}


// 我的-红单回查
const redTicketApi = {
    listRedTicket
}

export default redTicketApi
