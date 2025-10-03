export * from './historyData';



export interface HistoryLotteryData {
    lotteryName: string;    // 彩票名称
    termNo: string;         // 期号
    openDate: string;       // 开奖日期
    result: string;         // 开奖结果，格式：'01#07#09#16#30|02#05'
    saleAmount: string;     // 销售金额
    poolBonus: string;      // 奖池金额
    nineSaleAmount?: string | null;  // 九等奖销售金额
    ninePoolBonus?: string | null;   // 九等奖奖池金额
    nextOpenDate?: string | null;    // 下次开奖日期
    vos?: any | null;               // 其他数据
    competitionVos?: any | null;    // 竞彩数据
  }

  export interface SuperLottoMockData{
    code:number,
    msg:string|null,
    data:{
      omissionList:string[],
      currentTermNo:string,
      buyEndTime:string,
      vos:HistoryLotteryData[],
    }
  }