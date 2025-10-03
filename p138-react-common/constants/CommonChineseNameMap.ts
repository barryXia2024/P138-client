
    // 1: 保存方案, 2: 已删除, 3: 已取消, 4: 待接单(包含已下单), 5: 待出票, 6: 出票失败(包含已撤单,超时退票), 7: 已出票(待开奖), 8: 已取票, 10: 待派奖, 11: 未中奖, 12: 已派奖, 9: 已撤单
    // type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 11 | 12 | 9;


export const OrderStatusChineseNameMap: Record<
  CoreCommonEnum.OrderStatus | 0 | 'All',
  string
> = {
  0: '全部',
  1: '保存方案',
  2: '已删除',
  3: '已取消',
  4: '待接单',
  5: '待出票',
  6: '出票失败',
  7: '已出票',
  8: '已取票',
  10: '待派奖',
  11: '未中奖',
  12: '已派奖',
  9: '已撤单',
  All: '全部',
};
export const OrderTypeChineseNameMap: Record<CoreCommonEnum.OrderType, string> =
  {
    1: '自购',
    2: '合买',
    3: '代买',
    4: '追号',
  };
 

export const ShopStatusChineseNameMap: Record<
  ServerCoreShop.ShopStatus,
  string
> = {
  1: '未认证/未入驻',
  2: '审核中',
  3: '已认证',
  4: '已拒绝',
  5: '解除入驻',
};

// 1: 待审核, 2: 审核通过, 3: 已拒绝合作申请
export const ReviewStatusChineseNameMap: Record<
  CoreCommonEnum.ReviewStatus,
  string
> = {
  1: '待审核',
  2: '审核通过',
  3: '审核拒绝',
};

// 1: 福体彩双机店, 2: 体彩单机店, 3: 福彩单机店
export const ShopTypeChineseNameMap: Record<ServerCoreShop.ShopType, string> = {
  1: '福体彩双机店',
  2: '体彩单机店',
  3: '福彩单机店',
}; // 提现类型映射
export const WithdrawalTypeChineseNameMapMap: Record<
  ServerCoreShop.WithdrawalType,
  string
> = {
  1: '银行卡',
  2: '支付宝',
  3: '微信',
};

// 自动出票类型映射
export const AutoTicketChineseNameMapMap: Record<
  ServerCoreShop.ShopType,
  string
> = {
  1: '禁用自动接单',
  2: '自动接单',
  3: '自动接单并出票',
};

export const CooperationStatisticsTypeChineseNameMap: Record<
CoreCommonEnum.CooperationStatisticsType,
  string
> = {
  1: '派单',
  2: '出票',
  3: '派奖',
  4: '加款',
  5: '扣款',
  6: '充值',
  7: '提现',
  8: '服务费',
  9: '佣金',
  10: '托管余额',
};

export const ShopServiceChargeTabTypeChineseMap: Record<
  CoreCommonEnum.ShopServiceChargeTabType,
  string
> = {
  1: '全部',
  2: '收入',
  3: '服务费',
  4: '其他支出',
};
  
 export const TransactionTypeChineseNameMap: Record<CoreCommonEnum.TransactionType, string> = {
   1: '充值',
   2: '提现',
   3: '投注',
   4: '派奖',
   5: '退款',
   6: '转账',
   7: '代购支付',
   8: '店主加款',
   9: '店主扣款',
   10: '赠送加款',
   11: '赠送扣款',
   12: '发单佣金',
   13: '注册赠送',
   14: '全民推广赠送',
   15: "充值赠送",
   16: "首充赠送",
   17: "平台转账",
   18: "追号支付",
   19: "追号退款",
   20: "追号返奖",
 };

// 中奖状态映射
export const winStatusChineseNameMap: Record<number, string> = {
  1: '未开奖',
  2: '中奖',
  3: '未中奖',
};