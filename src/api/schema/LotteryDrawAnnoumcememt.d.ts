
declare namespace LotteryDrawAnnoumcememt {

    interface CompetitionDetail {
        termNo: string | null;
        round: string | null;
        home: string;
        away: string;
        matchScore: string | null;
        halfMatchScore: string | null;
        result: string;
    }

    interface CreateDigitalDrawAnnouncementCommand {
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        lotteryName: CoreCommonEnum.LotteryName;
        digitalDrawDetail: Record<string,LotteryDrawAnnoumcememt.DigitalDrawDetail[] | null> | null;
    }

    interface CreateSportsDrawAnnouncementCommand {
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        termNo: string;
        sportsVos: SportsMatch[] | null;
    }

    interface CreateSportsStatisticsCommand {
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryStatisticsVos: LotteryStatisticsVo[] | null;
    }

    interface DeleteSportsStatisticsCommandPathParams {
        sportsStatisticsID: string;
    }

    interface DigitalDrawAnnouncement {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo: string;
        digitalDrawDetail: DigitalDrawDetail;
    }

    interface DigitalDrawDetail {
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: CoreCommonEnum.LotteryChineseName;
        termNo: string;
        openDate: string;
        result: string;
        saleAmount: string;
        poolBonus: string;
        nineSaleAmount: string | null;
        ninePoolBonus: string | null;
        nextOpenDate: string | null;
        vos: LotteryPrize[] | null;
        competitionVos: CompetitionDetail[] | null;
    }

    interface ListDigitalDrawAnnouncementByLotteryNameCommand {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
        lotteryName: CoreCommonEnum.LotteryName | null;
        termNo: string | null;
    }

    interface ListDigitalDrawAnnouncementByLotteryNameCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListDigitalDrawAnnouncementByLotteryNameCommandResult {
        list: DigitalDrawAnnouncement[] | null;
        total: number;
        query: ListDigitalDrawAnnouncementByLotteryNameCommand;
    }

    interface ListDigitalDrawAnnouncementCommand {
        lotteryNames: CoreCommonEnum.LotteryName[] | null;
        termNo: string | null;
    }

    interface ListSportsDrawAnnouncementCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        processDate: string;
    }

    interface ListSportsStatisticsCommand {
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface LotteryPrize {
        termNo: string;
        name: string;
        num: string;
        amount: string;
        addNum: number | null;
        addAmount: string | null;
    }

    interface LotteryStatistics {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo: string;
        num: string;
        processDate?: string;
        competitionNum: number;
        bdTermNo: string | null;
    }

    interface LotteryStatisticsVo {
        termNo: string;
        num: string;
        processDate?: string;
        competitionNum: number;
        bdTermNo: string | null;
    }

    interface SportsDrawAnnouncement {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryType: CoreCommonEnum.LotteryType;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryCategory: CoreCommonEnum.LotteryCategory;
        termNo: string;
        processDate: string;
        home: string;
        away: string;
        leagueName: string;
        leagueColor: string;
        matchScore: string;
        asiaHandicap: string | null;
        bsHandicap: string | null;
        result: string | null;
        asiaResult: string | null;
        pointResult: string | null;
        bigSmallResult: string | null;
        totalScoreResult: string | null;
        matchScoreResult: string | null;
        halfFullResult: string | null;
        upDownResult: string | null;
        jcHandicap: string | null;
        competitionTime: string;
        jcHandicapResult: string | null;
        matchNum: string | null;
        bdNum: string | null;
        halfMatchScore: string | null;
        seriesId: number;
        leagueId: number;
        competitionId: number;
    }

    interface SportsMatch {
        processDate: string;
        home: string;
        away: string;
        leagueName: string;
        leagueColor: string;
        matchScore: string;
        asiaHandicap: string | null;
        bsHandicap: string | null;
        result: string | null;
        asiaResult: string | null;
        pointResult: string | null;
        bigSmallResult: string | null;
        totalScoreResult: string | null;
        matchScoreResult: string | null;
        halfFullResult: string | null;
        upDownResult: string | null;
        jcHandicap: string | null;
        competitionTime: string;
        jcHandicapResult: string | null;
        matchNum: string | null;
        bdNum: string | null;
        halfMatchScore: string | null;
    }


    type Sort = 'createdAt' | 'termNo';

}
