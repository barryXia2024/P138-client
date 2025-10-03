
declare namespace ServerCoreLottery {

    interface CreateLotteryCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        lotteryType: CoreCommonEnum.LotteryType;
        lotterySort?: number;
        lotteryIcon: string;
        lotteryDesc?: string;
        lotteryStatus?: CoreCommonEnum.LotteryStatus | null;
        billingSwitch?: BillingSwitch;
    }

    interface CreatedLotteryResult {
        lotteryTypeID: string;
    }

    interface DeleteLotteryCommandPathParams {
        lotteryTypeID: string;
    }

    interface GetLotteryCommandPathParams {
        lotteryTypeID: string;
    }

    interface ListCustomLotteryCommandQuery {
        shopCode: number;
    }

    interface ListCustomLotteryResult {
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        lotteryType: CoreCommonEnum.LotteryType;
        showType?: CoreCommonEnum.LotteryType;
        lotterySort?: number;
        lotteryIcon: string;
        lotteryDesc: string;
        lotteryStatus: CoreCommonEnum.LotteryStatus | null;
        billingSwitch: BillingSwitch;
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryTypeID: string;
        shopCode: number;
        limitSaleTime?: number | null;
        updateBy?: string;
        gameUrl?: string;
        recordUrl?: string;
        togetherSwitch: number;
        ticketSwitch?: TicketSwitch;
        searchValue?: string;
        saleSwitch: SaleSwitch;
        remark?: string;
        params?: any;
        multipartCompetitionSwitch?: number;
        mnSwitch?: number;
        minBetAmount?: string;
        minAppendAmount?: string;
        limitBetTime?: number;
        createBy?: string | null;
        cooperationShopCode?: number | null;
        bonusOptimizationSwitch?: number;
        billingSwitch?: BillingSwitch;
        betProportionSwitch?: number;
        banComplexSwitch?: number;
        cooperationCommissionRate?: string;
        expertSwitch?: boolean;
        isCooperation?: boolean;
        shopLotteryId: string;
    }

    interface ListLotteryCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        lotteryChineseName?: CoreCommonEnum.LotteryChineseName | null;
        lotteryCategory?: CoreCommonEnum.LotteryCategory | null;
        lotteryType?: CoreCommonEnum.LotteryType | null;
        lotteryStatus?: CoreCommonEnum.LotteryStatus | null;
    }

    interface ListLotteryCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface ListLotteryResult {
        list: Lottery[] | null;
        total: number;
        query: ListLotteryCommand;
    }

    interface Lottery {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        lotteryType: CoreCommonEnum.LotteryType;
        showType?: CoreCommonEnum.LotteryType;
        lotterySort?: number;
        lotteryIcon: string;
        lotteryDesc: string;
        lotteryStatus: CoreCommonEnum.LotteryStatus | null;
        billingSwitch: BillingSwitch;
    }

    interface UpdateLotteryCommandPathParams {
        lotteryTypeID: string;
    }

    interface UpdateLotteryCommandWithoutPath {
        lotteryName?: CoreCommonEnum.LotteryName;
        lotteryChineseName?: CoreCommonEnum.LotteryChineseName;
        lotteryCategory?: CoreCommonEnum.LotteryCategory;
        lotteryType?: CoreCommonEnum.LotteryType;
        showType?: CoreCommonEnum.LotteryType;
        lotterySort?: number;
        lotteryIcon?: string;
        lotteryDesc?: string;
        lotteryStatus?: CoreCommonEnum.LotteryStatus | null;
        billingSwitch?: BillingSwitch | null;
    }

    // 允许跟单: 允许跟单, 不允许跟单: 不允许跟单
    type BillingSwitch = 1 | 2;

    // 开启销售: 开启销售, 关闭销售: 关闭销售
    type SaleSwitch = 1 | 2;

    // 1: 店内出票(店内出单), 2: 合作出票(合作派单)
    type TicketSwitch = 1 | 2;

}
