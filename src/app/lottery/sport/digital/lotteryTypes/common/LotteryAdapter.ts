
// 统一的彩票适配器接口
export interface ILotteryAdapter {
  // 基础信息
  lotteryName: CoreCommonEnum.LotteryName;

  // 状态访问
  get betCount(): number;
  get betAmount(): number;

  // 方法
  clearSelection(): void;
  buildTicket(): Promise<any>;
  quickPick(count?: number): void;

  // 模式相关（数字彩票特有）
  setMode?(mode: 'normal' | 'dantuo'): void;
  get mode(): 'normal' | 'dantuo' | undefined;

  // 数字彩票特有方法
  toggleRed?(num: number): void;
  toggleBlue?(num: number): void;
  toggleRedDan?(num: number): void;
  toggleRedTuo?(num: number): void;
  toggleBlueDan?(num: number): void;
  toggleBlueTuo?(num: number): void;

  // 数字彩票状态
  get red(): number[];
  get blue(): number[];
  get redDan(): number[];
  get redTuo(): number[];
  get blueDan(): number[];
  get blueTuo(): number[];

  // 位置彩票特有方法
  toggleNumber?(positionIndex: number, num: number): void;
  getPosition?(index: number): number[];

  // 位置彩票状态
  get positions(): number[][];
}

// 适配器工厂接口
export interface ILotteryAdapterFactory {
  createAdapter(lotteryName: CoreCommonEnum.LotteryName, config: any): ILotteryAdapter;
}

// 适配器创建函数类型
export type LotteryAdapterCreator = (store: any) => ILotteryAdapter;
