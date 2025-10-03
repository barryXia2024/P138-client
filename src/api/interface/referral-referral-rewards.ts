
import request from "../request";


// 创建推荐奖励
export function create(data: ReferralReferralRewards.CreateReferralRewardCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ReferralReferralRewards.CreatedReferralRewardResult>>({ method: 'POST', url: '/api/v1/referral/referral-rewards', data })
}


// 根据推荐奖励ID获取奖励信息
export function get(pathParams: ReferralReferralRewards.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<ReferralReferralRewards.ReferralReward>>({ method: 'GET', url: `/api/v1/referral/referral-rewards/${pathParams.id}` })
}


// 获取推荐奖励列表
export function list() {
    return request<BasicTypes.DefaultResponseWrapper<ReferralReferralRewards.ReferralReward[] | null>>({ method: 'GET', url: '/api/v1/referral/referral-rewards' })
}


// 删除推荐奖励
export function remove(pathParams: ReferralReferralRewards.PathIDPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/referral/referral-rewards/${pathParams.id}` })
}


// 更新推荐奖励
export function updatePartial(data: ReferralReferralRewards.UpdateReferralRewardCommandWithoutPath, pathParams: ReferralReferralRewards.UpdateReferralRewardCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PATCH', url: `/api/v1/referral/referral-rewards/${pathParams.id}`, data })
}


// 推荐奖励
const referralReferralRewardsApi = {
    create, get, list, remove, updatePartial
}

export default referralReferralRewardsApi
