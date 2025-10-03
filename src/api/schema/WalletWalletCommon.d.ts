
declare namespace WalletWalletCommon {

    interface Wallet {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        userID: string;
        userType: ServerCoreUser.UserType;
        walletType: CoreCommonEnum.WalletType;
        username: string;
        shopCode: number;
        cooperationShopCode: number;
        balance: string;
        currency: BasicTypes.Currency;
        frozenBalance: string;
        withdrawBalance: string;
        totalRechargeAmount: string;
        totalBettingAmount: string;
        totalWinningAmount: string;
        totalSendPrizeAmount: string;
        totalWithdrawalAmount: string;
        cooperationCreditLimit: string;
        totalIncomeAmount: string;
        totalExpenseAmount: string;
        totalTransferAmount: string;
        totalTicketAmount: string;
        totalCommissionAmount: string;
        walletStatus: CoreCommonEnum.LotteryUserWalletStatus;
        lastTransactionTime: any;
    }

}
