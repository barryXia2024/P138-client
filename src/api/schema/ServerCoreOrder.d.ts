
declare namespace ServerCoreOrder {

    interface ArrangedFiveBetContent {
        arrangedFivePlay: CoreCommonEnum.ArrangedFivePlay;
        fixedPositionArrangedFivePlayNumbers: Record<CoreCommonEnum.FixedPositionArrangedFivePlayParamType,string[] | null> | null;
        combinationArrangedFivePlayNumbers: Record<CoreCommonEnum.CombinationArrangedFivePlayParamType,string[] | null> | null;
    }

    interface ArrangedThreeBetContent {
        arrangedThreePlay: CoreCommonEnum.ArrangedThreePlay;
        straightSelectionArrangedThreePlayNumbers: Record<CoreCommonEnum.StraightSelectionArrangedThreePlayParamType,string> | null;
        threeCombinedArrangedThreePlayNumbers: Record<CoreCommonEnum.ThreeCombinedArrangedThreePlayParamType,string> | null;
        sixCombinedArrangedThreePlayNumbers: Record<CoreCommonEnum.SixCombinedArrangedThreePlayParamType,string> | null;
        groupSelectionArrangedThreePlayNumbers: Record<CoreCommonEnum.GroupSelectionArrangedThreePlayParamType,string> | null;
    }

    interface AvgBonusDetail {
        betFreePass: string;
        betItem: string[] | null;
        multipart: number;
        odds: number;
        bonus: number;
    }

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

    interface BetItemInfo {
        betItem: string;
        betOdds: number;
        betHandicap?: string;
        betPlay: string;
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

    interface BonusCalculatorCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        betAmount: string;
        betMultiple: number;
        betTypeName: string;
        playName: string;
        matches: Match[] | null;
        freePassTypes: CoreCommonEnum.FreeParlayPassType[] | null;
        mxnParlayType: CoreCommonEnum.MXNParlayType;
        passCategory: CoreCommonEnum.PassCategory;
        superLottoBetContent: SuperLottoBetContent;
        sevenHappyBetContent: SevenHappyBetContent;
        sevenStartBetContent: SevenStarBetContent;
        arrangedFiveBetContent: ArrangedFiveBetContent;
        arrangedThreeBetContent: ArrangedThreeBetContent;
    }

    interface BonusCalculatorInfo {
        number: number;
        betAmount: number;
        minWinAmount: number;
        maxWinAmount: number;
        max: string[] | null;
        min: string[] | null;
    }

    interface BonusCalculatorResult {
        totalBetCount: number;
        totalBetAmount: number;
        minWinAmount?: number;
        maxWinAmount?: number;
        betMultiple: number;
    }

    interface BonusCalculatorV2Command {
        lotteryName: CoreCommonEnum.LotteryName;
        betAmount?: number | null;
        sessions: CompetitionSession[] | null;
        bettingString: string;
    }

    interface BonusCalculatorV2Result {
        data: BonusCalculatorInfo;
    }

    interface BonusOptimizationCommand {
        betItem: string;
        betFreePass: string;
        betAmount: string;
    }

    interface BonusOptimizationResult {
        avgBonusDetailList: AvgBonusDetail[] | null;
        hotBonusDetailList: HotBonusDetail[] | null;
        coldBonusDetailList: ColdBonusDetail[] | null;
    }

    interface ChaseNumberRecord {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        shopLotteryID: string;
        playName: string;
        shopCode: number;
        append: CoreCommonEnum.AppendType;
        userID: string;
        username: string;
        totalBetAmount: string;
        betCount: number;
        stopAfterWin: boolean;
        betContentDigitalLotteryList: BetContentDigitalLottery[] | null;
        totalNumber: number;
        currentChaseNumber: number;
        isStop: boolean;
        stoppedTime: number;
        createBy: string;
        updateBy: string;
        remark: string;
        frontEndOnly: string;
        chaseNumberStatus: CoreCommonEnum.ChaseNumberStatus;
        needUploadTicket: boolean;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
    }

    interface ColdBonusDetail {
        betFreePass: string;
        betItem: string[] | null;
        multipart: number;
        odds: number;
        bonus: number;
    }

    interface CompetitionSession {
        competitionSessions: string;
        home: string;
        away: string;
        competitionId: number;
        betItems: BetItemInfo[] | null;
    }

    interface CreateFollowOrderCommand {
        betAmount: string;
        buyEndTime: string;
        shopLotteryID: string;
        betMultiple: number;
        lotteryName: CoreCommonEnum.LotteryName;
        followOrderNo: string;
        shopCode: number;
        userID: string;
    }

    interface CreateFollowOrderResult {
        orderId: string;
        orderNo: string;
    }

    interface CreateOrderCommand {
        betAmount: string;
        userID: string;
        single: boolean;
        username: string;
        buyEndTime: string;
        shopLotteryID: string;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryType: CoreCommonEnum.LotteryType;
        winAmount: string;
        betMultiple: number;
        betPlay: string | null;
        playName: string;
        winMixAmount: string;
        betCount: number;
        shopCode: number;
        needUploadTicket: boolean;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo?: string | null;
        ticketUrl?: string | null;
        append?: CoreCommonEnum.AppendType | null;
        bettingString: string | null;
        betContentTraditionalLotteryList?: BetContentSportsLottery[] | null;
        betContentDigitalLottery?: BetContentDigitalLottery[] | null;
        betContentSportsLotteryList?: BetContentSportsLottery[] | null;
        bonusDetailList?: string | null;
        calcAmount?: string;
        cancelTimestamp?: number;
        commission: string;
        lotteryNumber: string | null;
        optimizationType?: OptimizationType;
        optimization: string;
        paymentStatus: PaymentStatus;
        paymentMethod?: PaymentMethod | null;
        remark?: string;
        returnAmount?: string;
        returnMultiple?: string;
        lotteryIcon: string | null;
        issue?: string;
        issueNum?: string;
        competitionId?: number;
        stopAfterWin?: boolean;
        chaseNumber?: number;
        frontEndOnly: string;
    }

    interface CreateOrderResult {
        orderId: string;
        orderNo: string;
    }

    interface CustomerConfirmWinningMessageCommandPathParams {
        userID: string;
    }

    interface CustomerConfirmWinningMessageCommandWithoutPath {
        orderIDList: string[] | null;
    }

    interface GetBDMxNPlaysCommandQuery {
        betPlay: CoreCommonEnum.BDBetType;
        matchCount: number;
    }

    interface GetBetRecordCountCommandPathParams {
        userID: string;
    }

    interface GetBetRecordCountResult {
        pendingTicketCount: number;
        toBeAwardedCount: number;
        winCount: number;
        todayWinAmount: string;
    }

    interface GetChaseNumberRecordDetailCommandPathParams {
        chaseNumberRecordID: string;
    }

    interface GetChaseNumberRecordDetailResult {
        amount: string;
        append: CoreCommonEnum.AppendType;
        orderStatus: CoreCommonEnum.OrderStatus;
        calcAmount: string;
        chaseNumberRecordID: string;
        isStop: boolean;
        totalBetAmount: string;
        frontEndOnly: string;
        termNo: string;
        lotteryName: CoreCommonEnum.LotteryName;
        shopLotteryID: string;
        orderStatusChinese: string;
        ticketUrl: string;
        betContentDigitalLotteryList: BetContentDigitalLottery[] | null;
        chaseNumberRecordList: ListChaseNumberRecordRow[] | null;
    }

    interface GetUserWinningBroadcastCommandPathParams {
        userID: string;
    }

    interface HotBonusDetail {
        betFreePass: string;
        betItem: string[] | null;
        multipart: number;
        odds: number;
        bonus: number;
    }

    interface ListChaseNumberCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        orderID?: string;
        orderNo?: string | null;
        userID?: string;
        orderUsername?: string | null;
        chaseNumberStatusList?: CoreCommonEnum.ChaseNumberStatus[] | null;
    }

    interface ListChaseNumberCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        orderID?: string;
        orderNo?: string | null;
        userID?: string;
        orderUsername?: string | null;
        chaseNumberStatusList?: CoreCommonEnum.ChaseNumberStatus[] | null;
    }

    interface ListChaseNumberRecordRow {
        chaseNumberRecordID: string;
        termNo: string;
        orderNo: string;
        orderID: string;
        amount: string;
        estimatedBettingTime: number;
        lotteryNumber: string;
        orderStatus: CoreCommonEnum.OrderStatus;
        orderStatusChinese: string;
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface ListChaseNumberResult {
        list: ChaseNumberRecord[] | null;
        total: number;
        query: ListChaseNumberCommand;
    }

    interface ListManualDrawOrdersCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        competitionIdList?: number[] | null;
    }

    interface ListManualDrawOrdersCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        competitionIdList?: number[] | null;
    }

    interface ListManualDrawOrdersResult {
        list: LotteryOrder[] | null;
        total: number;
        query: ListManualDrawOrdersCommand;
    }

    interface ListOrderChaseNumberTaskCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        orderID?: string;
        orderNo?: string | null;
        userID?: string;
        orderUsername?: string | null;
        shopCode?: number | null;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        chaseNumberExecutionStatus?: CoreCommonEnum.ChaseNumberExecutionStatus | null;
    }

    interface ListOrderChaseNumberTaskCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        orderID?: string;
        orderNo?: string | null;
        userID?: string;
        orderUsername?: string | null;
        shopCode?: number | null;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        chaseNumberExecutionStatus?: CoreCommonEnum.ChaseNumberExecutionStatus | null;
    }

    interface ListOrderChaseNumberTaskResult {
        list: OrderChaseNumberTask[] | null;
        total: number;
        query: ListOrderChaseNumberTaskCommand;
    }

    interface ListOrderCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        orderID?: string;
        orderNo?: string | null;
        userID?: string;
        orderUsername?: string | null;
        orderStatus?: CoreCommonEnum.OrderStatus | null;
        betRecordTabType?: CoreCommonEnum.BetRecordTabType | null;
        orderType?: CoreCommonEnum.OrderType | null;
    }

    interface ListOrderCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        orderID?: string;
        orderNo?: string | null;
        userID?: string;
        orderUsername?: string | null;
        orderStatus?: CoreCommonEnum.OrderStatus | null;
        betRecordTabType?: CoreCommonEnum.BetRecordTabType | null;
        orderType?: CoreCommonEnum.OrderType | null;
    }

    interface ListOrderResult {
        list: ListOrderRow[] | null;
        total: number;
        query: ListOrderCommand;
        totalAmount?: string;
    }

    interface ListOrderRow {
        lotteryName: CoreCommonEnum.LotteryName;
        orderType: CoreCommonEnum.OrderType;
        betPlay: string;
        betAmount: string;
        orderStatus: CoreCommonEnum.OrderStatus;
        paymentStatus: PaymentStatus;
        orderTime: number;
        returnAmount: string;
        orderId: string;
        orderNo: string;
        imgUrl: string | null;
        nickName: string | null;
        username: string | null;
        userId: string | null;
        balance: string | null;
        createdAt: number;
        orderStatusChinese: string;
        betContentDigitalLotteryList: BetContentDigitalLottery[] | null;
        betContentSportsLotteryList: BetContentSportsLottery[] | null;
        betContentTraditionalLotteryList: BetContentSportsLottery[] | null;
    }

    interface ListUserWinningBroadcastCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        orderAtStartTime?: number | null;
        orderAtEndTime?: number | null;
        userID?: string | null;
        shopCode?: number | null;
        winNoticeType?: WinNoticeType | null;
        orderID?: string | null;
        orderNo?: string | null;
        winNoticeSent?: boolean | null;
    }

    interface ListUserWinningBroadcastCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        orderAtStartTime?: number | null;
        orderAtEndTime?: number | null;
        userID?: string | null;
        shopCode?: number | null;
        winNoticeType?: WinNoticeType | null;
        orderID?: string | null;
        orderNo?: string | null;
        winNoticeSent?: boolean | null;
    }

    interface ListUserWinningBroadcastResult {
        list: WinNotice[] | null;
        total: number;
        query: ListUserWinningBroadcastCommand;
    }

    interface LotteryOrder {
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
        optimizationType: OptimizationType;
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
        paymentStatus: PaymentStatus;
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
        paymentMethod?: PaymentMethod;
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
    }

    interface Match {
        id: string;
    }

    interface OrderChaseNumberTask {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        chaseNumberRecordID: string;
        orderNo: string;
        orderID: string;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryIcon: string;
        shopLotteryID: string;
        playName: string;
        shopCode: number;
        append: CoreCommonEnum.AppendType;
        shopName: string;
        ticketShopCode: number;
        ticketShopName: string;
        ticketType: CoreCommonEnum.TicketType;
        userID: string;
        username: string;
        betAmount: string;
        chaseNumberTotalBetAmount: string;
        stopAfterWin: boolean;
        betContentDigitalLotteryList: BetContentDigitalLottery[] | null;
        currentChaseNumber: number;
        termNo: string;
        estimatedBettingTime: number;
        totalNumber: number;
        isLastTerm: boolean;
        failReason: string;
        buyEndTime: string;
        needUploadTicket: boolean;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        chaseNumberExecutionStatus: CoreCommonEnum.ChaseNumberExecutionStatus;
    }

    interface PathIDPathParams {
        orderId: string;
    }

    interface PostOrderCommand {
        betAmount: string;
        userID: string;
        single: boolean;
        username: string;
        buyEndTime: string;
        shopLotteryID: string;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryType: CoreCommonEnum.LotteryType;
        winAmount: string;
        betMultiple: number;
        betPlay: string | null;
        playName: string;
        winMixAmount: string;
        betCount: number;
        shopCode: number;
        needUploadTicket: boolean;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo?: string | null;
        ticketUrl?: string | null;
        append?: CoreCommonEnum.AppendType | null;
        bettingString: string | null;
        betContentTraditionalLotteryList?: BetContentSportsLottery[] | null;
        betContentDigitalLottery?: BetContentDigitalLottery[] | null;
        betContentSportsLotteryList?: BetContentSportsLottery[] | null;
        bonusDetailList?: string | null;
        calcAmount?: string;
        cancelTimestamp?: number;
        commission: string;
        lotteryNumber: string | null;
        optimizationType?: OptimizationType;
        paymentStatus: PaymentStatus;
        paymentMethod?: PaymentMethod | null;
        remark?: string;
        returnAmount?: string;
        returnMultiple?: string;
        orderCategory?: CoreCommonEnum.OrderCategory;
        lotteryIcon: string | null;
        issue?: string;
        issueNum?: string;
        competitionId?: number;
        frontEndOnly: string;
        chaseNumber?: number;
        declaration?: string | null;
        commissionRate: string | null;
        programContent?: CoreCommonEnum.PostsOrderType | null;
    }

    interface PostOrderResult {
        orderId: string;
        orderNo: string;
    }

    interface SaveSchemeCommand {
        betAmount: string;
        userID: string;
        single: boolean;
        username: string;
        buyEndTime: string;
        shopLotteryID: string;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryType: CoreCommonEnum.LotteryType;
        winAmount: string;
        betMultiple: number;
        betPlay: string | null;
        playName: string;
        winMixAmount: string;
        betCount: number;
        shopCode: number;
        needUploadTicket: boolean;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo?: string | null;
        ticketUrl?: string | null;
        append?: CoreCommonEnum.AppendType | null;
        bettingString: string | null;
        betContentTraditionalLotteryList?: BetContentSportsLottery[] | null;
        betContentDigitalLottery?: BetContentDigitalLottery[] | null;
        betContentSportsLotteryList?: BetContentSportsLottery[] | null;
        bonusDetailList?: string | null;
        calcAmount?: string;
        cancelTimestamp?: number;
        commission: string;
        lotteryNumber: string | null;
        optimizationType?: OptimizationType;
        optimization: string;
        paymentStatus: PaymentStatus;
        paymentMethod?: PaymentMethod | null;
        remark?: string;
        returnAmount?: string;
        returnMultiple?: string;
        orderType: CoreCommonEnum.OrderType | null;
        orderCategory?: CoreCommonEnum.OrderCategory;
        currentOrderNo: string;
        orderParentID?: string;
        orderParentNo?: string;
        followOrderNo?: string;
        lotteryIcon: string | null;
        issue?: string;
        issueNum?: string;
        competitionId?: number;
        stopAfterWin?: number;
        frontEndOnly: string;
        declaration?: string | null;
        commissionRate: string | null;
        programContent?: CoreCommonEnum.PostsOrderType | null;
    }

    interface SaveSchemeResult {
        orderId: string;
        orderNo: string;
    }

    interface SevenHappyBetContent {
        sevenHappyNumbers: Record<number,string[] | null> | null;
    }

    interface SevenStarBetContent {
        sevenStarNumbers: Record<CoreCommonEnum.SevenStarPlayParamType,string[] | null> | null;
    }

    interface StopChaseNumberCommandPathParams {
        chaseNumberRecordID: string;
    }

    interface SuperLottoBetContent {
        superLottoPlay: CoreCommonEnum.SuperLottoPlay;
        standardNumbers: Record<CoreCommonEnum.StandardSelectionSuperLottoPlayParamType,string[] | null> | null;
        danTuoNumbers: Record<CoreCommonEnum.DanTuoSelectionSuperLottoPlayParamType,string[] | null> | null;
    }

    interface UserCancelOrderCommand {
        orderID: string;
    }

    interface WinNotice {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        userID: string;
        orderAt: number;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: string;
        shopCode: number;
        winNoticeType: WinNoticeType;
        orderID: string;
        orderNo: string;
        winAmount: string;
        message: string;
        winNoticeSent: boolean;
    }

    // 1: 平均优化, 2: 博热优化, 3: 博冷优化
    type OptimizationType = 1 | 2 | 3;

    // 1: 钱包余额, 2: 支付宝, 3: 微信支付, 4: 快捷支付, 5: 二维码收款, 6: 银行卡充值
    type PaymentMethod = 1 | 2 | 3 | 4 | 5 | 6;

    // 1: 等待支付, 2: 已出已支付票
    type PaymentStatus = 1 | 2;

    // 3: 短信通知, 2: 邮件通知, 1: APP内通知
    type WinNoticeType = 3 | 2 | 1;

}
