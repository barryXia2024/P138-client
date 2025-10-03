export enum PaymentMethodEnum {
  /**
   * 钱包余额
   */
  Wallet = 1,
  /**
   * 支付宝
   */
  Alipay = 2,
  /**
   * 微信支付
   */
  Wechat = 3,
  /**
   * 快捷支付
   */
  QuickPay = 4,
  /**
   * 二维码收款
   */
  QRCode = 5,
  /**
   * 银行卡
   */
  Bank = 6,
  /**
   * 泰达币
   */
  Tether = 7,
  /**
   * luck币
   */
  Luck = 8,
}

export enum PaymentMethodReviewStatusEnum {
  /**
   * 待审核
   */
  Pending = 1,
  /**
   * 审核通过
   */
  Approved = 2,
  /**
   * 审核拒绝
   */
  Rejected = 3,
}