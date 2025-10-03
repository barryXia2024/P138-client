
declare namespace CoreLiveLiveStreamGift {

    interface CreateLiveStreamGiftCommand {
        code: string;
        type: LiveStreamGiftType;
        name: string;
        price?: number;
        icon: string;
    }

    interface CreateLiveStreamGiftResult {
        liveStreamGiftID: string;
    }

    interface DeleteLiveStreamGiftCommandPathParams {
        liveStreamGiftID: string;
    }

    interface DeleteLiveStreamGiftResult {
        liveStreamGiftID: string;
    }

    interface GetLiveStreamGiftCommandPathParams {
        liveStreamGiftID: string;
    }

    interface GiveLiveStreamGiftCommand {
        competitionId: number;
        homeId: number;
        awayId: number;
        leagueId: number;
        liveStreamGiftID: string;
        toUserID: string;
        toUsername: string;
        number: number;
        liveStreamID: string;
    }

    interface GiveLiveStreamGiftResult {
        liveStreamGiftID: string;
    }

    interface ListGiveLiveStreamGiftCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        liveStreamID?: string | null;
        liveStreamGiftType?: LiveStreamGiftType | null;
        fromUsername?: string | null;
        toUsername?: string | null;
        code?: string | null;
    }

    interface ListGiveLiveStreamGiftCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        liveStreamID?: string | null;
        liveStreamGiftType?: LiveStreamGiftType | null;
        fromUsername?: string | null;
        toUsername?: string | null;
        toUsername?: string | null;
    }

    interface ListGiveLiveStreamGiftResult {
        list: LiveStreamGiftRecord[] | null;
        total: number;
        query: ListGiveLiveStreamGiftCommand;
    }

    interface ListLiveStreamGiftCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        code?: string | null;
    }

    interface ListLiveStreamGiftCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        code?: string | null;
    }

    interface ListLiveStreamGiftResult {
        list: LiveStreamGift[] | null;
        total: number;
        query: ListLiveStreamGiftCommand;
    }

    interface LiveStreamGift {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        code: string;
        type: LiveStreamGiftType;
        name: string;
        price: number;
        icon: string;
        operatorID: string;
        operator: string;
        deleteAt: number;
    }

    interface LiveStreamGiftRecord {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        code: string;
        liveStreamID: string;
        liveStreamGiftType: LiveStreamGiftType;
        competitionId: number;
        homeId: number;
        awayId: number;
        leagueId: number;
        icon: string;
        liveStreamGiftID: string;
        fromUserID: string;
        fromUsername: string;
        toUserID: string;
        toUsername: string;
        number: number;
        totalPrice: number;
    }

    interface UpdateLiveStreamGiftCommandPathParams {
        liveStreamGiftID: string;
    }

    interface UpdateLiveStreamGiftCommandWithoutPath {
        code?: string | null;
        type?: LiveStreamGiftType | null;
        name?: string | null;
        price?: number | null;
        icon?: string | null;
    }

    interface UpdateLiveStreamGiftResult {
        liveStreamGiftID: string;
    }

    // 0: 中等特效, 1: 特效, 2: 无特效
    type LiveStreamGiftType = 0 | 1 | 2;

}
