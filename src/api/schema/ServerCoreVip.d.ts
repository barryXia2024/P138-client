
declare namespace ServerCoreVip {

    interface CreateVIPCommand {
        levelCode: string;
        levelID?: number | null;
        userType: ServerCoreUser.UserType;
        levelIcon: string;
        levelImage: string;
        levelName: string;
        levelColor: string;
        score?: number;
        chatFlag: boolean;
        billing: number;
        remark: string;
        vipStatus?: VIPStatus;
    }

    interface CreateVIPResult {
        vipID: string;
    }

    interface DeleteListVIPCommandPathParams {
        vipID: string;
    }

    interface GetVIPCommandPathParams {
        vipID: string;
    }

    interface ListVIPCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListVIPCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        levelCode: string | null;
        levelName: string | null;
        vipStatus: VIPStatus | null;
    }

    interface ListVIPResult {
        list: VIP[] | null;
        total: number;
        query: ListVIPCommand;
    }

    interface UpdateVIPCommandPathParams {
        vipID: string;
    }

    interface UpdateVIPCommandWithoutPath {
        levelCode?: string | null;
        levelID?: number | null;
        userType?: ServerCoreUser.UserType | null;
        levelIcon?: string | null;
        levelName?: string | null;
        levelImage?: string | null;
        levelColor?: string | null;
        score?: number | null;
        chatFlag?: boolean | null;
        billing?: number | null;
        remark?: string | null;
        vipStatus?: VIPStatus | null;
    }

    interface VIP {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        levelID: number;
        levelCode: string;
        userType: ServerCoreUser.UserType;
        levelIcon: string;
        levelImage: string;
        levelName: string;
        levelColor: string;
        score: number;
        chatFlag: boolean;
        billing: number;
        dailyPostOrderCount: number;
        minPoints: number;
        maxPoints: number;
        remark: string;
        upgradeConditions: number[] | null;
        vipStatus: VIPStatus;
        deletedAt?: number;
    }

    interface VIPLevelCodeAndLevelID {
        levelCode: string;
        levelID: number;
    }

    // 启用: 启用, 禁用: 禁用
    type VIPStatus = 1 | 2;

}
