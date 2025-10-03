
declare namespace ServerCoreShop {

    interface CreateShopCommand {
        orderSoundSwitch: number;
        orderVoice: string;
        homePageSwitch: number;
        shopInformationSwitch: number;
        networkOrderSwitch: number;
        shopImgUrl: string;
        shopkeeperId: string;
        recomShopCode: number;
        shopCode?: number;
        shopName: string;
        referralCode: string;
        shopkeeperName: string;
        shopkeeperLoginName: string;
        shopIcon: string;
        shopTelephone: string;
        shopNoticePic: string;
        shopNoticeImage: string | null;
        lotteryTypes: string[] | null;
        shopType: ShopType;
        staffCount?: number;
        dailyTicketSalesVolume?: number;
        dailySalesAmount?: number;
        commissionRate?: string;
        ticketFeeRate?: string;
        baseFeeRate?: string;
        walletMinBalance?: string;
        shopStatus: ShopStatus;
        lastActiveTime: any;
        rechargeMinAmount?: string;
        rechargeMaxAmount?: string;
        withdrawMinAmount?: string;
        withdrawMaxAmount?: string;
        withdrawMaxCount?: number;
        paymentMethods: string[] | null;
        withdrawalType: WithdrawalType;
        walletId: string;
        ticketRate?: number;
        registerSwitch?: boolean;
        rechargeBetSwitch: boolean;
        freePasswordSwitch: boolean;
        orderTimeSwitch: boolean;
        autoTicket: AutoTicketType;
        autoTicketMin: number;
        autoTicketMax: number;
        autoReceiveMin: number;
        autoReceiveMax: number;
        autoLottery: boolean;
        showLottery: boolean;
        shopNotice: string | null;
        defaultShopNotice: string | null;
        announceSwitch: boolean;
        showShopkeeperName: boolean;
        shopPhone: string | null;
        showPhone: boolean;
        shopWechat: string | null;
        showWechat: boolean;
        showAddress: boolean;
        showNotice: boolean;
        province: string | null;
        city: string | null;
        district: string | null;
        shopDetailedAddress: string | null;
        headImg: string | null;
        consignmentCertificateSportsLottery: string;
        consignmentCertificateWelfareLottery: string;
        doorProjection: string;
        idCardFront: string;
        idCardReverse: string;
        idCardHand: string;
        legalPersonDoorPhoto: string;
        consignmentCertificateWelfareLotteryHand: string;
        consignmentCertificateSportsLotteryHand: string;
        certificationVideo: string;
        searchValue: string | null;
        remark: string | null;
        balance: string | null;
        withdrawBalance: string | null;
        deleteAt: number | null;
        settledInAt: number;
    }

    interface CreateShopResult {
        id: string;
        shopCode: number;
    }

    interface DeleteShopCommandPathParams {
        shopCode: number;
    }

    interface ListShopCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface ListShopCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopName?: string | null;
        shopParam?: string | null;
        shopkeeperLoginName?: string | null;
        shopStatus?: ShopStatus | null;
        shopCode?: number | null;
        startTime?: number | null;
        endTime?: number | null;
    }

    interface ListShopV2Command {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListShopV2CommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopName?: string | null;
        date: string | null;
        shopCode?: number | null;
        shopStatus?: ShopStatus | null;
    }

    interface ListShopV2Result {
        list: ListShopV2Row[] | null;
        total: number;
        query: ListShopV2Command;
    }

    interface ListShopV2Row {
        shopCode: number;
        shopStatus: ShopStatus;
        shopkeeperName: string;
        shopName: string;
        shopPhone: string;
        date: string;
        totalTicketCount: number;
        todayTicketCount: number;
        totalSalesAmount: string;
        todaySalesAmount: string;
    }

    interface LogoutShopCommandPathParams {
        shopCode: string;
    }

    interface LotteryShop {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        orderSoundSwitch: number;
        orderVoice: string;
        homePageSwitch: number;
        shopInformationSwitch: number;
        networkOrderSwitch: number;
        shopImgUrl: string;
        shopkeeperId: string;
        recomShopCode: number;
        shopCode?: number;
        shopName: string;
        referralCode: string;
        shopkeeperName: string;
        shopkeeperLoginName: string;
        shopIcon: string;
        shopTelephone: string;
        shopNoticePic: string;
        shopNoticeImage: string | null;
        lotteryTypes: string[] | null;
        shopType: ShopType;
        staffCount?: number;
        dailyTicketSalesVolume?: number;
        dailySalesAmount?: number;
        commissionRate?: string;
        ticketFeeRate?: string;
        baseFeeRate?: string;
        walletMinBalance?: string;
        shopStatus: ShopStatus;
        lastActiveTime: any;
        rechargeMinAmount?: string;
        rechargeMaxAmount?: string;
        withdrawMinAmount?: string;
        withdrawMaxAmount?: string;
        withdrawMaxCount?: number;
        paymentMethods: string[] | null;
        withdrawalType: WithdrawalType;
        walletId: string;
        ticketRate?: number;
        registerSwitch?: boolean;
        rechargeBetSwitch: boolean;
        freePasswordSwitch: boolean;
        orderTimeSwitch: boolean;
        autoTicket: AutoTicketType;
        autoTicketMin: number;
        autoTicketMax: number;
        autoReceiveMin: number;
        autoReceiveMax: number;
        autoLottery: boolean;
        showLottery: boolean;
        shopNotice: string | null;
        defaultShopNotice: string | null;
        announceSwitch: boolean;
        showShopkeeperName: boolean;
        shopPhone: string | null;
        showPhone: boolean;
        shopWechat: string | null;
        showWechat: boolean;
        showAddress: boolean;
        showNotice: boolean;
        province: string | null;
        city: string | null;
        district: string | null;
        shopDetailedAddress: string | null;
        headImg: string | null;
        consignmentCertificateSportsLottery: string;
        consignmentCertificateWelfareLottery: string;
        doorProjection: string;
        idCardFront: string;
        idCardReverse: string;
        idCardHand: string;
        legalPersonDoorPhoto: string;
        consignmentCertificateWelfareLotteryHand: string;
        consignmentCertificateSportsLotteryHand: string;
        certificationVideo: string;
        searchValue: string | null;
        remark: string | null;
        balance: string | null;
        withdrawBalance: string | null;
        deleteAt: number | null;
        settledInAt: number;
    }

    interface LotteryShopInfo {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        orderSoundSwitch: number;
        orderVoice: string;
        homePageSwitch: number;
        shopInformationSwitch: number;
        networkOrderSwitch: number;
        shopImgUrl: string;
        shopkeeperId: string;
        recomShopCode: number;
        shopCode?: number;
        shopName: string;
        referralCode: string;
        shopkeeperName: string;
        shopkeeperLoginName: string;
        shopIcon: string;
        shopTelephone: string;
        shopNoticePic: string;
        shopNoticeImage: string | null;
        lotteryTypes: string[] | null;
        shopType: ShopType;
        staffCount?: number;
        dailyTicketSalesVolume?: number;
        dailySalesAmount?: number;
        commissionRate?: string;
        ticketFeeRate?: string;
        baseFeeRate?: string;
        walletMinBalance?: string;
        shopStatus: ShopStatus;
        lastActiveTime: any;
        rechargeMinAmount?: string;
        rechargeMaxAmount?: string;
        withdrawMinAmount?: string;
        withdrawMaxAmount?: string;
        withdrawMaxCount?: number;
        paymentMethods: string[] | null;
        withdrawalType: WithdrawalType;
        walletId: string;
        ticketRate?: number;
        registerSwitch?: boolean;
        rechargeBetSwitch: boolean;
        freePasswordSwitch: boolean;
        orderTimeSwitch: boolean;
        autoTicket: AutoTicketType;
        autoTicketMin: number;
        autoTicketMax: number;
        autoReceiveMin: number;
        autoReceiveMax: number;
        autoLottery: boolean;
        showLottery: boolean;
        shopNotice: string | null;
        defaultShopNotice: string | null;
        announceSwitch: boolean;
        showShopkeeperName: boolean;
        shopPhone: string | null;
        showPhone: boolean;
        shopWechat: string | null;
        showWechat: boolean;
        showAddress: boolean;
        showNotice: boolean;
        province: string | null;
        city: string | null;
        district: string | null;
        shopDetailedAddress: string | null;
        headImg: string | null;
        consignmentCertificateSportsLottery: string;
        consignmentCertificateWelfareLottery: string;
        doorProjection: string;
        idCardFront: string;
        idCardReverse: string;
        idCardHand: string;
        legalPersonDoorPhoto: string;
        consignmentCertificateWelfareLotteryHand: string;
        consignmentCertificateSportsLotteryHand: string;
        certificationVideo: string;
        searchValue: string | null;
        remark: string | null;
        balance: string | null;
        withdrawBalance: string | null;
        deleteAt: number | null;
        settledInAt: number;
        rechargeAmount: string;
        withdrawAmount: string;
        cooperationIncome: string;
        serviceCharge: string;
        registerUsers: number;
        totalUsers: number;
        proxyUser: number;
        bonusAmount: string;
        addAmount: string;
        reduceAmount: string;
        bonusAddAmount: string;
        bonusReduceAmount: string;
        ticketAmount: string;
        lotteryUsers: number;
        todayShopBalance: string;
        yesterdayShopBalance: string;
        shopBalanceChange: string;
        todayEscrowBalance: string;
        yesterdayEscrowBalance: string;
        escrowBalanceChange: string;
    }

    interface PageData {
        list: LotteryShopInfo[] | null;
        total: number;
        query: ListShopCommand;
    }

    interface SettingShopCommandPathParams {
        shopCode: number;
    }

    interface SettingShopCommandWithoutPath {
        shopNotice?: string | null;
        showNotice?: boolean;
        announceSwitch?: boolean;
        showShopkeeperName?: boolean;
        shopPhone?: string | null;
        showPhone?: boolean;
        shopWechat?: string | null;
        showWechat?: boolean;
        showAddress?: boolean;
        shopDetailedAddress?: string | null;
    }

    interface SettledInShopCommandPathParams {
        shopCode: number;
    }

    interface SettledInShopCommandWithoutPath {
        shopkeeperId: string;
        headImg?: string | null;
        consignmentCertificateWelfareLotteryHand?: string;
        consignmentCertificateSportsLotteryHand?: string;
        doorProjection: string;
        idCardFront: string;
        idCardReverse: string;
        idCardHand: string;
        legalPersonDoorPhoto?: string | null;
        consignmentCertificateSportsLottery?: string;
        consignmentCertificateWelfareLottery?: string;
        certificationVideo?: string | null;
        searchValue: string | null;
        shopImgUrl: string;
        shopName: string;
        shopkeeperName?: string;
        province: string;
        city: string;
        district: string;
        shopDetailedAddress: string;
        shopType?: ShopType | null;
        remark?: string | null;
    }

    interface ShopCodePathParams {
        shopCode: number;
    }

    interface UpdateShopCommandPathParams {
        shopCode: number;
    }

    interface UpdateShopCommandWithoutPath {
        orderSoundSwitch?: number | null;
        orderVoice?: string | null;
        homePageSwitch?: number | null;
        shopInformationSwitch?: number | null;
        networkOrderSwitch?: number | null;
        shopImgUrl?: string | null;
        shopName?: string | null;
        shopIcon?: string | null;
        shopTelephone?: string | null;
        shopNoticePic?: string | null;
        shopNoticeImage?: string | null;
        shopType?: ShopType | null;
        staffCount?: number | null;
        dailyTicketSalesVolume?: number | null;
        dailySalesAmount?: number | null;
        commissionRate?: string | null;
        walletMinBalance?: string | null;
        shopStatus?: ShopStatus | null;
        rechargeMinAmount?: string | null;
        rechargeMaxAmount?: string | null;
        withdrawMinAmount?: string | null;
        withdrawMaxAmount?: string | null;
        withdrawMaxCount?: number | null;
        paymentMethods?: string[] | null;
        withdrawalType?: WithdrawalType | null;
        ticketRate?: number | null;
        registerSwitch?: boolean | null;
        rechargeBetSwitch?: boolean | null;
        freePasswordSwitch?: boolean | null;
        orderTimeSwitch?: boolean | null;
        autoTicket?: AutoTicketType | null;
        autoTicketMin?: number | null;
        autoTicketMax?: number | null;
        autoReceiveMin?: number | null;
        autoReceiveMax?: number | null;
        autoLottery?: boolean | null;
        showLottery?: boolean | null;
        shopNotice?: string | null;
        defaultShopNotice?: string | null;
        announceSwitch?: boolean | null;
        showShopkeeperName?: boolean | null;
        shopPhone?: string | null;
        showPhone?: boolean | null;
        shopWechat?: string | null;
        showWechat?: boolean | null;
        showAddress?: boolean | null;
        showNotice?: boolean | null;
        province?: string | null;
        city?: string | null;
        district?: string | null;
        shopDetailedAddress?: string | null;
        headImg?: string | null;
        consignmentCertificateSportsLottery?: string | null;
        consignmentCertificateWelfareLottery?: string | null;
        doorProjection?: string | null;
        idCardFront?: string | null;
        idCardReverse?: string | null;
        idCardHand?: string | null;
        legalPersonDoorPhoto?: string | null;
        consignmentCertificateWelfareLotteryHand?: string | null;
        consignmentCertificateSportsLotteryHand?: string | null;
        certificationVideo?: string | null;
        searchValue?: string | null;
        remark?: string | null;
    }

    // 1: 禁用自动接单, 2: 自动接单, 3: 自动接单并出票
    type AutoTicketType = 1 | 2 | 3;

    // 1: 未认证/未入驻, 2: 审核中, 3: 已认证, 4: 已拒绝, 5: 解除入驻
    type ShopStatus = 1 | 2 | 3 | 4 | 5;

    // 1: 福体彩双机店, 2: 体彩单机店, 3: 福彩单机店
    type ShopType = 1 | 2 | 3;


    type WithdrawalType = 1 | 2 | 3;

}
