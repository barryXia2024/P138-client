
import request from "../request";


// 创建推荐奖励规则
export function create(data: ReferralRewardRules.CreateReferralRewardRuleCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ReferralRewardRules.CreatedReferralRewardRuleResult>>({ method: 'POST', url: '/api/v1/referral/referral-reward-rules', data })
}


// 根据规则ID获取推荐奖励规则
export function get(pathParams: ReferralRewardRules.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ReferralRewardRules.ReferralRewardRule>>({ method: 'GET', url: `/api/v1/referral/referral-reward-rules/${pathParams.id}` })
}


// 获取推荐奖励规则列表
export function list() {
    return request<BasicTypes.DefaultResponseWrapper<ReferralRewardRules.ReferralRewardRule[] | null>>({ method: 'GET', url: '/api/v1/referral/referral-reward-rules' })
}


// 删除推荐奖励规则
export function remove(pathParams: ReferralRewardRules.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/referral/referral-reward-rules/${pathParams.id}` })
}


// 更新推荐奖励规则
export function updatePartial(data: ReferralRewardRules.UpdateReferralRewardRuleCommandWithoutPath, pathParams: ReferralRewardRules.UpdateReferralRewardRuleCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/referral/referral-reward-rules/${pathParams.id}`, data })
}


// 推荐奖励规则
const referralReferralRewardRulesApi = {
    create, get, list, remove, updatePartial
}

export default referralReferralRewardRulesApi
