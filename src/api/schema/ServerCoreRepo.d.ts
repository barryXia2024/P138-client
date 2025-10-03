
declare namespace ServerCoreRepo {

    interface Message {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        createBy: string;
        updateBy: string;
        msgType: MsgType;
        userType: ServerCoreUser.UserType;
        msgTypeName: string;
        msgSubType: number;
        msgSubTypeName: string;
        content: string;
        hasPushed: boolean;
        title: string;
        remark: string;
    }

    interface OrderFollowSetting {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        amountLimit?: string;
        commissionRate?: number;
        deleteAt?: number;
        createBy?: string;
        updateBy?: string;
        subscribeMinAmount: string;
        autoStopMultiple: number;
        autoStopFixed: number;
        stopAfterWin: boolean;
    }

    interface PlatformActivityReferralCompetition {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        shopCode: number;
        userID: string;
        userType: ServerCoreUser.UserType;
        referralCount: number;
        authenticatedCount: number;
        totalInviteAmount: string;
        actStartTime: number;
        actEndTime: number;
        activityID: string;
    }

    // 1: 跟单失败, 2: 跟单成功
    type AutoFollowStatus = 1 | 2;

    // 2: 开启, 1: 停止
    type FollowSubscribeStatus = 2 | 1;

    // 2: 倍投, 1: 固定金额
    type FollowSubscribeType = 2 | 1;

    // 0: 未读, 1: 已读
    type MessageReadStatus = 0 | 1;

    // 1: 订单, 2: 福袋, 3: 红包, 4: 公告, 5: 合作店铺消息
    type MsgType = 1 | 2 | 3 | 4 | 5;

    // 1: 关闭加密, 2: 开启加密
    type RequestParamCryptoStatus = 1 | 2;

}
