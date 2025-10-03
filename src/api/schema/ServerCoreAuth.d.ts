
declare namespace ServerCoreAuth {

    interface ApprovedUserAvatarCommandPathParams {
        userID: string;
    }

    interface ApprovedUserAvatarCommandWithoutPath {
        userType: ServerCoreUser.UserType;
        approved: boolean | null;
        approvedAvatarRemark?: string | null;
    }

    interface DecodeReferralUrlCommandQuery {
        params: string;
    }

    interface DecodeReferralUrlCommandResult {
        params: string;
    }

    interface GenerateCaptchaResult {
        sessionId: string;
        captcha: string;
    }

    interface GenerateReferralUrlCommandHeaderWithoutPath {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface GenerateReferralUrlCommandPathParams {
        userID: string;
    }

    interface GetReferralStaticCommandQuery {
        shopCode: number;
    }

    interface GetUserBasicInfoCommandHeaderWithoutPath {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface GetUserBasicInfoCommandPathParams {
        userID: string;
    }

    interface GetUserInfoCommandHeaderWithoutPath {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface GetUserInfoCommandPathParams {
        userID: string;
    }

    interface GetUserInfoResult {
        userID: string;
        username: string;
        realName: string;
        userType: ServerCoreUser.UserType;
        nickname: string;
        avatar: string;
        certification: ServerCoreUser.IdCertificationType;
        paymentMethods: string[] | null;
        balance: string;
        withdrawBalance: string;
        frozenBalance: string;
        referralCode: string;
        vipLevel: number;
        status: ServerCoreUser.Status;
        lockUntil: any;
        points: number;
        recommenderId: string;
        recommenderType: ServerCoreUser.UserType;
        recommenderCode: string;
        orderVoice: string;
        orderSoundSwitch: number;
        homePageSwitch: number;
        shopInformationSwitch: number;
        networkOrderSwitch: number;
        shopImgUrl: string;
        shopkeeperId: string;
        recomShopCode: number;
        shopCode?: number;
        shopName: string;
        shopReferralCode: string;
        shopkeeperName: string;
        shopIcon: string;
        shopTelephone: string;
        shopNoticePic: string;
        shopNoticeImage: string | null;
        lotteryTypes: string[] | null;
        shopType: ServerCoreShop.ShopType;
        staffCount?: number;
        dailyTicketSalesVolume?: number;
        dailySalesAmount?: number;
        commissionRate?: string;
        shopStatus: ServerCoreShop.ShopStatus;
        userRole: ServerCoreUser.UserRole;
        rechargeMinAmount?: string;
        rechargeMaxAmount?: string;
        withdrawMinAmount?: string;
        withdrawMaxAmount?: string;
        withdrawMaxCount?: number;
        shopPaymentMethods: string[] | null;
        withdrawalType: ServerCoreShop.WithdrawalType;
        shopWalletId: string;
        ticketRate?: number;
        autoTicket: ServerCoreShop.AutoTicketType;
        autoTicketMin: number;
        autoTicketMax: number;
        autoReceiveMin: number;
        autoReceiveMax: number;
        shopNotice: string | null;
        shopPhone: string | null;
        shopWechat: string | null;
        province: string | null;
        city: string | null;
        district: string | null;
        shopDetailedAddress: string | null;
        headImg: string | null;
        searchValue: string | null;
        shopBalance: string | null;
        shopWithdrawBalance: string | null;
        recommenderUsername: string;
        referralUrl?: string;
        shareUrl?: string;
        shopKeeperShareUrl?: string;
        createdAt: number;
        isAgent: boolean;
        isStarUser: boolean;
        ancestors: string[] | null;
        agentLevel: number | null;
        parentAgentUserId: string | null;
        parentAgentUserType: ServerCoreUser.UserType | null;
        parentAgentReferralCode: string | null;
        parentAgentUsername: string | null;
        parentAgentCommissionRatio: number | null;
        proxyShare: string;
        remark: string | null;
    }

    interface GetUserLoginLogCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode?: number | null;
        userType?: ServerCoreUser.UserType | null;
        deviceID?: string | null;
        username?: string | null;
        userID?: string | null;
    }

    interface GetUserLoginLogCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode?: number | null;
        userType?: ServerCoreUser.UserType | null;
        deviceID?: string | null;
        username?: string | null;
        userID?: string | null;
    }

    interface GetUserLoginLogResult {
        list: UserLoginLog[] | null;
        total: number;
        query: GetUserLoginLogCommand;
    }

    interface ListReferralInfoCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        referralCode?: string;
    }

    interface ListReferralInfoCommandHeader {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface ListReferralInfoCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        referralCode?: string;
    }

    interface ListReferralInfoResult {
        list: ListReferralInfoRow[] | null;
        total: number;
        query: ListReferralInfoCommand;
        totalAmount?: string;
    }

    interface ListReferralInfoRow {
        status: ServerCoreUser.Status;
        shopCode: number;
        shopName: string;
        ticketAmount: string;
        ticketCommission: number;
        createdAt: number;
        avatar: string;
        shopStatus: ServerCoreShop.ShopStatus;
        username: string;
        userID: string;
    }

    interface ListReferralRewardCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode?: number | null;
        userType?: ServerCoreUser.UserType | null;
    }

    interface ListReferralRewardCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number | null;
        userType?: ServerCoreUser.UserType | null;
    }

    interface ListReferralRewardResult {
        list: ListReferralRewardRow[] | null;
        total: number;
        query: ListReferralRewardCommand;
    }

    interface ListReferralRewardRow {
        shopCode: number;
        shopName: string;
        settledInAt?: number;
        avatar: string;
        shopStatus: ServerCoreShop.ShopStatus;
        username: string;
        userID: string;
        rewardAmount: string;
        rewardAmountInt: number;
    }

    interface ListUserCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface ListUserCommandHeader {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface ListUserCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        status?: ServerCoreUser.Status | null;
        avatarToBeReviewed?: boolean | null;
    }

    interface LoginPasswordCommand {
        oldLoginPassword?: string;
        newLoginPassword?: string;
    }

    interface LogoutCommandHeaderWithoutPath {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface LogoutCommandPathParams {
        userID: string;
    }

    interface MQTTToken {
        token: string;
        websocketAddress: string;
        brokerAddress: string;
        'expires_in': number;
        expiry: any;
        topic: string;
        deviceID: string;
        iat: number;
        username: string;
    }

    interface OAuthToken {
        'access_token': string;
        'token_type': string;
        'expires_in': number;
        'refresh_token'?: string;
        expiry: any;
    }

    interface Oauth2RefreshTokenCommandQuery {
        refreshToken: string;
    }

    interface PageData {
        list: User[] | null;
        total: number;
        query: ListUserCommand;
    }

    interface RefreshOpenIMTokenCommandQuery {
        userType: ServerCoreUser.UserType;
        userID: string;
        platform: BasicTypes.Platform;
    }

    interface Resource {
        identifier: string;
        description?: string;
        children?: Resource[] | null;
    }

    interface ShopkeeperUserInviteStatistic {
        totalAmount: string;
        totalAmountStr: string;
        commission: string;
        commissionRate: string;
        totalInviteCount: number;
        totalInviteAmount: string;
        singleInviteAmount: string;
        validInviteCount: number;
        withdrawAmount: string;
    }

    interface TokenData {
        token: string;
        expireTimeSeconds: number;
    }

    interface UpdateBasicInfoCommandHeaderWithoutPath {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface UpdateBasicInfoCommandPathParams {
        userID: string;
    }

    interface UpdateBasicInfoCommandWithoutPath {
        nickname?: string;
        email?: string;
        phoneNumber?: string;
        idCardNumber?: string;
        realName?: string;
        avatar?: string;
        avatarToBeReviewed?: string;
        status?: ServerCoreUser.Status;
        staffName?: string;
        loginPasswordInfo?: LoginPasswordCommand;
    }

    interface UpdateBasicInfoResult {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        username: string;
        referralCode: string;
        nickname: string;
        phoneNumber: string;
        idCardNumber: string;
        certification: ServerCoreUser.IdCertificationType;
        userType: ServerCoreUser.UserType;
        realName: string;
        remark: string | null;
        email: string;
        avatar: string;
        approved: boolean;
        approvedAvatarRemark: string;
        avatarToBeReviewed: string;
        status: ServerCoreUser.Status;
        lockUntil: any;
        recommenderId: string;
        recommenderType: ServerCoreUser.UserType;
        recommenderCode: string;
        recommenderUsername: string | null;
        isAgent: boolean;
        isStarUser: boolean;
        isOrderUser: boolean | null;
        ancestors: string[] | null;
        agentLevel: number | null;
        parentAgentUserId: string | null;
        parentAgentUserType: ServerCoreUser.UserType | null;
        parentAgentReferralCode: string | null;
        parentAgentUsername: string | null;
        parentAgentCommissionRatio: number | null;
        shopId: string;
        walletID: string;
        shopKeeperID: string;
        shopCode: number;
        userRole: ServerCoreUser.UserRole | null;
        onlineStatus: number;
        proxyTime: number | null;
        loginIP: string | null;
        lastLoginTime: number | null;
        proxyStatus: boolean;
        proxyShare: string;
        platform: BasicTypes.Platform;
        deviceID: string | null;
        deviceIDList: string[] | null;
        registryDeviceSystem: number;
        publicKeyPemDecryptKey: string;
        publicKeyPemDecryptIV: string;
        registerCount: number;
        staffName: string;
        orderSoundSwitch: ServerCoreUser.OrderSoundSwitch;
        orderVoice: string;
        vipLevel: number;
        score: number;
        upScore: number;
        chatFlag: boolean;
        billingCount: number;
        roles?: string[] | null;
        extraAllowedResources?: string[] | null;
        extraDeniedResources?: string[] | null;
        xxTeaSecret: string;
        aesKey: string;
        aesIV: string;
        aesPlainText: string;
        encryptedKeyHex: string;
        fansNum: number;
        followNum: number;
        fdDate: string;
        updateNickname: boolean;
        balance: string;
        withdrawBalance: string;
        frozenBalance: string;
    }

    interface User {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        username: string;
        referralCode: string;
        nickname: string;
        phoneNumber: string;
        idCardNumber: string;
        certification: ServerCoreUser.IdCertificationType;
        userType: ServerCoreUser.UserType;
        realName: string;
        remark: string | null;
        email: string;
        avatar: string;
        approved: boolean;
        approvedAvatarRemark: string;
        avatarToBeReviewed: string;
        status: ServerCoreUser.Status;
        lockUntil: any;
        recommenderId: string;
        recommenderType: ServerCoreUser.UserType;
        recommenderCode: string;
        recommenderUsername: string | null;
        isAgent: boolean;
        isStarUser: boolean;
        isOrderUser: boolean | null;
        ancestors: string[] | null;
        agentLevel: number | null;
        parentAgentUserId: string | null;
        parentAgentUserType: ServerCoreUser.UserType | null;
        parentAgentReferralCode: string | null;
        parentAgentUsername: string | null;
        parentAgentCommissionRatio: number | null;
        shopId: string;
        walletID: string;
        shopKeeperID: string;
        shopCode: number;
        userRole: ServerCoreUser.UserRole | null;
        onlineStatus: number;
        proxyTime: number | null;
        loginIP: string | null;
        lastLoginTime: number | null;
        proxyStatus: boolean;
        proxyShare: string;
        platform: BasicTypes.Platform;
        deviceID: string | null;
        deviceIDList: string[] | null;
        registryDeviceSystem: number;
        publicKeyPemDecryptKey: string;
        publicKeyPemDecryptIV: string;
        registerCount: number;
        staffName: string;
        orderSoundSwitch: ServerCoreUser.OrderSoundSwitch;
        orderVoice: string;
        vipLevel: number;
        score: number;
        upScore: number;
        chatFlag: boolean;
        billingCount: number;
        roles?: string[] | null;
        extraAllowedResources?: string[] | null;
        extraDeniedResources?: string[] | null;
        xxTeaSecret: string;
        aesKey: string;
        aesIV: string;
        aesPlainText: string;
        encryptedKeyHex: string;
        fansNum: number;
        followNum: number;
        fdDate: string;
        updateNickname: boolean;
        balance: string;
        withdrawBalance: string;
        frozenBalance: string;
    }

    interface UserLoginLog {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        userType: ServerCoreUser.UserType;
        deviceID: string;
        username: string;
        userID: string;
        shopCode: number;
        platform: BasicTypes.Platform;
        userAgent: string;
        clientIP: string;
        traceID: string;
    }

    interface UserResetPasswordCommand {
        userID?: string;
        isReset?: boolean;
        loginPasswordInfo?: LoginPasswordCommand;
        paymentPassword?: string;
    }

    interface UserResetPasswordCommandHeader {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface UserSignInCommand {
        username: string;
        staffName?: string;
        password: string;
        userType: ServerCoreUser.UserType;
        actionType: ServerCoreUser.ActionType;
        referralParam?: string;
        captcha?: string;
        sessionId?: string;
        email?: string;
        phoneNumber?: string;
        referralCode?: string;
        shopId?: string;
        shopCode?: number;
        roles?: string[] | null;
        extraAllowedResources?: string[] | null;
        extraDeniedResources?: string[] | null;
        platform?: BasicTypes.Platform;
    }

    interface UserSignInResult {
        userID: string;
        username: string;
        phoneNumber: string;
        userType: ServerCoreUser.UserType;
        referralUrl?: string;
        shopId?: string;
        shopCode?: number;
        referralCode?: string;
        token: string | null;
        oAuthToken: OAuthToken;
        balance: string;
        walletID?: string;
        imgUrl: string;
        realName?: string | null;
        cardNo?: string | null;
        accountBank?: string | null;
        accountPlace?: string | null;
        alipayAccount?: string | null;
        lastLoginShopId?: string;
        winningAmount?: string;
        withdrawBalance?: number;
        minWithdrawBalance?: number;
        maxWithdrawBalance?: number;
        recommenderId?: string;
        proxyShare?: string;
        fansNum?: number;
        followNum?: number;
        copyWinPrize?: string;
        copyRedNum?: number;
        togetherWinPrize?: string;
        togetherMaxWinPrize?: string;
        togetherRedNum?: number;
        staff?: number;
        shareUrl?: string;
        imUrl?: string;
        shopKeeperShareUrl?: string;
        shopCooperationUrl?: string;
        starMark?: number;
        recommenderUsername?: string;
        createTime?: string;
        proxyStatus?: string;
        recommenderImg?: string;
        recommenderRegisterTime: string;
        remark?: string | null;
        orderVoice?: string;
        orderSoundSwitch?: number;
        platformCustomer?: string;
        parentUniImId?: string;
        isOperator?: number;
        withdrawMaxCount?: number;
        weChatAuthorizePath?: string;
        wxAppid?: string;
        wxPubAccount?: string;
        levelId?: number;
        score?: number;
        upScore?: number;
        lastLoginIp?: string | null;
        deviceID?: string;
        platform?: BasicTypes.Platform;
        lastLoginArea?: string | null;
        lastLoginTime?: string | null;
        yebFlag?: number;
        yebBalance?: number;
        withdrawalType?: number;
        publicKeyPemDecryptKey?: string;
        publicKeyPemDecryptIV?: string;
        userRole?: ServerCoreUser.UserRole;
        platformResource?: Resource[] | null;
        roles?: string[] | null;
        myResource?: string[] | null;
        xxTeaSecret?: string;
        aesKey?: string;
        aesIV?: string;
        encryptedKeyHex?: string;
        topic?: string;
        cooperationTopic?: string;
        openIMToken?: TokenData;
        customerServiceIDS?: string[] | null;
    }

    interface UserSignOutCommandHeaderWithoutPath {
        Authorization?: string;
        'User-Agent'?: string;
        'Accept-Language'?: string;
        'X-Locale'?: BasicTypes.Locale;
        'X-Timestamp'?: number;
        'X-Request-Id'?: string;
        'X-Device-Id'?: string;
        'X-Real-IP'?: string;
        'X-IP-Country'?: string;
        'X-IP-Region'?: string;
        'X-IP-City'?: string;
        'X-Sign'?: string;
        'X-Client-Type'?: string;
        'X-Platform'?: string;
        'X-Version'?: string;
        'X-Ca-Key'?: string;
        'X-Ca-timestamp'?: string;
        'X-Ca-nonce'?: string;
        'X-Shop-Code'?: number;
        'X-Is-Operator'?: string;
        'X-User-Type': ServerCoreUser.UserType;
        'X-Username': string;
        'X-Shop-Name'?: string;
    }

    interface UserSignOutCommandPathParams {
        userID: string;
    }

    interface UserSignOutCommandWithoutPath {
        email?: string;
    }

    interface UserSignOutResult {
        signOutSuccess: string;
    }

}
