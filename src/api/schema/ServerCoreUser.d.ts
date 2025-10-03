
declare namespace ServerCoreUser {

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
        certification: IdCertificationType;
        userType: UserType;
        realName: string;
        remark: string | null;
        email: string;
        avatar: string;
        approved: boolean;
        approvedAvatarRemark: string;
        avatarToBeReviewed: string;
        status: Status;
        lockUntil: any;
        recommenderId: string;
        recommenderType: UserType;
        recommenderCode: string;
        recommenderUsername: string | null;
        isAgent: boolean;
        isStarUser: boolean;
        isOrderUser: boolean | null;
        ancestors: string[] | null;
        agentLevel: number | null;
        parentAgentUserId: string | null;
        parentAgentUserType: UserType | null;
        parentAgentReferralCode: string | null;
        parentAgentUsername: string | null;
        parentAgentCommissionRatio: number | null;
        shopId: string;
        walletID: string;
        shopKeeperID: string;
        shopCode: number;
        userRole: UserRole | null;
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
        orderSoundSwitch: OrderSoundSwitch;
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

    // 1: 推荐注册, 2: 登录, 3: 登出, 4: 注册:很少用
    type ActionType = 1 | 2 | 3 | 4;

    // 1: 未认证, 2: 已认证
    type IdCertificationType = 1 | 2;

    // 1: 打开订单提示音, 2: 关闭订单提示音
    type OrderSoundSwitch = 1 | 2;

    // 0: Active, 1: PendingLoggedOut, 3: LoggedOut
    type Status = 0 | 1 | 3 | 2;

    // 1: 用户, 2: 店铺员工, 3: 店主, 4: 主播
    type UserRole = 1 | 2 | 3 | 4;

    // 1: C端用户, 2: 店主, 3: 平台用户, 4: 员工, 5: 主播
    type UserType = 1 | 2 | 3 | 4 | 5;

}
