
import {ILotteryAdapter} from './LotteryAdapter';

// 位置彩票适配器
export class PositionLotteryAdapter implements ILotteryAdapter {
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

  // 模式相关（位置彩票不支持模式切换）
  setMode(mode: 'normal' | 'dantuo'): void {
    // 位置彩票不需要模式切换
  }

  get mode(): 'normal' | 'dantuo' | undefined {
    return undefined; // 位置彩票没有模式概念
  }

  // 数字彩票方法（位置彩票不支持）
  toggleRed(num: number): void {
    throw new Error('位置彩票不支持数字选择');
  }

  toggleBlue(num: number): void {
    throw new Error('位置彩票不支持数字选择');
  }

  toggleRedDan(num: number): void {
    throw new Error('位置彩票不支持数字选择');
  }

  toggleRedTuo(num: number): void {
    throw new Error('位置彩票不支持数字选择');
  }

  toggleBlueDan(num: number): void {
    throw new Error('位置彩票不支持数字选择');
  }

  toggleBlueTuo(num: number): void {
    throw new Error('位置彩票不支持数字选择');
  }

  // 数字彩票状态（位置彩票不支持）
  get red(): number[] {
    return [];
  }

  get blue(): number[] {
    return [];
  }

  get redDan(): number[] {
    return [];
  }

  get redTuo(): number[] {
    return [];
  }

  get blueDan(): number[] {
    return [];
  }

  get blueTuo(): number[] {
    return [];
  }

  // 位置彩票特有方法
  toggleNumber(positionIndex: number, num: number): void {
    this.store.toggleNumber(positionIndex, num);
  }

  getPosition(index: number): number[] {
    return this.store.getPosition ? this.store.getPosition(index) : [];
  }

  // 位置彩票状态
  get positions(): number[][] {
    return this.store.positions || [];
  }
}
