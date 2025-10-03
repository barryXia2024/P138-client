
declare namespace ServerCoreWallet {

    interface GetAllUserWalletTransactionCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface GetAllUserWalletTransactionCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        walletID?: string | null;
        transactionType?: CoreCommonEnum.TransactionType | null;
        userType?: ServerCoreUser.UserType | null;
        userID?: string | null;
    }

    interface GetAllUserWalletTransactionResult {
        list: WalletTransaction[] | null;
        total: number;
        query: GetAllUserWalletTransactionCommand;
    }

    interface GetShopServiceChargeWalletTransactionCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopServiceChargeTabType?: CoreCommonEnum.ShopServiceChargeTabType | null;
    }

    interface GetShopServiceChargeWalletTransactionCommandPathParams {
        walletID: string;
    }

    interface GetShopServiceChargeWalletTransactionCommandQueryWithoutPath {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopServiceChargeTabType?: CoreCommonEnum.ShopServiceChargeTabType | null;
    }

    interface GetShopServiceChargeWalletTransactionResult {
        list: WalletTransaction[] | null;
        total: number;
        query: GetShopServiceChargeWalletTransactionCommand;
        totalAmount?: string;
    }

    interface GetTransactionSummaryCommandQuery {
        startDate?: string | null;
        endDate?: string | null;
        shopCode?: number | null;
        transactionSummaryType?: CoreCommonEnum.TransactionSummaryType | null;
    }

    interface GetTransactionSummaryResult {
        totalAmount: string;
        transactionTypeMap: Record<string,string> | null;
    }

    interface GetUserWalletCommandQuery {
        userID: string | null;
        username: string | null;
        userType?: ServerCoreUser.UserType;
    }

    interface GetUserWalletTransactionCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface GetUserWalletTransactionCommandPathParams {
        walletID: string;
    }

    interface GetUserWalletTransactionCommandQueryWithoutPath {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        transactionType?: CoreCommonEnum.TransactionType | null;
        shopServiceChargeTransactionType?: CoreCommonEnum.ShopServiceChargeTransactionType | null;
        userType?: ServerCoreUser.UserType | null;
        userID?: string | null;
    }

    interface GetUserWalletTransactionResult {
        list: WalletTransaction[] | null;
        total: number;
        query: GetUserWalletTransactionCommand;
        totalAmount?: string;
    }

    interface GetWalletTotalAmountCommandQuery {
        shopCode?: number | null;
        walletID?: string | null;
        userId?: string | null;
        userType?: ServerCoreUser.UserType | null;
    }

    interface GetWalletTotalAmountResult {
        totalAmount: string;
    }

    interface ListUserWalletsCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface ListUserWalletsCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number | null;
        userType?: ServerCoreUser.UserType | null;
    }

    interface ListUserWalletsResult {
        list: Wallet[] | null;
        total: number;
        query: ListUserWalletsCommand;
    }

    interface ListUserWithdrawCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode: number | null;
        startTime?: number | null;
        endTime?: number | null;
        reviewStatus?: CoreCommonEnum.ReviewStatus | null;
        withdrawApplyID?: string | null;
        userType?: ServerCoreUser.UserType | null;
        transactionID?: string | null;
    }

    interface ListUserWithdrawCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode: number | null;
        startTime?: number | null;
        endTime?: number | null;
        reviewStatus?: CoreCommonEnum.ReviewStatus | null;
        withdrawApplyID?: string | null;
        userType?: ServerCoreUser.UserType | null;
        transactionID?: string | null;
    }

    interface ListUserWithdrawResult {
        list: UserWithdrawRow[] | null;
        total: number;
        query: ListUserWithdrawCommand;
    }

    interface ReviewUserWithdrawCommandPathParams {
        withdrawApplyID: string;
    }

    interface ReviewUserWithdrawCommandWithoutPath {
        reviewStatus: CoreCommonEnum.ReviewStatus;
        refuseReason?: string;
    }

    interface SetWalletLimitCommand {
        withdrawMinAmount: string | null;
        rechargeMinAmount: string | null;
        withdrawMaxAmount: string | null;
        withdrawMaxCount: number | null;
        shopCode: number | null;
    }

    interface UserApplyForWithdrawRecord {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        shopCode: number;
        shopName: string;
        cooperationShopCode: number;
        cooperationShopName: string;
        reviewStatus: CoreCommonEnum.ReviewStatus;
        applyUserID: string;
        applyUserName: string;
        applyUserType: ServerCoreUser.UserType;
        reviewUserID: string;
        reviewUserType: ServerCoreUser.UserType;
        reviewUserName: string;
        withdrawalType: CoreCommonEnum.PaymentMethod;
        account: string;
        amount: string;
        refuseReason: string;
        transferTime: any;
        userWalletID: string;
        transactionID: string;
        params: Record<string,any> | null;
        accountName: string;
        paymentPassword: string;
    }

    interface UserWalletRechargeCommandPathParams {
        walletID: string;
    }

    interface UserWalletRechargeCommandWithoutPath {
        amount: string;
        currency: string;
        userID: string;
    }

    interface UserWalletRechargeResult {
        walletID: string;
    }

    interface UserWalletTransferCommand {
        amount: string;
        senderUsername: string;
        receiverUsername: string;
        senderUserID: string;
        receiverUserID: string;
        currency?: string;
        paymentPassword: string;
        userID: string;
    }

    interface UserWithdrawApplyForCommand {
        shopCode: number;
        amount: string;
        userWalletID: string;
        currency?: BasicTypes.Currency;
        withdrawalType?: CoreCommonEnum.PaymentMethod;
        params?: Record<string,any> | null;
        account: string;
        accountName: string;
        userType: ServerCoreUser.UserType;
        paymentPassword: string;
        remark?: string;
    }

    interface UserWithdrawApplyForCommandQuery {
        shopCode: number;
        amount: string;
        userWalletID: string;
        currency?: BasicTypes.Currency;
        withdrawalType?: CoreCommonEnum.PaymentMethod;
        params?: Record<string,any> | null;
        account: string;
        accountName?: string;
        userType: ServerCoreUser.UserType;
        paymentPassword?: string;
        remark?: string;
    }

    interface UserWithdrawProcessCommandPathParams {
        withdrawApplyID: string;
    }

    interface UserWithdrawRow {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        shopCode: number;
        shopName: string;
        cooperationShopCode: number;
        cooperationShopName: string;
        reviewStatus: CoreCommonEnum.ReviewStatus;
        applyUserID: string;
        applyUserName: string;
        applyUserType: ServerCoreUser.UserType;
        reviewUserID: string;
        reviewUserType: ServerCoreUser.UserType;
        reviewUserName: string;
        withdrawalType: CoreCommonEnum.PaymentMethod;
        account: string;
        amount: string;
        refuseReason: string;
        transferTime: any;
        userWalletID: string;
        transactionID: string;
        params: Record<string,any> | null;
        accountName: string;
        paymentPassword: string;
        applyUserAvatar: string;
        applyUserNickname: string;
        applyUserRealName: string;
        recommenderUsername: string;
        recommenderRealName: string;
        recommenderNickname: string;
    }

    interface Wallet {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        userID: string;
        userType: ServerCoreUser.UserType;
        walletType: CoreCommonEnum.WalletType;
        username: string;
        shopCode: number;
        cooperationShopCode: number;
        balance: string;
        currency: BasicTypes.Currency;
        frozenBalance: string;
        withdrawBalance: string;
        totalRechargeAmount: string;
        totalBettingAmount: string;
        totalWinningAmount: string;
        totalSendPrizeAmount: string;
        totalWithdrawalAmount: string;
        cooperationCreditLimit: string;
        totalIncomeAmount: string;
        totalExpenseAmount: string;
        totalTransferAmount: string;
        totalTicketAmount: string;
        totalCommissionAmount: string;
        walletStatus: CoreCommonEnum.LotteryUserWalletStatus;
        lastTransactionTime: any;
    }

    interface WalletTransaction {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        userID: string;
        walletID: string;
        userType: ServerCoreUser.UserType;
        walletPayType: CoreCommonEnum.WalletPayType;
        changeType: CoreCommonEnum.ChangeType;
        canBeWithdrawn: boolean;
        withdrawalApplyID: string;
        receiverUserWalletID: string;
        receiverUserID: string;
        receiverTransactionID: string;
        senderTransactionID: string;
        receiverUserType: ServerCoreUser.UserType;
        receiverUserWalletType: CoreCommonEnum.WalletType;
        receiverUsername: string;
        senderUserWalletID: string;
        senderUserID: string;
        senderUserType: ServerCoreUser.UserType;
        senderUserWalletType: CoreCommonEnum.WalletType;
        senderUsername: string;
        transactionType: CoreCommonEnum.TransactionType;
        platformTransactionType: CoreCommonEnum.PlatformTransactionType;
        cooperationShopTransactionType: CoreCommonEnum.CooperationShopTransactionType;
        serviceChargeType: CoreCommonEnum.ServiceChargeType;
        shopServiceChargeTransactionType: CoreCommonEnum.ShopServiceChargeTransactionType;
        transactionName: string;
        amount: string;
        creditLimitChangeAmount: string;
        preBalance: string;
        postBalance: string;
        transactionStatus: CoreCommonEnum.TransactionStatus;
        transactionTime: any;
        operatorType: ServerCoreUser.UserType;
        operatorUsername: string;
        shopCode: number;
        shopName: string;
        cooperationShopCode: number;
        cooperationShopName: string;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        ticketType: CoreCommonEnum.TicketType;
        betOrderID: string;
        betOrderNo: string;
        preCreditLimit: string;
        postCreditLimit: string;
        cooperationStatisticsType: CoreCommonEnum.CooperationStatisticsType;
        relatedOrderID: string;
        transactionOrderNo: string;
        transactionDescription: string;
        fee: string;
        feeRate: string;
        remark: string;
        parentBetOrderNo: string;
        parentBetOrderID: string;
    }

    interface WithdrawLimitQueryCommandQuery {
        shopCode: number | null;
    }

    interface WithdrawLimitQueryResult {
        withdrawMinAmount: string;
        withdrawMaxAmount: string;
        rechargeMaxAmount: string;
        rechargeMinAmount: string;
        withdrawMaxCount: number;
        shopCode: number;
    }

    interface WithdrawalApplicationCommand {
        username: string;
        shopCode: number;
        amount: string;
        userID: string;
        cardNo?: string;
        alipayAccount?: string;
        accountBank?: string;
        userType: ServerCoreUser.UserType;
        remark?: string;
        agentName: string;
        agentUsername: string;
        shopName: string;
        levelId: number;
        walletID: string;
    }

    interface WithdrawalApplicationResult {
        withdrawID: string;
    }

}
