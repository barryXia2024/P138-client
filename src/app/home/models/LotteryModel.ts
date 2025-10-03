import { listCustomLotteryApi } from 'src/api/interface/lottery-lottery-type';
import { GetLotteryListParams, LotteryCategoryResult } from '../types';

export class LotteryModel {
  /**
   * 获取彩票列表
   * @param params 彩票列表参数
   * @returns 彩票列表响应
   */
  static async getLotteryList(params: GetLotteryListParams) {
    try {
      const response = await listCustomLotteryApi(params);
      return response;
    } catch (error) {
      console.error('获取彩票列表失败:', error);
      throw error;
    }
  }

  /**
   * 按分类整理彩票数据
   * @param lotteryList 彩票列表
   * @returns 分类后的彩票数据
   */
  static categorizeLotteries(lotteryList: ServerCoreLottery.ListCustomLotteryResult[] | null): LotteryCategoryResult {
    if (!lotteryList || lotteryList.length === 0) {
      return { category1: [], category2: [] };
    }

    const result: LotteryCategoryResult = {
      category1: [], // 数字彩
      category2: [], // 竞技彩
    };

    lotteryList.forEach(lottery => {
      if (lottery.lotteryCategory === 1) {
        result.category1.push(lottery);
      } else if (lottery.lotteryCategory === 2) {
        result.category2.push(lottery);
      }
    });

    return result;
  }

  /**
   * 过滤可销售的彩票
   * @param lotteryList 彩票列表
   * @returns 可销售的彩票列表
   */
  static filterSaleableLotteries(lotteryList: ServerCoreLottery.ListCustomLotteryResult[]): ServerCoreLottery.ListCustomLotteryResult[] {
    return lotteryList.filter(lottery => lottery.saleSwitch === 1);
  }

  /**
   * 按排序字段排序彩票
   * @param lotteryList 彩票列表
   * @returns 排序后的彩票列表
   */
  static sortLotteries(lotteryList: ServerCoreLottery.ListCustomLotteryResult[]): ServerCoreLottery.ListCustomLotteryResult[] {
    return [...lotteryList].sort((a, b) => (b.lotterySort || 0) - (a.lotterySort || 0));
  }

  /**
   * 获取处理后的彩票数据
   * @param lotteryList 原始彩票列表
   * @returns 处理后的彩票数据
   */
  static getProcessedLotteryData(lotteryList: ServerCoreLottery.ListCustomLotteryResult[] | null): LotteryCategoryResult {
    if (!lotteryList) {
      return { category1: [], category2: [] };
    }

    // 过滤可销售的彩票
    const saleableLotteries = this.filterSaleableLotteries(lotteryList);
    
    // 按分类整理
    const categorized = this.categorizeLotteries(saleableLotteries);
    
    // 排序
    return {
      category1: this.sortLotteries(categorized.category1),
      category2: this.sortLotteries(categorized.category2),
    };
  }

  /**
   * 检查彩票是否可销售
   * @param lottery 彩票对象
   * @returns 是否可销售
   */
  static isSaleable(lottery: ServerCoreLottery.ListCustomLotteryResult): boolean {
    return lottery.saleSwitch === 1 
  }

  /**
   * 获取彩票显示名称
   * @param lottery 彩票对象
   * @returns 显示名称
   */
  static getLotteryDisplayName(lottery: ServerCoreLottery.ListCustomLotteryResult): string {
    return lottery.lotteryChineseName || lottery.lotteryName || '未知彩票';
  }

  /**
   * 获取彩票图标URL
   * @param lottery 彩票对象
   * @returns 图标URL
   */
    static getLotteryIconUrl(lottery: ServerCoreLottery.ListCustomLotteryResult): string {
    if (!lottery.lotteryIcon) {
      return '';
    }
    // 替换 https 为 http，避免某些环境下的问题
    return lottery.lotteryIcon.replace('https://', 'http://');
  }
} 