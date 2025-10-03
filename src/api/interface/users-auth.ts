
import request from "../request";


// 审核用户头像(后台管理使用)
export function approvedUserAvatarApi(data: ServerCoreAuth.ApprovedUserAvatarCommandWithoutPath, pathParams: ServerCoreAuth.ApprovedUserAvatarCommandPathParams) {
    return request<BasicTypes.DefaultResponseWrapper<undefined>>({ method: 'POST', url: `/api/v1/users/auth/${pathParams.userID}/approved/avatar`, data })
}


// 用户登出接口
export function createSignOut(data: ServerCoreAuth.UserSignOutCommandWithoutPath, pathParams: ServerCoreAuth.UserSignOutCommandPathParams, header: ServerCoreAuth.UserSignOutCommandHeaderWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.UserSignOutResult>>({ method: 'POST', url: `/api/v1/users/auth/${pathParams.userID}/sign-out`, data, header })
}


// 解析推荐信息
export function decodeReferralUrl(query: ServerCoreAuth.DecodeReferralUrlCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.DecodeReferralUrlCommandResult>>({ method: 'GET', url: '/api/v1/users/auth/decode-referral-info', ignoreAuth: true, query })
}


// 获取验证码
export function generatorCaptcha() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.GenerateCaptchaResult>>({ method: 'GET', url: '/api/v1/users/auth/captcha', ignoreAuth: true })
}


// 生成用户推荐链接
export function generatorReferralUrl(pathParams: ServerCoreAuth.GenerateReferralUrlCommandPathParams, header: ServerCoreAuth.GenerateReferralUrlCommandHeaderWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<string>>({ method: 'GET', url: `/api/v1/users/auth/${pathParams.userID}/referral-url`, header })
}


// 邀请争霸赛
export function getReferralCompetition() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreRepo.PlatformActivityReferralCompetition[] | null>>({ method: 'GET', url: '/api/v1/users/auth/get-referral-competition' })
}


// 邀请统计
export function getReferralStatic(query: ServerCoreAuth.GetReferralStaticCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.ShopkeeperUserInviteStatistic>>({ method: 'GET', url: '/api/v1/users/auth/get-referral-static', query })
}


// 获取用户基本信息
export function getUserBasicInfoApi(pathParams: ServerCoreAuth.GetUserBasicInfoCommandPathParams, header: ServerCoreAuth.GetUserBasicInfoCommandHeaderWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreUser.User>>({ method: 'GET', url: `/api/v1/users/auth/${pathParams.userID}/basic-info`, header })
}


// 获取用户基本信息(包括用户类型,用户ID,用户所属商店,用户钱包)
export function getUserInfo(pathParams: ServerCoreAuth.GetUserInfoCommandPathParams, header: ServerCoreAuth.GetUserInfoCommandHeaderWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.GetUserInfoResult>>({ method: 'GET', url: `/api/v1/users/auth/user-info/${pathParams.userID}`, header })
}


// 获取用户登录日志
export function getUserLoginLogApi(query: ServerCoreAuth.GetUserLoginLogCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.GetUserLoginLogResult>>({ method: 'GET', url: '/api/v1/users/auth/user-login-log', query })
}


// 邀请查询(邀请列表和数量)
export function listReferralInfo(query: ServerCoreAuth.ListReferralInfoCommandQuery, header: ServerCoreAuth.ListReferralInfoCommandHeader) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.ListReferralInfoResult>>({ method: 'GET', url: '/api/v1/users/auth/list-referral-info', query, header })
}


// 获取邀请奖励记录
export function listReferralReward(query: ServerCoreAuth.ListReferralRewardCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.ListReferralRewardResult>>({ method: 'GET', url: '/api/v1/users/auth/list-referral-reward', query })
}


// 获取用户列表(主播列表)
export function listUser(query: ServerCoreAuth.ListUserCommandQuery, header: ServerCoreAuth.ListUserCommandHeader) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.PageData>>({ method: 'GET', url: '/api/v1/users/auth/list/user', query, header })
}


// 获取消息服务和JWT认证信息
export function mqttRefreshTokenApi() {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.MQTTToken>>({ method: 'GET', url: '/api/v1/users/auth/mqtt/refresh-token' })
}


// 用户oauth2刷新token
export function oauthRefreshTokenApi(query: ServerCoreAuth.Oauth2RefreshTokenCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.OAuthToken>>({ method: 'GET', url: '/api/v1/users/auth/oauth2/refresh-token', ignoreAuth: true, query })
}


// 用户刷新openIM token
export function refreshOpenimTokenApi(query: ServerCoreAuth.RefreshOpenIMTokenCommandQuery) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreOpenim.TokenData>>({ method: 'GET', url: '/api/v1/users/auth/oauth2/refresh-openim-token', ignoreAuth: true, query })
}


// 用户注销接口
export function userLogoutApi(pathParams: ServerCoreAuth.LogoutCommandPathParams, header: ServerCoreAuth.LogoutCommandHeaderWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'DELETE', url: `/api/v1/users/auth/${pathParams.userID}/logout`, header })
}


// 用户重置密码
export function userResetPasswordApi(data: ServerCoreAuth.UserResetPasswordCommand, header: ServerCoreAuth.UserResetPasswordCommandHeader) {
    return request<BasicTypes.DefaultResponseWrapper<null>>({ method: 'PUT', url: '/api/v1/users/auth/reset/password', ignoreAuth: true, data, header })
}


// 用户登入接口
export function userSignInApi(data: ServerCoreAuth.UserSignInCommand) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.UserSignInResult>>({ method: 'POST', url: '/api/v1/users/auth/sign-in', ignoreAuth: true, data })
}


// 修改人用户基本信息
export function userUpdateBasicInfoApi(data: ServerCoreAuth.UpdateBasicInfoCommandWithoutPath, pathParams: ServerCoreAuth.UpdateBasicInfoCommandPathParams, header: ServerCoreAuth.UpdateBasicInfoCommandHeaderWithoutPath) {
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.UpdateBasicInfoResult>>({ method: 'PATCH', url: `/api/v1/users/auth/${pathParams.userID}/basic-info`, data, header })
}


// 用户认证API
const usersAuthApi = {
    approvedUserAvatarApi, createSignOut, decodeReferralUrl, generatorCaptcha, generatorReferralUrl, getReferralCompetition, getReferralStatic, getUserBasicInfoApi, getUserInfo, getUserLoginLogApi, listReferralInfo, listReferralReward, listUser, mqttRefreshTokenApi, oauthRefreshTokenApi, refreshOpenimTokenApi, userLogoutApi, userResetPasswordApi, userSignInApi, userUpdateBasicInfoApi
}

export default usersAuthApi
