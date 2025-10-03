// 追加标识：'1' 追加，'2' 不追加（与后端约定保持一致）
export enum AppendFlagEnum {
  Append = '1',
  NotAppend = '2',
}

 

export interface MultiplierDict {
  [betId: string]: number;
}

// 轻量信息类型，避免对外部大类型强依赖
export interface LotteryInfoLite {
  id?: string;
  lotteryName?: CoreCommonEnum.LotteryName;
  lotteryType?: CoreCommonEnum.LotteryType;
  lotteryIcon?: string;
  lotteryCategory?: CoreCommonEnum.LotteryCategory;
}
 
 