
declare namespace ServerCoreAd {

    interface Ad {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        createBy?: string;
        updateBy?: string;
        operator?: string;
        operatorID?: string;
        searchValue?: string;
        redirectURLParams?: string;
        redirectUrl?: string;
        adTitle: string;
        adContent?: string;
        redirectType?: number;
        imageUrl: string;
        startTime: any;
        endTime: any;
        adContentType?: number;
        duration?: number;
        position?: number;
        adType?: AdType;
        adStatus: AdStatus;
        appType: CoreCommonEnum.AppType;
        weight?: number;
        sort?: number;
        platform?: string;
        description?: string;
        deletedAt?: number;
        displayType?: number;
        shopCodeList?: number[] | null;
        userGroups: string[] | null;
        regions: string[] | null;
        frequency: number | null;
    }

    interface AdminListAdCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        adTitle?: string | null;
        appType?: CoreCommonEnum.AppType | null;
        adType?: AdType | null;
    }

    interface AdminListAdCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        adStatus?: AdStatus | null;
        adTitle?: string | null;
        appType: CoreCommonEnum.AppType | null;
        adType: AdType | null;
    }

    interface AdminListAdCommandResult {
        list: Ad[] | null;
        total: number;
        query: AdminListAdCommand;
    }

    interface CreateAdCommand {
        createBy?: string;
        updateBy?: string;
        searchValue?: string;
        redirectURLParams?: string;
        redirectUrl?: string;
        adTitle: string;
        adContent: string;
        adType: AdType;
        appType: CoreCommonEnum.AppType;
        imageUrl?: string;
        redirectType?: number;
        startTime?: any;
        endTime?: any;
        adContentType?: number;
        duration?: number;
        position?: number;
        weight?: number;
        sort?: number;
        platform?: string;
        description?: string;
        displayType?: number;
    }

    interface CreatedAdResult {
        adID: string;
    }

    interface DeleteAdCommandPathParams {
        adID: string;
    }

    interface GetAdCommandPathParams {
        adID: string;
    }

    interface ListAdCommandQuery {
        appType: CoreCommonEnum.AppType | null;
        adType: AdType | null;
        adStatus?: AdStatus | null;
    }

    interface UpdateAdCommandPathParams {
        adID: string;
    }

    interface UpdateAdCommandWithoutPath {
        createBy?: string | null;
        updateBy?: string | null;
        searchValue?: string | null;
        redirectURLParams?: string | null;
        redirectUrl?: string | null;
        adTitle: string | null;
        adContent: string | null;
        adType: AdType | null;
        adStatus?: AdStatus | null;
        appType: CoreCommonEnum.AppType | null;
        imageUrl?: string | null;
        redirectType?: number | null;
        startTime?: any;
        endTime?: any;
        adContentType?: number | null;
        duration?: number | null;
        position?: number | null;
        weight?: number | null;
        sort?: number | null;
        platform?: string | null;
        description?: string | null;
        displayType?: number | null;
    }

    // 启用: 启用, 禁用: 禁用
    type AdStatus = 1 | 2;

    // 开启动图: 开启动图, 开机弹窗: 开机弹窗, 首页弹窗图: 首页弹窗图, 跑马灯: 跑马灯, 轮播图广告: 轮播图广告, 消息推送(赛事通知): 消息推送(赛事通知)
    type AdType = 1 | 2 | 3 | 4 | 5 | 6;

}
