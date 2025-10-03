
declare namespace LotteryDataSource {

    interface CharityLotteryDataSource {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        omissionList: string[] | null;
        currentTermNo: string;
        buyEndTime: string;
        vos: VosDetails[] | null;
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface CompetitionOddsDto {
        betName: string | null;
        betItem: string;
        odds: number | null;
        winColor: string | null;
        status: string | null;
        rate: number | null;
    }

    interface CreateCharityLotteryCommand {
        omissionList: string[] | null;
        currentTermNo: string;
        buyEndTime: string;
        vos: VosDetails[] | null;
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface CreateDataSourceConfigCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        dataSourceProtocolType: SyncProtocolType;
        dataSourceEndpoint: string;
        dataSourceReqParam: Record<string,any> | null;
        token: string;
        syncCron: string;
    }

    interface CreateDataSourceLotteryCommand {
        providerID: string;
        lotteryName: CoreCommonEnum.LotteryName;
        isAuto: boolean;
        syncProtocolType: SyncProtocolType;
        url: string;
        qps: number;
        reqQuery?: Record<string,any> | null;
        reqHeader?: Record<string,any> | null;
        reqBody?: string;
        reqMethod: BasicTypes.Method;
        reqTimeout: number;
        reqRetry: number;
        reqEncrypt?: boolean;
        reqEncryptID?: string;
        reqEncryptName?: string;
        lotteryDataCategory: LotteryDataCategory;
        remark?: string;
    }

    interface CreateDataSourceProviderCommand {
        remark: string;
        providerName: string;
        englishName: string;
        isEnable: boolean;
    }

    interface CreateLeagueSportsLotteryCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        leagueSportsLottery: Record<string,Record<string,LotteryDataSource.MatchInfo[] | null> | null> | null;
    }

    interface DataSourceLottery {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        providerID: string;
        running: boolean;
        isAuto: boolean;
        providerEnglishName: string;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: string;
        syncProtocolType: SyncProtocolType;
        url: string;
        qps: number;
        reqQuery?: Record<string,any> | null;
        reqHeader?: Record<string,any> | null;
        reqBody?: string;
        reqMethod: BasicTypes.Method;
        reqTimeout: number;
        reqRetry: number;
        reqEncrypt: boolean;
        reqEncryptID: string;
        reqEncryptName?: string;
        lotteryDataCategory: LotteryDataCategory;
        remark: string;
        updateBy: string;
        createBy: string;
    }

    interface DataSourceProvider {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        providerName: string;
        providerEnglishName: string;
        isEnable: boolean;
        updateBy: string;
        createBy: string;
        remark: string;
    }

    interface DataSourceSyncTask {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        providerID: string;
        providerEnglishName: string;
        lotteryName: CoreCommonEnum.LotteryName;
        lotteryChineseName: string;
        syncProtocolType: SyncProtocolType;
        url: string;
        qps: number;
        reqQuery?: Record<string,any> | null;
        reqHeader?: Record<string,any> | null;
        reqBody?: string;
        reqMethod: BasicTypes.Method;
        reqTimeout: number;
        reqRetry: number;
        reqEncrypt: boolean;
        reqEncryptID: string;
        reqEncryptName?: string;
        lotteryDataCategory: LotteryDataCategory;
        remark: string;
        updateBy: string;
        createBy: string;
        startBy: string;
        syncMethod: SyncMethod;
        dataSourceLotteryID: string;
        status: SyncStatus;
        failureReason: string;
        running: boolean;
        stopBy: string;
        stopAt: number;
    }

    interface DeleteDataSourceLotteryCommandPathParams {
        dataSourceLotteryID: string;
    }

    interface DeleteDataSourceProviderCommandPathParams {
        providerID: string;
    }

    interface GetDataSourceLotteryCommandPathParams {
        dataSourceLotteryID: string;
    }

    interface GetDataSourceProviderCommandPathParams {
        providerID: string;
    }

    interface HandicapDto {
        playChineseName: CoreCommonEnum.PlayName | null;
        playEnglishName: CoreCommonEnum.PlayEnglishName | null;
        single: string | null;
        hanicap: string | null;
        competitionOddsDtos: CompetitionOddsDto[] | null;
    }

    interface ListCharityLotteryCommandQuery {
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface ListDataSourceLotteryCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        providerID?: string | null;
        englishName?: string | null;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        running?: boolean | null;
    }

    interface ListDataSourceLotteryCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        providerID?: string | null;
        englishName?: string | null;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        running?: boolean | null;
    }

    interface ListDataSourceLotteryResult {
        list: DataSourceLottery[] | null;
        total: number;
        query: ListDataSourceLotteryCommand;
    }

    interface ListDataSourceProviderCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        providerName?: string | null;
        englishName?: string | null;
        isEnable?: boolean | null;
    }

    interface ListDataSourceProviderCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        providerName?: string | null;
        englishName?: string | null;
        isEnable?: boolean | null;
    }

    interface ListDataSourceProviderResult {
        list: DataSourceProvider[] | null;
        total: number;
        query: ListDataSourceProviderCommand;
    }

    interface ListDataSourceSyncTaskCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        syncMethod?: SyncMethod | null;
        syncProtocolType?: SyncProtocolType | null;
        status?: SyncStatus | null;
        providerEnglishName?: string | null;
        providerID?: string | null;
        lotteryDataCategory?: LotteryDataCategory | null;
    }

    interface ListDataSourceSyncTaskCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        lotteryName?: CoreCommonEnum.LotteryName | null;
        syncMethod?: SyncMethod | null;
        syncProtocolType?: SyncProtocolType | null;
        status?: SyncStatus | null;
        providerEnglishName?: string | null;
        providerID?: string | null;
        lotteryDataCategory?: LotteryDataCategory | null;
    }

    interface ListDataSourceSyncTaskResult {
        list: DataSourceSyncTask[] | null;
        total: number;
        query: ListDataSourceSyncTaskCommand;
    }

    interface ListLeagueSportsLotteryCommandQuery {
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface ListLeagueSportsLotteryNewCommandQuery {
        lotteryName: CoreCommonEnum.LotteryName;
        date?: string | null;
    }

    interface ListManualDrawResultConfirmLogCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        lotteryName: CoreCommonEnum.LotteryName | null;
    }

    interface ListManualDrawResultConfirmLogCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        lotteryName?: CoreCommonEnum.LotteryName | null;
    }

    interface ListManualDrawResultConfirmLogResult {
        list: ManualDrawResultConfirmLog[] | null;
        total: number;
        query: ListManualDrawResultConfirmLogCommand;
    }

    interface ListNeedManualDrawResultConfirmLotteryCommand {
        lotteryName: CoreCommonEnum.LotteryName | null;
    }

    interface ListNeedManualDrawResultConfirmLotteryCommandQuery {
        lotteryName?: CoreCommonEnum.LotteryName | null;
    }

    interface ListNeedManualDrawResultConfirmLotteryCommandResult {
        list: NeedManualDrawResultConfirmLottery[] | null;
        total: number;
        query: ListNeedManualDrawResultConfirmLotteryCommand;
    }

    interface ListTimeSportsLotteryCommandQuery {
        lotteryName: CoreCommonEnum.LotteryName;
    }

    interface ManualDrawResultConfirmLog {
        username: string;
        nickname: string;
        shopCode: number;
        orderTime: number;
        orderID: string;
        betAmount: string;
        lotteryName: CoreCommonEnum.LotteryName;
        matchID: number;
        termNo: string;
        competitionSessions: string;
    }

    interface ManualDrawResultConfirmationCommand {
        lotteryName: CoreCommonEnum.LotteryName;
        matchID: number;
        termNo: string;
        competitionSessions: string;
    }

    interface ManualTriggerSyncCommand {
        providerID: string;
        dataSourceLotteryIDList: string[] | null;
    }

    interface MatchInfo {
        competitionTime: string;
        buyEndTime: string;
        processDate: string | null;
        matchNum: string;
        sportId?: number;
        issue?: string;
        issueNum?: string;
        competitionId: number;
        lotId?: number;
        lotType?: number;
        home: string;
        homeLogo: string | null;
        homeId: number;
        homeLeagueSort: number | null;
        awayLeagueSort: number | null;
        away: string;
        awayLogo: string | null;
        awayId: number;
        leagueName: string;
        leagueId: number | null;
        bdTermNo: number | null;
        termNo: number | null;
        sfcTermNo: number | null;
        jqcTermNo: number | null;
        bdNum: number | null;
        sfcNum: number | null;
        fourNum: number | null;
        sixNum: number | null;
        bdGgNum: number | null;
        result: string | null;
        matchScore: string | null;
        handicapDtos: HandicapDto[] | null;
    }

    interface NeedManualDrawResultConfirmLottery {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        lotteryName: CoreCommonEnum.LotteryName;
        termNo: string;
        matchID: number;
        confirmStatus: ConfirmStatus;
    }

    interface SportsLotteryDataSource {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        league: string;
        processDate: string;
        date: string;
        lotteryName: CoreCommonEnum.LotteryName;
        leagueSportsLottery: MatchInfo[] | null;
    }

    interface TimeSportsLotteryResult {
        date: string;
        timeSportsLottery: MatchInfo[] | null;
    }

    interface TriggerSyncDatasourceCommandPathParams {
        dataSourceConfigID: string;
    }

    interface TriggerSyncDatasourceCommandWithoutPath {
        lotteryName: string;
    }

    interface UpdateDataSourceConfigCommandPathParams {
        dataSourceConfigID: string;
    }

    interface UpdateDataSourceConfigCommandWithoutPath {
        lotteryName?: CoreCommonEnum.LotteryName | null;
        dataSourceProtocolType?: SyncProtocolType | null;
        dataSourceEndpoint?: string | null;
        dataSourceReqParam?: Record<string,any> | null;
        token?: string | null;
        syncCron?: string | null;
    }

    interface UpdateDataSourceLotteryCommandPathParams {
        dataSourceLotteryID: string;
    }

    interface UpdateDataSourceLotteryCommandWithoutPath {
        lotteryName: CoreCommonEnum.LotteryName | null;
        isAuto: boolean | null;
        syncProtocolType: SyncProtocolType | null;
        url: string | null;
        qps: number | null;
        reqQuery?: Record<string,any> | null;
        reqHeader?: Record<string,any> | null;
        reqBody?: string | null;
        reqMethod: BasicTypes.Method | null;
        reqTimeout: number | null;
        reqRetry: number | null;
        reqEncrypt: boolean | null;
        reqEncryptID: string | null;
        reqEncryptName?: string | null;
        lotteryDataCategory: LotteryDataCategory | null;
        remark: string | null;
    }

    interface UpdateDataSourceProviderCommandPathParams {
        providerID: string;
    }

    interface UpdateDataSourceProviderCommandWithoutPath {
        remark?: string | null;
        providerName?: string | null;
        englishName?: string | null;
        isEnable?: boolean | null;
    }

    interface VosDetails {
        lotteryName: string;
        termNo: string;
        openDate: string;
        result: string;
        saleAmount: string;
        poolBonus: string;
        nineSaleAmount: string | null;
        ninePoolBonus: string | null;
        nextOpenDate: string | null;
        vos: VosDetails[] | null;
        competitionVos: string | null;
    }

    // pending: 待确认, confirmed: 已确认, rejected: 未确认
    type ConfirmStatus = 'pending' | 'confirmed' | 'rejected';

    // bettingData: 投注数据, drawResults: 开奖数据, statisticalData: 统计数据
    type LotteryDataCategory = 'bettingData' | 'drawResults' | 'statisticalData';

    // manual: 手动, cron: 定时
    type SyncMethod = 'manual' | 'cron';

    // https: https, http: http, ws: ws, wss: wss
    type SyncProtocolType = 'https' | 'http' | 'ws' | 'wss';

    // success: 同步成功, fail: 同步失败, running: 同步中
    type SyncStatus = 'success' | 'fail' | 'running';

}
