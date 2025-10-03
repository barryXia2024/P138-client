
declare namespace ServerCoreAgent {

    interface AgentUnderOrderRow {
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryNameChinese: string;
        orderType: CoreCommonEnum.OrderType;
        playName: string;
        amount: string;
        orderStatus: CoreCommonEnum.OrderStatus;
        paymentStatus: CoreCommonEnum.OrderStatus;
        orderTime: number;
        returnAmount: string;
        orderID: string;
        shopCode: number;
        orderNo: string;
        avatar: string;
        nickname: string;
        username: string;
        userID: string;
        balance: string;
        createTime: number;
    }

    interface EditProxyCommand {
        parentUserID: string;
        parentUserType: ServerCoreUser.UserType;
        proxyShare?: string;
        proxyStatus: boolean;
        userType: ServerCoreUser.UserType;
        shopCode: number;
        userID: string;
    }

    interface GetAgentUnderOrderAmountCommand {
        startTime?: number | null;
        endTime?: number | null;
        nickname?: string | null;
        parentUserID: string;
        shopCode: number;
    }

    interface GetAgentUnderOrderAmountCommandQuery {
        startTime?: number | null;
        endTime?: number | null;
        nickname?: string | null;
        parentUserID?: string;
        shopCode: number;
    }

    interface GetAgentUnderOrderAmountResult {
        totalAmount: string;
        winTotalAmount: string;
    }

    interface GetAgentUnderOrderCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID: string | null;
        shopCode?: number | null;
        nickname?: string | null;
    }

    interface GetAgentUnderOrderCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID: string | null;
        shopCode?: number | null;
        nickname?: string | null;
    }

    interface GetAgentUnderOrderResult {
        list: AgentUnderOrderRow[] | null;
        total: number;
        query: GetAgentUnderOrderCommand;
        totalAmount: string;
    }

    interface GetMyStatisticCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID: string | null;
        shopCode: number | null;
    }

    interface GetMyStatisticCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID: string | null;
        shopCode: number | null;
    }

    interface GetMyStatisticResult {
        list: MyStatisticRow[] | null;
        total: number;
        query: GetMyStatisticCommand;
        totalAmount: string;
    }

    interface GetProxyCountDataCommand {
        startTime?: number | null;
        endTime?: number | null;
        parentUserID?: string | null;
        shopCode: number | null;
    }

    interface GetProxyCountDataCommandQuery {
        startTime?: number | null;
        endTime?: number | null;
        parentUserID?: string | null;
        shopCode: number | null;
    }

    interface GetProxyCountDataResult {
        agentCount: number;
        registerUserCount: number;
        saleAmount: string;
        commission: string;
        returnAmount: string;
    }

    interface GetProxyUnderTotalUserBalanceCommand {
        startTime?: number | null;
        endTime?: number | null;
    }

    interface GetProxyUnderTotalUserBalanceCommandQuery {
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number;
    }

    interface GetProxyUnderTotalUserBalanceResult {
        totalUserBalance: string;
    }

    interface GetProxyUnderUserCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID?: string | null;
        shopCode?: number | null;
        nickname?: string | null;
    }

    interface GetProxyUnderUserCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID?: string | null;
        shopCode?: number | null;
        nickname?: string | null;
    }

    interface GetProxyUnderUserOrderAmountCommand {
        lotteryName: CoreCommonEnum.LotteryName | null;
        parentUserID: string | null;
        startTime?: number | null;
        endTime?: number | null;
        orderStatusList?: CoreCommonEnum.OrderStatus[] | null;
        shopCode?: number | null;
    }

    interface GetProxyUnderUserOrderAmountCommandQuery {
        lotteryName?: CoreCommonEnum.LotteryName | null;
        parentUserID?: string | null;
        startTime?: number | null;
        endTime?: number | null;
        orderStatusList?: CoreCommonEnum.OrderStatus[] | null;
        shopCode?: number | null;
    }

    interface GetProxyUnderUserOrderAmountResult {
        totalAmount: string;
        winTotalAmount: string;
    }

    interface GetProxyUnderUserResult {
        list: ProxyUnderUserRow[] | null;
        total: number;
        query: GetProxyUnderUserCommand;
        totalAmount: string;
    }

    interface ListProxyUnderUserBetDataOrWinDataCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        lotteryName: CoreCommonEnum.LotteryName | null;
        parentUserID: string | null;
        startTime?: number | null;
        endTime?: number | null;
        orderStatusList?: CoreCommonEnum.OrderStatus[] | null;
        shopCode: number | null;
    }

    interface ListProxyUnderUserBetDataOrWinDataCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        parentUserID?: string | null;
        startTime?: number | null;
        endTime?: number | null;
        orderStatusList?: CoreCommonEnum.OrderStatus[] | null;
        shopCode: number | null;
    }

    interface ListProxyUnderUserBetDataOrWinDataResult {
        list: AgentUnderOrderRow[] | null;
        total: number;
        query: ListProxyUnderUserBetDataOrWinDataCommand;
        totalAmount: string;
    }

    interface ListProxyUnderUserCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID: string | null;
        shopCode?: number | null;
    }

    interface ListProxyUnderUserCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        parentUserID?: string | null;
        shopCode?: number | null;
    }

    interface ListProxyUnderUserResult {
        list: ProxyUnderUserRow[] | null;
        total: number;
        query: ListProxyUnderUserCommand;
        totalAmount: string;
    }

    interface ListProxyUserCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number | null;
    }

    interface ListProxyUserCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number | null;
    }

    interface ListProxyUserResult {
        list: ProxyUnderUserRow[] | null;
        total: number;
        query: ListProxyUserCommand;
        totalAmount: string;
    }

    interface MyStatisticRow {
        createTime: string;
        saleAmount: string;
        commission: string;
        userID: string;
    }

    interface ProxyUnderUserRow {
        userID: string;
        username: string;
        userType: ServerCoreUser.UserType;
        nickname: string;
        avatar: string;
        certification: ServerCoreUser.IdCertificationType;
        realName: string;
        idNo: string;
        cardNo: string;
        accountBank: string;
        accountPlace: string;
        alipayAccount: string;
        proxyTime: number;
        saleAmount: string;
        proxyShare: string;
        proxyDays: number;
        shopName: string;
        shopCode: number;
        balance: string;
        proxyStatus: boolean;
        createTime: number;
        commission: string;
        apCommission: string;
        bet: string;
        exchange: string;
        recharge: string;
        wd: string;
        registerCount: number;
    }

    interface TransferAgentCommand {
        parentUserID: string;
        shopCode: number;
        userIDList: string[] | null;
    }

    interface UpdateAgentCommissionCommand {
        proxyShare?: string;
        userID: string;
        shopCode: number;
    }

}
