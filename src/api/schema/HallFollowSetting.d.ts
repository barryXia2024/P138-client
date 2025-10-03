
declare namespace HallFollowSetting {

    interface CreateOrderFollowSettingCommand {
        amount: string;
        commissionRate: number;
        subscribeMinAmount: string;
        autoStopMultiple: number;
        autoStopFixed: number;
        stopAfterWin: boolean;
    }

    interface CreateOrderFollowSettingResult {
        followSettingID: string;
    }

    interface DeleteOrderFollowSettingCommandPathParams {
        followSettingID: string;
    }

    interface DeleteOrderFollowSettingResult {
        followSettingID: string;
    }

    interface UpdateOrderFollowSettingCommandPathParams {
        followSettingID: string;
    }

    interface UpdateOrderFollowSettingCommandWithoutPath {
        amount?: string | null;
        commissionRate?: number | null;
        subscribeMinAmount?: string | null;
        autoStopMultiple?: number | null;
        autoStopFixed?: number | null;
        stopAfterWin?: boolean | null;
    }

    interface UpdateOrderFollowSettingResult {
        followSettingID: string;
    }

}
