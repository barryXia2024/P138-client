
declare namespace ServerCoreLive {

    interface AsiaOdds {
        company: string;
        oddsStatus: number;
        winOdds: number;
        drawOdds: number;
        lostOdds: number;
    }

    interface BasketBallBattleHistory {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        homeId: number;
        awayId: number;
        leagueId: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionHistoryList: CompetitionHistory[] | null;
        win: number;
        lost: number;
        asiaWin: number;
        asiaLost: number;
        big: number;
        small: number;
    }

    interface BasketBallCompetition {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        from: any;
        competitionId: number;
        seriesId: number;
        competitionTime: any;
        matchTime: string;
        buyEndTime: any;
        processDate: string;
        competitionStatus: number;
        playMinutes: string;
        matchNum: string;
        matchScore: string;
        sectionOneScore: string;
        sectionTwoScore: string;
        sectionThreeScore: string;
        sectionFourScore: string;
        home: string;
        homeLogo: string;
        homeId: number;
        homeLeagueSort: number;
        awayLeagueSort: number;
        away: string;
        awayLogo: string;
        awayId: number;
        leagueName: string;
        leagueColor: string;
        leagueId: number;
        result: string;
        handicap: string;
        handicapResult: string;
        bigSmallHandicap: string;
        bigSmallResult: string;
        pointResult: string;
        dataSource: string;
        basketballCompetitionOddsDTOS: BasketballCompetitionOdds[] | null;
        liveState: number;
        live: LiveInfo[] | null;
        competitionIntelligenceDto: CompetitionIntelligenceDto;
    }

    interface BasketBallCompetitionRecordList {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        awayId: number;
        homeId: number;
        curCompetitionId: number;
        win: number;
        lost: number;
        asiaWin: number;
        asiaLost: number;
        big: number;
        small: number;
        competitionList: CompetitionRecord[] | null;
    }

    interface BasketballCompetitionOdds {
        basketballCompetitionId: any;
        homeWin: number;
        homeWinColor: any;
        homeLost: number;
        homeLostColor: any;
        europeSingle: any;
        asiaSingle: any;
        bsSingle: any;
        pointSingle: any;
        asiaHomeWin: number;
        asiaHomeWinColor: any;
        asiaHandicap: string;
        asiaHomeLost: number;
        asiaHomeLostColor: any;
        big: any;
        bigColor: any;
        bsHandicap: any;
        small: any;
        smallColor: any;
        homeWinOneFive: any;
        homeWinOneFiveColor: any;
        homeWinSixTen: any;
        homeWinSixTenColor: any;
        homeWinElevenFifteen: any;
        homeWinElevenFifteenColor: any;
        homeWinSixteenTwenty: any;
        homeWinSixteenTwentyColor: any;
        homeWinTwentyOneTwentyFive: any;
        homeWinTwentyOneTwentyFiveColor: any;
        homeWinTwentySix: any;
        homeWinTwentySixColor: any;
        awayWinOneFive: any;
        awayWinOneFiveColor: any;
        awayWinSixTen: any;
        awayWinSixTenColor: any;
        awayWinElevenFifteen: any;
        awayWinElevenFifteenColor: any;
        awayWinSixteenTwenty: any;
        awayWinSixteenTwentyColor: any;
        awayWinTwentyOneTwentyFive: any;
        awayWinTwentyOneTwentyFiveColor: any;
        awayWinTwentySix: any;
        awayWinTwentySixColor: any;
    }

    interface BigSmallOdds {
        company: string;
        oddsStatus: number;
        winOdds: number;
        drawOdds: number;
        lostOdds: number;
    }

    interface Class26 {
        total: number;
        rows: Class27[] | null;
    }

    interface Class27 {
        shopId: number;
        orderId: number;
        orderNo: string;
        userId: number;
        nickName: string;
        imgUrl: string;
        declaration: string;
        orderType: number;
        amount: number;
        lotteryId: number;
        lotteryName: string;
        passType: string;
        buyEndTime: number;
        followNum: number;
        returnMultiple: number;
        latestHit: boolean[] | null;
        winStreak: number;
        loseStreak: any;
        hitRate: number;
        profitability: number;
        levelId: number;
        followWin: number;
        followAmount: number;
    }

    interface CompetitionHistory {
        competitionId: number;
        competitionTime: string;
        formatTime: string;
        matchScore: string;
        home: string;
        away: string;
        homeId: number;
        awayId: number;
        leagueName: string;
        result: string;
        asiaHandicap: string;
        asiaHandicapResult: string;
        bigSmallHandicap: any;
        bigSmallResult: any;
    }

    interface CompetitionIntelligenceDto {
        home: Intelligence;
        away: Intelligence;
        neutral: ContentInfo[] | null;
    }

    interface CompetitionRecord {
        competitionId: number;
        competitionTime: string;
        formatTime: any;
        matchScore: string;
        home: string;
        away: string;
        homeId: any;
        awayId: any;
        leagueName: string;
        result: string;
        asiaHandicap: string;
        asiaHandicapResult: string;
        bigSmallHandicap: any;
        bigSmallResult: any;
        vsType: VsType;
    }

    interface CompetitionRecordList {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        awayId: number;
        homeId: number;
        curCompetitionId: number;
        competitionList: CompetitionRecord[] | null;
    }

    interface ContentInfo {
        content: string;
    }

    interface CreateLiveStreamCommand {
        uid: string;
        competitionId: number;
        competitionType: CompetitionType;
        home: string;
        homeId: number;
        away: string;
        awayId: number;
        leagueId: number;
        title: string;
        beginTime: string;
        listIcon: string;
        videoIcon?: string;
        status: LiveStreamStatus;
        nickName: string;
        avatar?: string;
        matchScore?: string;
        views: number;
        isRolling?: number;
    }

    interface CreateLiveStreamResult {
        liveStreamID: string;
    }

    interface DeleteLiveStreamCommandPathParams {
        liveStreamID: string;
    }

    interface DeleteLiveStreamResult {
        liveStreamID: string;
    }

    interface EuropeOdds {
        company: string;
        oddsStatus: number;
        winOdds: number;
        drawOdds: number;
        lostOdds: number;
    }

    interface FootBallBattleHistory {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        competitionHistoryList: CompetitionHistory[] | null;
        winCount: number;
        drawCount: number;
        lostCount: number;
        homeGoal: number;
        homeGoalLost: number;
        avgGoal: string;
        bigSmall: string;
        bigPercent: string;
        awayId: number;
        homeId: number;
        leagueId: number;
    }

    interface FootBallCompetition {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        from: any;
        competitionId: number;
        seriesId: number;
        competitionTime: any;
        matchTime: string;
        hasJc: number;
        hasBd: number;
        hasSfc: number;
        hasFour: number;
        hasSix: number;
        buyEndTime: any;
        processDate: string;
        competitionStatus: CompetitionStatus;
        playMinutes: string;
        matchNum: string;
        bdNum: number;
        bdGgNum: number;
        sfcNum: number;
        fourNum: number;
        sixNum: number;
        bdTermNo: number;
        sfcTermNo: number;
        jqcTermNo: number;
        season: any;
        round: any;
        matchScore: string;
        halfMatchScore: string;
        home: string;
        homeLogo: string;
        homeId: number;
        homeLeagueSort: number;
        awayLeagueSort: number;
        away: string;
        awayLogo: string;
        awayId: number;
        leagueName: string;
        leagueColor: string;
        leagueId: number;
        result: any;
        resultOdds: any;
        jcHandicap: string;
        jcHandicapResult: any;
        asiaHandicap: string;
        asiaHandicapResult: any;
        bigSmallHandicap: any;
        bigSmallResult: any;
        totalScoreResult: any;
        matchScoreResult: any;
        halfFullResult: any;
        upDownResult: any;
        competitionGuess: any;
        competitionRecommend: string;
        competitionIntelligenceDto: CompetitionIntelligenceDto;
        sfcOdds: string;
        asiaOdds: any;
        oddsDTOList: OddsDTO[] | null;
        liveState: LiveStreamStatus;
        live: LiveInfo[] | null;
        spf: any;
        rq: any;
        bf: any;
        jq: any;
        bqc: any;
        rqHandicap: string;
        dataSource: string;
    }

    interface FootBallCompetitionCrownOdds {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        competitionId: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        crownEuropeWinOdds: number;
        crownEuropeDrawOdds: number;
        crownEuropeLostOdds: number;
        crownAsiaWinOdds: number;
        crownAsiaHandicap: string;
        crownAsiaLostOdds: number;
        crownBigOdds: number;
        crownBigSmallHandicap: string;
        crownSmallOdds: number;
        bet365EuropeWinOdds: any;
        bet365EuropeDrawOdds: any;
        bet365EuropeLostOdds: any;
        jcEuropeWinOdds: number;
        jcEuropeDrawOdds: number;
        jcEuropeLostOdds: number;
    }

    interface FootBallCompetitionLeagueTrend {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        competitionId: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        homeId: number;
        awayId: number;
        leagueId: number;
        homeLeagueTrendList: LeagueTrend[] | null;
        awayLeagueTrendList: LeagueTrend[] | null;
    }

    interface FootBallCompetitionOffenseDefense {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        competitionId: number;
        homeId: number;
        awayId: number;
        leagueId: number;
        homeOffenseDefenseList: OffenseDefense[] | null;
        awayOffenseDefenseList: OffenseDefense[] | null;
    }

    interface FootBallCompetitionRecordStatistic {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        competitionId: number;
        homeId: number;
        awayId: number;
        leagueId: number;
        recordStatistic: RecordStatistic[] | null;
    }

    interface FootballStatistic {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionId: number;
        competitionTime: any;
        teamId: number;
        goalNum: number;
        loseNum: number;
        shootNum: number;
        shootTargetNum: number;
        possession: number;
        attack: number;
        dangerousAttack: number;
        cornNum: number;
        yellowNum: number;
        redNum: number;
    }

    interface FootballSupportScale {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        competitionId: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        awayId: number;
        homeId: number;
        leagueId: number;
        winPercent: string;
        drawPercent: string;
        lostPercent: string;
        asiaWinPercent: string;
        asiaDrawPercent: string;
        asiaLostPercent: string;
    }

    interface FutureList {
        competitionId: number;
        competitionTime: string;
        leagueName: string;
        home: string;
        away: string;
        days: number;
    }

    interface GetBasketBallCompetitionFutureCommandQuery {
        lotteryName: CoreCommonEnum.LotteryName;
        competitionID: number;
        homeId?: number | null;
        awayId?: number | null;
        leagueId: number;
    }

    interface GetBasketBallCompetitionFutureResult {
        homeFutureList: FutureList[] | null;
        awayFutureList: FutureList[] | null;
    }

    interface GetBasketBallCompetitionHistoryCommandQuery {
        competitionID: number;
        lotteryName: CoreCommonEnum.LotteryName;
        homeId: number;
        awayId: number;
        leagueId: number;
    }

    interface GetBasketBallCompetitionRecordCommandQuery {
        competitionID: number;
        lotteryName: CoreCommonEnum.LotteryName;
        homeId?: number | null;
        awayId?: number | null;
        leagueId: number;
    }

    interface GetBasketballCompetitionLiveCommandPathParams {
        competitionID: number;
    }

    interface GetChatCompetitionConfigResult {
        topic: string;
        isAdmin: boolean;
        status: number;
        msg: string;
    }

    interface GetFootBallCompetitionCrownOddsCommandQuery {
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionID: number;
    }

    interface GetFootBallCompetitionFutureCommandQuery {
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionID: number;
        homeId?: number | null;
        awayId?: number | null;
        leagueId: number;
    }

    interface GetFootBallCompetitionFutureResult {
        homeFutureList: FutureList[] | null;
        awayFutureList: FutureList[] | null;
    }

    interface GetFootBallCompetitionHistoryCommandQuery {
        competitionID: number;
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        awayId: number;
        homeId: number;
        leagueId: number;
    }

    interface GetFootBallCompetitionLeagueTrendCommandQuery {
        competitionID: number;
        lotteryName: CoreCommonEnum.LotteryName;
        competitionType: CompetitionType;
        awayId: number;
        homeId: number;
        leagueId: number;
    }

    interface GetFootBallCompetitionLiveCommandPathParams {
        competitionID: number;
    }

    interface GetFootBallCompetitionLiveCommandQueryWithoutPath {
        competitionType: CompetitionType;
        sfcTermNo?: number | null;
    }

    interface GetFootBallCompetitionOddsCommandQuery {
        competitionID: number;
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface GetFootBallCompetitionOddsResult {
        lotteryName: CoreCommonEnum.LotteryName;
        competitionId: number;
        europeOddsList: EuropeOdds[] | null;
        asiaOddsList: AsiaOdds[] | null;
        bigSmallOddsList: BigSmallOdds[] | null;
    }

    interface GetFootBallCompetitionOffenseDefenseCommandQuery {
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        awayId: number;
        competitionID: number;
        homeId: number;
        leagueId: number;
    }

    interface GetFootBallCompetitionRecordCommandQuery {
        competitionID: number;
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        homeId?: number | null;
        awayId?: number | null;
        leagueId: number;
    }

    interface GetFootBallCompetitionRecordStatisticCommandQuery {
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        awayId: number;
        competitionID: number;
        homeId: number;
        leagueId: number;
    }

    interface GetFootBallCompetitionStatisticCommandQuery {
        competitionID: number;
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface GetFootBallCompetitionStatisticResult {
        statisticList: FootballStatistic[] | null;
    }

    interface GetFootBallCompetitionSupportScaleCommandQuery {
        competitionType: CompetitionType;
        lotteryName: CoreCommonEnum.LotteryName;
        awayId: number;
        competitionID: number;
        homeId: number;
        leagueId: number;
    }

    interface GetLiveStreamCommandPathParams {
        liveStreamID: string;
    }

    interface GetOrderTrackHallCommandQuery {
        competitionID: number;
        honorRollType: number;
    }

    interface GetOrderTrackHallResult {
        code: number;
        msg: any;
        data: Class26;
    }

    interface Intelligence {
        good: ContentInfo[] | null;
        bad: ContentInfo[] | null;
    }

    interface LeagueTrend {
        teamId: number;
        tableType: number;
        playNum: number;
        winNum: number;
        drawNum: number;
        lostNum: number;
        winPercent: string;
        bigNum: number;
        bigPercent: string;
        smallNum: number;
        smallPercent: string;
    }

    interface ListBasketBallCompetitionCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        competitionId?: number | null;
        processDate?: string | null;
    }

    interface ListBasketBallCompetitionCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        competitionId: number | null;
        processDate?: string | null;
    }

    interface ListBasketBallCompetitionResult {
        list: BasketBallCompetition[] | null;
        total: number;
        query: ListBasketBallCompetitionCommand;
    }

    interface ListChatCompetitionMessageHistoryCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        competitionID: number | null;
    }

    interface ListChatCompetitionMessageHistoryCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        competitionID: number | null;
    }

    interface ListChatCompetitionMessageHistoryResult {
        index: number;
        list: Message[] | null;
        total: number;
        query: ListChatCompetitionMessageHistoryCommand;
    }

    interface ListFootBallCompetitionCommand {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
        competitionType?: CompetitionType | null;
        sfcTermNo?: number | null;
        processDate?: string | null;
    }

    interface ListFootBallCompetitionCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: Sort;
        direction?: BasicTypes.Direction;
        competitionType?: CompetitionType | null;
        sfcTermNo?: number | null;
        processDate?: string | null;
    }

    interface ListFootBallCompetitionResult {
        list: FootBallCompetition[] | null;
        total: number;
        query: ListFootBallCompetitionCommand;
    }

    interface ListLiveStreamCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        status?: number | null;
        nickName?: string | null;
        isRolling?: number | null;
    }

    interface ListLiveStreamCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        status?: number | null;
        nickName?: string | null;
        isRolling?: number | null;
    }

    interface ListLiveStreamResult {
        list: LiveStream[] | null;
        total: number;
        query: ListLiveStreamCommand;
    }

    interface ListTraditionalFootballLotteryTermNoCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListTraditionalFootballLotteryTermNoCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListTraditionalFootballLotteryTermNoResult {
        list: number[] | null;
        total: number;
        query: ListTraditionalFootballLotteryTermNoCommand;
        totalAmount: string;
    }

    interface LiveInfo {
        flv: string;
        m3u8: string;
        mp4: string;
        rtmp: string;
        rtsp: string;
        webrtcPushURL: string;
        webrtcPullURL: string;
        h5: string;
        isAnimation: number;
    }

    interface LiveStream {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        uid: string;
        competitionId: number;
        competitionType: CompetitionType;
        home: string;
        homeId: number;
        away: string;
        awayId: number;
        leagueId: number;
        title: string;
        beginTime: string;
        listIcon: string;
        videoIcon: string;
        status: LiveStreamStatus;
        liveUrl: LiveInfo;
        nickName: string;
        avatar: string;
        matchScore: string;
        views: number;
        isRolling: number;
        operatorID: string;
        operator: string;
        deleteAt: number;
    }

    interface Message {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        messageId: number;
        sendId: number;
        sendShop: number;
        levelId: number;
        nickName: string;
        imgUrl: any;
        content: string;
        contentType: any;
        timestamp: number;
        redStatus: any;
        isRead: any;
        atName: any;
        atNameOwn: any;
        fid: any;
    }

    interface OddsDTO {
        footballCompetitionId: any;
        europeSingle: any;
        europeHandicap: any;
        europeHomeWin: number;
        europeHomeWinColor: any;
        europeDraw: number;
        europeDrawColor: any;
        europeHomeLost: number;
        europeHomeLostColor: any;
        asiaSingle: any;
        asiaHandicap: string;
        asiaHomeWin: number;
        asiaHomeWinColor: any;
        asiaDraw: number;
        asiaDrawColor: any;
        asiaHomeLost: number;
        asiaHomeLostColor: any;
        halfFull: any;
        halfFullColor: any;
        score: any;
        scoreColor: any;
        goalNum: any;
        goalNumColor: any;
        winPercent: number;
        drawPercent: number;
        lostPercent: number;
        asiaWinPercent: number;
        asiaDrawPercent: number;
        asiaLostPercent: number;
    }

    interface OffenseDefense {
        teamId: number;
        totalGoalNum: number;
        totalGoalLostNum: number;
        avgGoalNum: number;
        avgGoalLostNum: number;
        shootNum: number;
        shootTargetNum: number;
    }

    interface RecordStatistic {
        homeFightWin: number;
        homeFightDaw: number;
        homeFightLost: number;
        awayFightWin: number;
        awayFightDaw: number;
        awayFightLost: number;
        homeCurrentWin: number;
        homeCurrentDaw: number;
        homeCurrentLost: number;
        awayCurrentWin: number;
        awayCurrentDaw: number;
        awayCurrentLost: number;
        homeAsiaWin: number;
        awayAsiaWin: number;
    }

    interface StartLiveStreamCommandPathParams {
        liveStreamID: string;
    }

    interface StartLiveStreamResult {
        liveStreamID: string;
    }

    interface UpdateLiveStreamCommandPathParams {
        liveStreamID: string;
    }

    interface UpdateLiveStreamCommandWithoutPath {
        uid: string | null;
        competitionId: number | null;
        competitionType: CompetitionType | null;
        home: string | null;
        homeId: number | null;
        away: string | null;
        awayId: number | null;
        leagueId: number | null;
        title: string | null;
        beginTime: string | null;
        listIcon: string | null;
        videoIcon: string | null;
        nickName: string | null;
        avatar: string | null;
        matchScore: string | null;
        views: number | null;
        isRolling: number | null;
    }

    interface UpdateLiveStreamResult {
        liveStreamID: string;
    }

    // 1: 未开始, 2: 进行中, 3: 已结束
    type CompetitionStatus = 1 | 2 | 3;

    // JC: 竞彩, BD: 北京单场, SFC: 传统足彩, LQ: 竞彩篮球
    type CompetitionType = 'JC' | 'BD' | 'SFC' | 'LQ';

    // 1: 未开始, 2: 进行中, 3: 已结束
    type LiveStreamStatus = 1 | 2 | 3;


    type Sort = 'matchNum' | 'bdNum' | 'sfcNum';

    // HOME: 主场, AWAY: 客场, ALL: 全部, HOME_AWAY: 主客场
    type VsType = 'HOME' | 'AWAY' | 'ALL' | 'HOME_AWAY';

}
