
declare namespace CoreFollowHall {

    interface BetContentDigitalLottery {
        betContentDigitalLotteryID?: string;
        betPlay: string;
        playType: string | null;
        betItem: string;
        betAmount: string;
        betMultiple: number;
        result?: string;
        prizeLevel?: string;
        matched?: string;
        winAmount?: string;
        isWin?: boolean;
        orderItemID?: string;
    }

    interface BetContentSportsLottery {
        betContentSportsLotteryID?: string;
        competitionSessions: string;
        competitionId: number;
        competitionTime: string;
        matchScore?: string | null;
        halfMatchScore?: string | null;
        home: string;
        away: string;
        orderItemID?: string;
        betPlayList: BetPlayInfo[] | null;
    }

    interface BetPlayInfo {
        home?: string;
        away?: string;
        competitionId: number;
        betPlay?: CoreCommonEnum.PlayName;
        betPlayEnglishName?: CoreCommonEnum.PlayEnglishName;
        betHandicap?: string | null;
        betItem: string;
        betOdds?: number;
        result: string | null;
        hasHit: CoreCommonEnum.HasHit | null;
        kjOdds?: string | null;
        playType?: string | null;
        orderItemID?: string | null;
        competitionSessions: string | null;
    }

    interface FollowOrder {
        shopCode: number;
        username: string;
        orderID: string;
        vipLevel: number;
        orderNo: string;
        userID: string;
        nickname: string;
        avatar: string;
        declaration: string;
        orderType: CoreCommonEnum.OrderType;
        betAmount: string;
        shopLotteryID: string;
        lotteryName: CoreCommonEnum.LotteryName;
        bettingString: string;
        buyEndTime: string;
        followNum: number;
        returnMultiple: string;
        followAmount: string;
        latestHit: string;
        winStreak: number;
        loseStreak: number;
        hitRate: number;
        profitability: string;
        followWin: number;
    }

    interface FollowOrderInfo {
        avatar: string;
        nickname: string;
        username: string;
        createdAt: number;
        lotteryName: CoreCommonEnum.LotteryName;
        bettingString: string;
        betAmount: string;
        orderStatus: CoreCommonEnum.OrderStatus;
        orderNo: string;
        orderID: string;
        userID: string;
        returnMultiple: string;
        calcAmount: string;
        vipLevel: number;
    }

    interface GetFollowAmountLimitResult {
        amountLimit: string;
    }

    interface GetMyTrackingOrderCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface GetMyTrackingOrderCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode: number | null;
        userID: string | null;
    }

    interface GetMyTrackingOrderPlanCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface GetMyTrackingOrderPlanCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode: number | null;
        userID: string | null;
    }

    interface GetMyTrackingOrderPlanResult {
        list: TrackingOrderPlanInfo[] | null;
        total: number;
        query: GetMyTrackingOrderPlanCommand;
    }

    interface GetMyTrackingOrderResult {
        list: FollowOrderInfo[] | null;
        total: number;
        query: GetMyTrackingOrderCommand;
    }

    interface GetTrackAchievementsCommandQuery {
        shopCode: number;
        userID: string;
    }

    interface GetTrackAchievementsResult {
        nickname: string;
        username: string;
        avatar: string;
        userID: string;
        shopCode: number;
        fansNum: number;
        followNum: number;
        isFollow: boolean;
        copyRedNum: number;
        totalAmount: string;
        profit: string;
        totalNum: number;
        winNum: number;
        getFiveTermWinStatus: string;
        latestWinStatus: string;
        orderMarking: string;
        vipLevel: number;
        commission: string;
        winStreak: number;
    }

    interface GetTrackingOrderCountCommandQuery {
        userID: number;
    }

    interface GetTrackingOrderCountResult {
        count: number;
    }

    interface GetTrackingOrderItemCommandPathParams {
        orderNo: string;
    }

    interface GetTrackingOrderItemResult {
        trackingOrderUsers: TrackingOrderUser[] | null;
        trackingOrderUserCount: number;
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        refundedAt: number;
        orderType: CoreCommonEnum.OrderType;
        orderCategory: CoreCommonEnum.OrderCategory;
        ticketType?: CoreCommonEnum.TicketType;
        ticketNumber: number | null;
        shopName: string;
        shopCode: number;
        shopkeeperID: string;
        ticketShopCode: number;
        ticketShopName: string;
        ticketShopkeeperID: string;
        postOrderShopCode: number;
        postOrderShopName: string;
        postOrderShopkeeperID: string;
        commission: string;
        commissionRate: string;
        postOrderUserCommission: string;
        postOrderShopCommission: string;
        followOrderShopCommission: string;
        ticketShopCodeCommission: string;
        agentOrderCommission: string;
        ticketShopServiceFee?: string;
        serviceChargeCommission?: string;
        dispatchOrderCommission?: string;
        dispatchOrderCommissionRate?: string;
        postOrderUsername: string;
        postOrderUserID: string;
        single: boolean;
        playType: string | null;
        betPlay: string | null;
        nickname: string | null;
        phoneNumber: string;
        totalNumber: number | null;
        currentNumber: number | null;
        chaseNumberRecordID: string;
        mixAmount: string | null;
        betAmount: string;
        chaseNumberTotalBetAmount: string;
        estimatedBonus: string;
        winMixAmount: string;
        optimization: string;
        optimizationType: ServerCoreOrder.OptimizationType;
        operateName: string | null;
        operateUserID: string;
        OperateUserType: ServerCoreUser.UserType;
        operateNickName: string | null;
        stopAfterWin: boolean | null;
        ticketTime: any;
        distributePrizeTime: any;
        returnTicketUrl: string | null;
        lotteryIcon: string | null;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName | null;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo: string;
        betCount: number;
        buyEndTime: string;
        winAmount: string;
        calcAmount: string;
        returnAmount: string;
        orderStatusChinese: string;
        paymentStatus: ServerCoreOrder.PaymentStatus;
        username: string;
        userID: string;
        lotteryNumber: string | null;
        betMultiple: number;
        bettingString: string;
        remark: string;
        returnMultiple: string;
        needUploadTicket: boolean;
        ticketUrl?: string;
        orderParentID: string;
        parentAgentUserID: string;
        recommenderID: string;
        orderParentNo: string;
        shopLotteryID: string;
        orderNo: string;
        currentOrderNo: string;
        append: CoreCommonEnum.AppendType;
        programContent: CoreCommonEnum.PostsOrderType | null;
        bonusDetailList: string | null;
        betContentDigitalLotteryList: BetContentDigitalLottery[] | null;
        betContentSportsLotteryList: BetContentSportsLottery[] | null;
        betContentTraditionalLotteryList: BetContentSportsLottery[] | null;
        cancelTimestamp: number;
        orderStatus: CoreCommonEnum.OrderStatus;
        playName: string;
        paymentMethod?: ServerCoreOrder.PaymentMethod;
        frontEndOnly?: string;
        declaration?: string;
        followAmount?: string;
        followNum?: number;
        curOrderFdTotalWinAmount: string;
        curOrderFdSelfWinAmount: string;
        curOrderProfitAmount: string;
        curOrderProfitability: string;
        curOrderExpectTotalWinAmount: string;
        acceptOrderType?: CoreCommonEnum.AcceptOrderType;
        traceId?: string;
        winNoticeSent?: boolean;
        cooperationShopLotteryID?: string;
        cooperationID?: string;
        cooperationShopWalletID?: string;
        orderUserWalletID?: string;
        serviceChargeWalletID?: string;
        postOrderUserWalletID?: string;
        postOrderShopWalletID?: string;
        ticketShopWalletID?: string;
        platformWalletID?: string;
        cooperationCommissionRate?: string;
        serviceChargeCommissionRate?: string;
        transactionID?: string;
        profit: number;
        totalNum: number;
        winNum: number;
        orderMarking: string;
        totalFdCount: number;
        totalHitRate: number;
        totalProfitability: string;
        winStreak: number;
        loseStreak: number;
    }

    interface GetUserPostsOrderListCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface GetUserPostsOrderListCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode: number | null;
        userID: string | null;
    }

    interface GetUserPostsOrderListResult {
        list: PostsOrderItem[] | null;
        total: number;
        query: GetUserPostsOrderListCommand;
    }

    interface ListOrderTrackHallCommand {
        current?: number;
        pageSize?: number;
    }

    interface ListOrderTrackHallCommandQuery {
        current?: number;
        pageSize?: number;
        nickname: string | null;
        leaderboardType: LeaderboardType | null;
        sortBy: LeaderboardSort | null;
        single: boolean | null;
    }

    interface ListOrderTrackHallResult {
        list: FollowOrder[] | null;
        total: number;
        query: ListOrderTrackHallCommand;
    }

    interface PostsOrderItem {
        shopLotteryID: string;
        lotteryName: CoreCommonEnum.LotteryName;
        bettingString: string;
        orderType: CoreCommonEnum.OrderType;
        expectedReturn: number;
        buyEndTime: string;
        orderStatus: CoreCommonEnum.OrderStatus;
        orderNo: string;
        orderID: string;
        followNum: number;
        betAmount: string;
        betFreePass: string;
        calcAmount: string;
        followAmount: string;
        commission: string;
    }

    interface SearchUserCommandQuery {
        nickname: string | null;
    }

    interface SearchUserResult {
        userList: UserRow[] | null;
    }

    interface TrackingOrderPlanInfo {
        createdAt: number;
        buyEndTime: string;
        lotteryName: CoreCommonEnum.LotteryName;
        bettingString: string;
        betAmount: string;
        orderStatus: CoreCommonEnum.OrderStatus;
        orderNo: string;
        orderID: string;
        followNum: number;
        followAmount: string;
        calcAmount: string;
    }

    interface TrackingOrderUser {
        nickname: string;
        username: string;
        userID: string;
        orderID: string;
        orderNo: string;
        betAmount: string;
        calcAmount: string;
        commission: string;
    }

    interface UserRow {
        nickname: string;
        userID: string;
        fansNum: number;
        totalNum: number;
        winNum: number;
        avatar: string;
        shopCode: number;
    }


    type LeaderboardSort = 'default' | 'followNum' | 'betAmount';

    // 1: 连赢榜, 2: 禁用FAQ, 3: 盈利榜
    type LeaderboardType = 1 | 2 | 3;

}
