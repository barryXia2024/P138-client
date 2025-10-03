
declare namespace HallFollowSubscribe {

    interface AutoFollowExecutionLog {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        customerFollowSubscribeID: string;
        parentOrderID: string;
        orderID: string;
        betAmount: string;
        subscriberUserID: string;
        subscribedUserID: string;
        subscribeType: ServerCoreRepo.FollowSubscribeType;
        currentIssue: number;
        currentAmount: string;
        autoFollowStatus: ServerCoreRepo.AutoFollowStatus;
        failReason: string;
    }

    interface CustomerAutoFollowSubscribeInfo {
        subscribeMinAmount: string;
        status: ServerCoreRepo.FollowSubscribeStatus;
        subscriberUserID: string;
        subscribedUserID: string;
        nickname: string;
        subscribedNickname?: string;
        avatar: string;
        vipLevel: number;
        subscribeType: ServerCoreRepo.FollowSubscribeType;
        stopAfterWin: boolean;
        autoStopMultiple: number;
        autoStopFixed: number;
        currentIssue: number;
        currentAmount: string;
    }

    interface CustomerFollowSubscribeHistory {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        customerFollowSubscribeID: string;
        subscribeMinAmount: string;
        status: ServerCoreRepo.FollowSubscribeStatus;
        subscriberUserID: string;
        subscribedUserID: string;
        subscribeType: ServerCoreRepo.FollowSubscribeType;
        stopAfterWin: boolean;
        autoStopMultiple: number;
        autoStopFixed: number;
        currentIssue: number;
        currentAmount: string;
        reason: string;
    }

    interface DeleteCustomerAutoFollowCommandPathParams {
        subscribeID: string;
    }

    interface GetCustomerAutoFollowSubscribeCommandQuery {
        subscriberUserID: string | null;
        subscribedUserID: string | null;
    }

    interface ListAutoFollowExecutionLogCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        customerFollowSubscribeID?: string | null;
        subscribeType?: ServerCoreRepo.FollowSubscribeType | null;
        autoFollowStatus?: ServerCoreRepo.AutoFollowStatus | null;
        subscriberUserID?: string | null;
        subscribedUserID?: string | null;
    }

    interface ListAutoFollowExecutionLogCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        customerFollowSubscribeID?: string | null;
        subscribeType?: ServerCoreRepo.FollowSubscribeType | null;
        autoFollowStatus?: ServerCoreRepo.AutoFollowStatus | null;
        subscriberUserID?: string | null;
        subscribedUserID?: string | null;
    }

    interface ListAutoFollowExecutionLogResult {
        list: AutoFollowExecutionLog[] | null;
        total: number;
        query: ListAutoFollowExecutionLogCommand;
    }

    interface ListCustomerAutoFollowCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        nickname?: string | null;
        subscribedNickname?: string | null;
        username?: string | null;
        subscribedUsername?: string | null;
        subscriberUserID?: string | null;
        subscribedUserID?: string | null;
    }

    interface ListCustomerAutoFollowCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        nickname?: string | null;
        subscribedNickname?: string | null;
        username?: string | null;
        subscribedUsername?: string | null;
        subscriberUserID?: string | null;
        subscribedUserID?: string | null;
    }

    interface ListCustomerAutoFollowResult {
        list: CustomerAutoFollowSubscribeInfo[] | null;
        total: number;
        query: ListCustomerAutoFollowCommand;
    }

    interface ListSubscribeUnsubscribeAutoFollowHistoryCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        subscriberUserID?: string | null;
        subscribedUserID?: string | null;
    }

    interface ListSubscribeUnsubscribeAutoFollowHistoryCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        subscriberUserID?: string | null;
        subscribedUserID?: string | null;
    }

    interface ListSubscribeUnsubscribeAutoFollowHistoryResult {
        list: CustomerFollowSubscribeHistory[] | null;
        total: number;
        query: ListSubscribeUnsubscribeAutoFollowHistoryCommand;
    }

    interface SubscribeFollowCommand {
        afterCountAutoStop: number;
        subscribeMinAmount: string;
        stopAfterWin?: boolean;
        subscribeType: ServerCoreRepo.FollowSubscribeType;
        subscriberUserID: string;
        subscribedUserID: string;
    }

    interface UnsubscribeFollowCommand {
        subscriberUserID: string;
        subscribedUserID: string;
    }

}
