
declare namespace HallFanFollow {

    interface CustomerInfo {
        userID: string;
        nickname: string;
        avatar: string;
        isFollow: boolean;
        shopCode: number;
        winCount: number;
        todayFd: boolean;
    }

    interface FollowCommand {
        followeeID: string;
        followerID: string;
    }

    interface FollowResult {
        followID: string;
    }

    interface ListFansCommand {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListFansCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
        userID?: string | null;
    }

    interface ListFansResult {
        list: CustomerInfo[] | null;
        total: number;
        query: ListFansCommand;
    }

    interface ListFollowerCommand {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListFollowerCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
        userID?: string | null;
    }

    interface ListFollowerResult {
        list: CustomerInfo[] | null;
        total: number;
        query: ListFollowerCommand;
    }

    interface UnFollowCommand {
        followeeID: string;
        followerID: string;
    }


    type Sort = 'createdAt';

}
