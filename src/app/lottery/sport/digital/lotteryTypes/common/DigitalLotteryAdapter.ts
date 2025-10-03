
import {ILotteryAdapter} from './LotteryAdapter';

// 数字彩票适配器
export class DigitalLotteryAdapter implements ILotteryAdapter {
  constructor(private store: any) {}

  get lotteryName(): CoreCommonEnum.LotteryName {
    return this.store.lotteryType;
  }

  // 基础属性
  get betCount(): number {
    return this.store.betCount || 0;
  }

  get betAmount(): number {
    return this.store.betAmount || 0;
  }

  // 基础方法
  clearSelection(): void {
    this.store.clearSelection();
  }

  async buildTicket(): Promise<any> {
    return this.store.buildTicket();
  }

  quickPick(count: number = 1): void {
    this.store.quickPick(count);
  }

  // 模式相关
  setMode(mode: 'normal' | 'dantuo'): void {
    if (this.store.setMode) {
      this.store.setMode(mode);
    }
  }

  get mode(): 'normal' | 'dantuo' | undefined {
    return this.store.mode;
  }

  // 数字彩票特有方法
  toggleRed(num: number): void {
    this.store.toggleRed(num);
  }

  toggleBlue(num: number): void {
    this.store.toggleBlue(num);
  }

  toggleRedDan(num: number): void {
    this.store.toggleRedDan(num);
  }

  toggleRedTuo(num: number): void {
    this.store.toggleRedTuo(num);
  }

  toggleBlueDan(num: number): void {
    this.store.toggleBlueDan(num);
  }

  toggleBlueTuo(num: number): void {
    this.store.toggleBlueTuo(num);
  }

  // 数字彩票状态
  get red(): number[] {
    return this.store.red || [];
  }

  get blue(): number[] {
    return this.store.blue || [];
  }

  get redDan(): number[] {
    return this.store.redDan || [];
  }

  get redTuo(): number[] {
    return this.store.redTuo || [];
  }

  get blueDan(): number[] {
    return this.store.blueDan || [];
  }

  get blueTuo(): number[] {
    return this.store.blueTuo || [];
  }

  // 位置彩票方法（数字彩票不支持）
  toggleNumber(positionIndex: number, num: number): void {
    throw new Error('数字彩票不支持位置选择');
  }

  getPosition(index: number): number[] {
    throw new Error('数字彩票不支持位置选择');
  }

  get positions(): number[][] {
    return [];
  }
}
