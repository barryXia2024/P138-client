
declare namespace ServerCorePayment {

    interface ApplyParam {
        applyParamID?: string;
        key: string;
        tips: string;
        label: string;
        type: string;
        required: boolean;
    }

    interface ApplyRemind {
        applyRemindID?: string;
        turnNo: number;
        imageURL?: string;
        qrcode?: string;
    }

    interface CreatePlatformPaymentMethodCommand {
        paymentMethod: CoreCommonEnum.PaymentMethod | null;
        methodMaxAmount: string | null;
        methodMinAmount: string | null;
        payIcon: string;
        payName: string;
        paymentMethodList?: PaymentMethodInfo[] | null;
        remark?: string | null;
    }

    interface CreateShopPaymentMethodCommand {
        paymentMethodID: string;
        paymentMethodInfoID: string;
        shopCode?: number | null;
        shopName?: string | null;
        isDefault: boolean;
        paymentMethodDetail?: PaymentMethodDetail;
        applyParamsValues: Record<string,any> | null;
        methodSort: number;
    }

    interface DeletePlatformPaymentMethodCommandPathParams {
        paymentMethodID: string;
    }

    interface DeleteShopCustomerPaymentMethodCommandPathParams {
        shopCustomerPaymentMethodID: string;
    }

    interface DeleteShopPaymentMethodCommandPathParams {
        shopPaymentMethodID: string;
    }

    interface GetPlatformPaymentMethodCommandPathParams {
        paymentMethodID: string;
    }

    interface GetShopCustomerPaymentMethodCommandPathParams {
        shopCustomerPaymentMethodID: string;
    }

    interface GetShopPaymentMethodCommandPathParams {
        shopPaymentMethodID: string;
    }

    interface ListPlatformPaymentMethodCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        applyFlag?: CoreCommonEnum.ApplyFlag | null;
        paymentMethod?: CoreCommonEnum.PaymentMethod | null;
        payName?: string | null;
        channelName?: string | null;
        isEnable?: boolean | null;
    }

    interface ListPlatformPaymentMethodCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        applyFlag?: CoreCommonEnum.ApplyFlag | null;
        paymentMethod?: CoreCommonEnum.PaymentMethod | null;
        payName?: string | null;
        channelName?: string | null;
        isEnable?: boolean | null;
    }

    interface ListPlatformPaymentMethodResult {
        list: PlatformPaymentMethod[] | null;
        total: number;
        query: ListPlatformPaymentMethodCommand;
    }

    interface ListShopApplyForOpenCustomerPaymentMethodCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode?: number | null;
        startTime?: number | null;
        endTime?: number | null;
        reviewStatus?: CoreCommonEnum.ReviewStatus | null;
        applyID?: string | null;
    }

    interface ListShopApplyForOpenCustomerPaymentMethodCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        shopCode: number | null;
        startTime?: number | null;
        endTime?: number | null;
        reviewStatus?: CoreCommonEnum.ReviewStatus | null;
        applyID?: string | null;
    }

    interface ListShopApplyForOpenCustomerPaymentMethodResult {
        list: ShopApplyForOpenCustomerPaymentMethodRecord[] | null;
        total: number;
        query: ListShopApplyForOpenCustomerPaymentMethodCommand;
    }

    interface ListShopCustomerPaymentMethodCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number;
        hasOpenPay?: HasOpenPay | null;
        hasActivatePay?: HasActivatePay | null;
    }

    interface ListShopCustomerPaymentMethodCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode: number;
        hasOpenPay?: HasOpenPay | null;
        hasActivatePay?: HasActivatePay | null;
    }

    interface ListShopCustomerPaymentMethodResult {
        list: ListShopCustomerPaymentMethodRow[] | null;
        total: number;
        query: ListShopCustomerPaymentMethodCommand;
    }

    interface ListShopCustomerPaymentMethodRow {
        platformPaymentMethodID: string;
        shopCode?: number;
        shopName?: string;
        payIcon: string;
        payName: string;
        isEnable: boolean;
        createdAt: number;
        updatedAt: number;
        createBy: string;
        updateBy: string;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        methodMaxAmount: string;
        methodMinAmount: string;
        remark: string;
        paymentMethodList: PaymentMethodInfo[] | null;
    }

    interface ListShopPaymentMethodCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode?: number | null;
        isEnable?: boolean | null;
        isDefault?: boolean | null;
    }

    interface ListShopPaymentMethodCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        startTime?: number | null;
        endTime?: number | null;
        shopCode?: number | null;
        isEnable?: boolean | null;
        isDefault?: boolean | null;
    }

    interface ListShopPaymentMethodResult {
        list: ListShopPaymentMethodRow[] | null;
        total: number;
        query: ListShopPaymentMethodCommand;
    }

    interface ListShopPaymentMethodRow {
        platformPaymentMethodID: string;
        shopCode?: number;
        shopName?: string;
        payIcon: string;
        payName: string;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        methodMaxAmount: string;
        methodMinAmount: string;
        paymentMethodList: PaymentMethodInfoResp[] | null;
    }

    interface PaymentMethodDetail {
        paymentMethodDetailID?: string;
        paymentMethodDesc?: string;
        paymentReminder?: PaymentReminder;
        openStartTime: string;
        openEndTime: string;
        shopMethodMaxAmount?: string;
        shopMethodMinAmount?: string;
        methodMaxAmount?: string;
        methodMinAmount?: string;
    }

    interface PaymentMethodInfo {
        paymentMethodInfoID?: string;
        methodMaxAmount?: string;
        methodMinAmount?: string;
        channelName: string;
        remark?: string;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        displayShopDesc?: string;
        applyParams?: ApplyParam[] | null;
        applyReminds?: ApplyRemind[] | null;
        hasSignContract?: number;
        applyFlag: CoreCommonEnum.ApplyFlag;
        paymentMethodDetail?: PaymentMethodDetail;
        shopApplyParamsValues?: Record<string,any> | null;
        shopPaymentMethodID?: string;
        shopHasOpenPay?: HasOpenPay;
        shopHasActivatePay?: HasActivatePay;
        applyParamsValues?: Record<string,any> | null;
        isEnable?: boolean;
    }

    interface PaymentMethodInfoResp {
        paymentMethodInfoID?: string;
        methodMaxAmount?: string;
        methodMinAmount?: string;
        channelName: string;
        remark?: string;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        displayShopDesc?: string;
        applyParams?: ApplyParam[] | null;
        applyReminds?: ApplyRemind[] | null;
        hasSignContract?: number;
        applyFlag: CoreCommonEnum.ApplyFlag;
        paymentMethodDetail?: PaymentMethodDetail;
        applyParamsValues?: Record<string,any> | null;
        isEnable?: boolean;
        methodSort: number;
        isDefault: boolean;
        createdAt: number;
        updatedAt: number;
        createBy: string;
        updateBy: string;
        shopPaymentMethodID?: string;
    }

    interface PaymentReminder {
        paymentBefore?: string;
        paymentAfter?: string;
        paymentQrcodeOneURL?: string;
        paymentQrcodeTwoURL?: string;
        paymentQrcodeThreeURL?: string;
        displayShopDesc?: string;
    }

    interface PlatformPaymentMethod {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        isEnable: boolean;
        methodMaxAmount: string;
        methodMinAmount: string;
        payIcon: string;
        payName: string;
        paymentMethodList: PaymentMethodInfo[] | null;
        remark: string;
        deleteAt: number;
        createBy: string;
        updateBy: string;
    }

    interface ReviewShopApplyForOpenCustomerPaymentMethodCommandPathParams {
        applyID: string;
    }

    interface ReviewShopApplyForOpenCustomerPaymentMethodCommandWithoutPath {
        reviewStatus: CoreCommonEnum.ReviewStatus;
        refuseReason?: string;
    }

    interface ShopApplyForOpenCustomerPaymentMethodCommandPathParams {
        paymentMethodID: string;
    }

    interface ShopApplyForOpenCustomerPaymentMethodCommandWithoutPath {
        paymentMethodInfoID: string;
        applyParamsValues?: Record<string,any> | null;
        shopCode: number;
    }

    interface ShopApplyForOpenCustomerPaymentMethodProcessByApplyIDCommandPathParams {
        applyID: string;
    }

    interface ShopApplyForOpenCustomerPaymentMethodProcessCommand {
        paymentMethodID: string;
        paymentMethodInfoID: string;
        shopCode: number;
    }

    interface ShopApplyForOpenCustomerPaymentMethodRecord {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        shopCode: number;
        shopName: string;
        reviewStatus: CoreCommonEnum.ReviewStatus;
        applyUserID: string;
        applyUserName: string;
        applyUserType: ServerCoreUser.UserType;
        reviewUserID: string;
        reviewUserType: ServerCoreUser.UserType;
        reviewUserName: string;
        paymentMethod: CoreCommonEnum.PaymentMethod;
        applyParamsValues: Record<string,any> | null;
        applyParams: ApplyParam[] | null;
        paymentMethodInfoID: string;
        platformPaymentMethodID: string;
        refuseReason: string;
    }

    interface UpdatePlatformPaymentMethodCommandPathParams {
        paymentMethodID: string;
    }

    interface UpdatePlatformPaymentMethodCommandWithoutPath {
        paymentMethodList?: PaymentMethodInfo[] | null;
        paymentMethod?: CoreCommonEnum.PaymentMethod | null;
        methodMaxAmount?: string | null;
        methodMinAmount?: string | null;
        payIcon?: string | null;
        payName?: string | null;
        remark?: string | null;
        isEnable?: boolean | null;
    }

    interface UpdateShopCustomerPaymentMethodCommandPathParams {
        shopCustomerPaymentMethodID: string;
    }

    interface UpdateShopCustomerPaymentMethodCommandQueryWithoutPath {
        hasActivatePay?: HasActivatePay | null;
        paymentMethodDetail?: any;
    }

    interface UpdateShopCustomerPaymentMethodCommandWithoutPath {
        hasActivatePay?: HasActivatePay | null;
        paymentMethodDetail?: PaymentMethodDetail;
    }

    interface UpdateShopPaymentMethodCommandPathParams {
        shopPaymentMethodID: string;
    }

    interface UpdateShopPaymentMethodCommandWithoutPath {
        shopCode?: number | null;
        shopName?: string | null;
        isDefault?: boolean | null;
        paymentMethodDetail?: PaymentMethodDetail;
        applyParamsValues?: Record<string,any> | null;
        methodSort?: number | null;
    }

    // 1: 未激活, 2: 已激活
    type HasActivatePay = 1 | 2;

    // 1: 未开通, 2: 已开通
    type HasOpenPay = 1 | 2;

}
