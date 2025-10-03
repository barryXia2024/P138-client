
declare namespace PkgCustomerRanking {

    interface CreateCommand {
        type: RankingType;
        userID: number;
        rank: number;
        score: number;
    }

    interface CreatedResult {
        id: string;
    }

    interface PathIDPathParams {
        id: string;
    }

    interface Ranking {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        type: RankingType;
        userID: number;
        rank: number;
        score: number;
        createdAt: any;
    }

    interface UpdateCommandPathParams {
        id: string;
    }

    interface UpdateCommandWithoutPath {
        type: RankingType;
        userID: number;
        rank: number;
        score: number;
    }

    // rankingTypeBet: 投注排名, rankingTypeWin: 中奖排名, rankingTypePromote: 推广排名
    type RankingType = 'rankingTypeBet' | 'rankingTypeWin' | 'rankingTypePromote';

}
