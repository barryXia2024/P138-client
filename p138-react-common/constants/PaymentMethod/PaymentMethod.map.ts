// PaymentMethod.map.ts

import {
  PaymentMethodEnum,
  PaymentMethodReviewStatusEnum,
} from './PaymentMethod.enum';

export const PaymentMethodChineseNameMap: Record<PaymentMethodEnum, string> = {
  [PaymentMethodEnum.Wallet]: '钱包余额',
  [PaymentMethodEnum.Alipay]: '支付宝',
  [PaymentMethodEnum.Wechat]: '微信支付',
  [PaymentMethodEnum.QuickPay]: '快捷支付',
  [PaymentMethodEnum.QRCode]: '二维码收款',
  [PaymentMethodEnum.Bank]: '银行卡',
  [PaymentMethodEnum.Tether]: '泰达币',
  [PaymentMethodEnum.Luck]: 'luck币',
};

export const PaymentMethodReviewStatusChineseNameMap: Record<
  PaymentMethodReviewStatusEnum,
  string
> = {
  [PaymentMethodReviewStatusEnum.Pending]: '待审核',
  [PaymentMethodReviewStatusEnum.Approved]: '审核通过',
  [PaymentMethodReviewStatusEnum.Rejected]: '审核拒绝',
};
