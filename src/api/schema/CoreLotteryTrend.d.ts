
declare namespace CoreLotteryTrend {

    interface CreateTrendCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        trendType: TrendType;
        trendInfos: TrendInfo[] | null;
        totalCount: string;
        avgCount: string;
        maxCount: string;
        minCount: string;
    }

    interface ListTrendCommandQuery {
        lotteryName: CoreCommonEnum.LotteryName | null;
        trendType: TrendType | null;
    }

    interface Trend {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        trendType: TrendType;
        trendTypeString: string;
        trendInfos: TrendInfo[] | null;
        totalCount: string;
        avgCount: string;
        maxCount: string;
        minCount: string;
    }

    interface TrendInfo {
        issue: string;
        prizeNumber: string;
        numbers: TrendNumber[] | null;
    }

    interface TrendNumber {
        num: string;
        prize: boolean | null;
    }

    // J_B$ZS: 基本走势, D_X$ZS: 大小走势, Q_O$ZS: 奇偶数走势, H_Z$ZS: 和值走势, L_H$ZS: 连号走势, K_D$ZS: 跨度走势
    type TrendType = 1 | 2 | 3 | 4 | 5 | 6;

}
