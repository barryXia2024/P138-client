
declare namespace CoreCommonEnum {

    interface LotteryInfo {
        lotteryName: LotteryName;
        lotteryType: LotteryType;
        lotteryCategory: LotteryCategory;
        lotteryChineseName: LotteryChineseName;
        lotteryIcon: string;
    }

    // 1: 手动接单, 2: 自动接单
    type AcceptOrderType = 1 | 2;

    // C端APP: C端APP, B端APP: B端APP
    type AppType = 1 | 2;

    // 1: 追加, 2: 不追加
    type AppendType = '1' | '2';

    // 1: 开启开通, 2: 暂定开通
    type ApplyFlag = 1 | 2;

    // 1: 直选定位复式, 2: 直选组合复式
    type ArrangedFivePlay = 1 | 2;

    // 1: 直选, 2: 组三, 3: 组六, 4: 组选
    type ArrangedThreePlay = 1 | 2 | 3 | 4;

    // SPF: 胜平负, QCBF: 全场比分, ZJQ: 总进球数, SXDS: 上下单双, BQC: 半全场, SFGG: 胜负彩
    type BDBetType = 'SPF' | 'QCBF' | 'ZJQ' | 'SXDS' | 'BQC' | 'SFGG';

    // 1: 待出票, 2: 待开奖, 3: 已开奖, 4: 已中奖
    type BetRecordTabType = 1 | 2 | 3 | 4;

    // 1: 收入, 2: 支出
    type ChangeType = 1 | 2;

    // 1: 等待中, 2: 追号成功, 3: 追号失败, 4: 追号取消
    type ChaseNumberExecutionStatus = 1 | 2 | 3 | 4;

    // 1: 未开始, 2: 进行中, 3: 已结束, 4: 已停止
    type ChaseNumberStatus = 1 | 2 | 3 | 4;

    // 1: 五不同, 2: 二同, 3: 三同, 4: 两组不同, 5: 四同, 6: 三同二同
    type CombinationArrangedFivePlayParamType = '1' | '2' | '3' | '4' | '5' | '6';

    // 1: 下单佣金, 2: 出票, 3: 派奖, 4: 加款, 5: 扣款, 6: 充值, 7: 提现, 8: 服务费, 9: 转账
    type CooperationShopTransactionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

    // 1: 派单, 2: 出票, 3: 派奖, 4: 加款, 5: 扣款, 6: 充值, 7: 提现, 8: 服务费, 9: 佣金, 10: 转账
    type CooperationStatisticsType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    // 1: 前区胆码, 2: 后区胆码, 3: 后区胆码, 4: 后区拖码
    type DanTuoSelectionSuperLottoPlayParamType = '1' | '2' | '3' | '4';

    // 1: 个位, 2: 十位, 3: 百位, 4: 千位, 5: 万位
    type FixedPositionArrangedFivePlayParamType = '1' | '2' | '3' | '4' | '5';

    // 2: 2串1, 3: 3串1, 4: 4串1, 5: 5串1, 6: 6串1, 7: 7串1, 8: 8串1
    type FreeParlayPassType = 2 | 3 | 4 | 5 | 6 | 7 | 8;

    // 1: 组选和值: 例子 1,2,3, 2: 组选2码全包:例子 0,1,2,3
    type GroupSelectionArrangedThreePlayParamType = '1' | '2';

    // 1: 命中, 0: 不命中
    type HasHit = 1 | 0;

    // 1: 福利彩票(数字彩), 2: 体育彩票(竞技彩)
    type LotteryCategory = 1 | 2;

    // 双色球: 双色球, 排列五: 排列五, 排列三: 排列三, 大乐透: 大乐透, 任选九: 任选九, 胜负彩: 胜负彩, 竞彩足球: 竞彩足球, 北京单场: 北京单场, 竞彩篮球: 竞彩篮球, 七乐彩: 七乐彩, 快乐8: 快乐8, 福彩3D: 福彩3D, 6场半全场: 6场半全场, 4场进球彩: 4场进球彩, 七星彩: 七星彩, 冠军: 冠军, 冠亚军: 冠亚军
    type LotteryChineseName = '双色球' | '排列五' | '排列三' | '大乐透' | '任选九' | '胜负彩' | '竞彩足球' | '北京单场' | '竞彩篮球' | '七乐彩' | '快乐8' | '福彩3D' | '6场半全场' | '4场进球彩' | '七星彩' | '冠军' | '冠亚军';

    // DoubleBall: 双色球, ArrangedFive: 排列五, ArrangedThree: 排列三, SuperLotto: 大乐透, ChooseNine: 任选九, WinLossLottery: 胜负彩, FootballLottery: 竞彩足球, BeijingSingleMatch: 北京单场, BasketballLottery: 竞彩篮球, SevenHappy: 七乐彩, Happy8: 快乐8, Fucai3D: 福彩3D, HalfTimeFullTimeBet6: 6场半全场, GameTotalGoalsBet4: 4场进球彩, SevenStar: 七星彩, Winner: 冠军, WinnerRunnerUp: 冠亚军
    type LotteryName = 'DoubleBall' | 'ArrangedFive' | 'ArrangedThree' | 'SuperLotto' | 'ChooseNine' | 'WinLossLottery' | 'FootballLottery' | 'BeijingSingleMatch' | 'BasketballLottery' | 'SevenHappy' | 'Happy8' | 'Fucai3D' | 'HalfTimeFullTimeBet6' | 'GameTotalGoalsBet4' | 'SevenStar' | 'Winner' | 'WinnerRunnerUp';

    // 1: 上架, 2: 下架
    type LotteryStatus = 1 | 2;

    // 1: 数字彩(体彩(大乐透,排列三,排列五,七星彩),福彩(双色球，福彩3D，快乐8，七乐彩)), 2: 竞技彩(竞彩足球，竞彩篮球，北京单场), 3: 传统足彩(胜负彩，4场进球彩，6场半全场)
    type LotteryType = 1 | 2 | 3;

    // frozen: 冻结, active: 启用, disabled: 禁用
    type LotteryUserWalletStatus = 'frozen' | 'active' | 'disabled';

    // 1: 3串3, 2: 3串4, 3: 4串4, 4: 4串5, 5: 4串6, 6: 4串11, 7: 5串5, 8: 5串6, 9: 5串10, 10: 5串16, 11: 5串20, 12: 5串26, 13: 6串6, 14: 6串7, 15: 6串15, 16: 6串20, 17: 6串22, 18: 6串35, 19: 6串42, 20: 6串50, 21: 6串57, 22: 7串7, 23: 7串8, 24: 7串21, 25: 7串35, 26: 7串120, 27: 8串8, 28: 8串9, 29: 8串28, 30: 8串56, 31: 8串70, 32: 8串247, 33: 单关, 34: 2串1, 35: 3串1, 36: 4串1, 37: 5串1, 38: 6串1, 39: 7串1, 40: 8串1
    type MXNParlayType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;

    // 1: 店内订单, 2: 合作派单, 3: 合作出票
    type OrderCategory = 1 | 2 | 3;

    // 1: 保存方案, 2: 已删除, 3: 已取消, 4: 待接单(包含已下单), 5: 待出票, 6: 出票失败(包含已撤单,超时退票), 7: 已出票(待开奖), 8: 已取票, 10: 待派奖, 11: 未中奖, 12: 已派奖, 9: 已撤单
    type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 11 | 12 | 9;

    // 1: 自购, 2: 跟单, 3: 追号, 4: 发单
    type OrderType = 1 | 2 | 3 | 4;

    // 1: 自由过关(多选), 2: M串N(单选), 3: 单关
    type PassCategory = 1 | 2 | 3;

    // 1: 钱包余额, 2: 支付宝, 3: 微信支付, 4: 快捷支付, 5: 二维码收款, 6: 银行卡, 7: 泰达币, 8: luck币
    type PaymentMethod = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    // 1: 平台充值, 2: 平台提款, 3: 平台转账, 4: 平台服务费收入, 5: 平台运营支出, 6: 注册赠送, 7: 派奖, 8: 发单平台佣金
    type PlatformTransactionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    // S_PFRQ$PLAY: 让球胜平负, F_HTZ$PLAY: 胜负, S_FR$PLAY: 让分胜负, D_XF$PLAY: 大小分, S_FC$PLAY: 胜分差, S_PF$PLAY: 让球胜平负, Q_CBF$PLAY: 胜负过关, Z_JQ$PLAY: 总进球数, B_QC$PLAY: 上下单双, S_XDS$PLAY: 比分, S_FGG$PLAY: 半全场
    type PlayEnglishName = 'F_HTZ$PLAY' | 'S_PFRQ$PLAY' | 'Q_CBF$PLAY' | 'Z_JQ$PLAY' | 'B_QC$PLAY' | 'F_HTZ$PLAY' | 'S_FR$PLAY' | 'D_XF$PLAY' | 'S_FC$PLAY' | 'S_PF$PLAY' | 'Q_CBF$PLAY' | 'Z_JQ$PLAY' | 'B_QC$PLAY' | 'S_XDS$PLAY' | 'S_FGG$PLAY';

    // 胜平负: 胜平负, 全场比分: 全场比分, 进球数: 进球数, 胜负: 胜负, 让分胜负: 让分胜负, 大小分: 大小分, 胜负差: 胜分差, 让球胜平负: 让球胜平负, 胜负过关: 胜负过关, 总进球数: 总进球数, 上下单双: 上下单双, 比分: 比分, 半全场: 半全场
    type PlayName = '胜平负' | '让球胜平负' | '全场比分' | '进球数' | '半全场' | '胜负' | '让分胜负' | '大小分' | '胜负差' | '让球胜平负' | '胜负过关' | '总进球数' | '上下单双' | '比分' | '半全场';

    // 1: 截止后公开, 2: 公开
    type PostsOrderType = 1 | 2;

    // 1: 待审核, 2: 审核通过, 3: 已拒绝合作申请
    type ReviewStatus = 1 | 2 | 3;

    // 1: 全部基础服务费, 2: 店内出票服务费, 3: 合作出票服务费
    type ServiceChargeType = 1 | 2 | 3;

    // 1: 第一位数, 2: 第二位数, 3: 第三位数, 4: 第四位数, 5: 第五位数, 6: 第六位数, 7: 第七位数
    type SevenStarPlayParamType = '1' | '2' | '3' | '4' | '5' | '6' | '7';

    // 1: 全部, 2: 收入, 3: 服务费, 4: 其他支出
    type ShopServiceChargeTabType = 1 | 2 | 3 | 4;

    // 1: 店铺充值, 2: 店铺提款, 3: 彩民发单佣金, 4: 跟单店主佣金, 5: 跟单佣金扣款, 6: 服务费扣款, 9: 派奖, 12: 发单佣金, 7: 代出服务费, 8: 平台赠送红包, 10: 平台转账, 11: 出票, 13: 代出票费用
    type ShopServiceChargeTransactionType = 1 | 2 | 3 | 4 | 5 | 6 | 9 | 12 | 7 | 8 | 10 | 11 | 13;

    // 1: 复式: 例子 0,1,2,3, 2: 胆拖: 胆码|拖码 例子 0|1,2,3, 3: 跨度复式: 例子 2,3,4
    type SixCombinedArrangedThreePlayParamType = '1' | '2' | '3';


    type Sort = 'createdAt';

    // 1: 前区, 2: 前区
    type StandardSelectionSuperLottoPlayParamType = '1' | '2';

    // 1: 定位复式: 传值方式: 百位|十位|个位 例如: 0,1|0,1|0,1, 2: 组合三不同:例子 0,1,2,3 必须大于等于3, 3: 和值:例子 00,01,02, 4: 组合胆拖: 例子 胆码|拖码 0,1|0,1, 5: 跨度复式:例子 0,1,2
    type StraightSelectionArrangedThreePlayParamType = '1' | '2' | '3' | '4' | '5';

    // 1: 普通选号, 2: 胆拖选号
    type SuperLottoPlay = 1 | 2;

    // 1: 单式:例子: 00,1, 2: 复式:例子 必须大于等于2个数字 0,1,2,3, 3: 胆拖:  胆码|拖码 例子 0|1,2,3, 4: 跨度复式: 例子: 1,2,3
    type ThreeCombinedArrangedThreePlayParamType = '1' | '2' | '3' | '4';

    // 店内票据: 店内票据, 合作派单和出票: 合作派单和出票
    type TicketType = 1 | 2;

    // success: 交易成功, pending: 审核中, failed: 交易失败
    type TransactionStatus = 'success' | 'pending' | 'failed';

    // 0: 全部, 1: 收入, 2: 服务费, 3: 其他支出
    type TransactionSummaryType = 0 | 1 | 2 | 3;

    // 充值: 充值, 提现: 提款(提现), 投注: 投注, 返奖: 返奖, 退款: 退款, 转账: 转账, 代购支付: 代购支付, 店主加款: 店主加款, 店主扣款: 店主扣款, 赠送加款: 赠送加款, 赠送扣款: 赠送扣款, 发单佣金: 发单佣金, 注册赠送或者推荐赠送: 注册赠送, 全民推广赠送: 全民推广赠送, 充值赠送: 充值赠送, 首充赠送: 首充赠送, 平台转账: 平台转账, 追号支付: 追号支付, 追号退款: 追号退款, 追号返奖: 追号返奖
    type TransactionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

    // 0: 非支付类型, 1: 钱包余额支付, 2: 信用支付
    type WalletPayType = 0 | 1 | 2;

    // 1: 彩民钱包, 2: 店铺服务钱包, 3: 合作店铺钱包, 4: 平台钱包, 5: 店铺员工钱包, 6: 主播钱包
    type WalletType = 1 | 2 | 3 | 4 | 5 | 6;

}
