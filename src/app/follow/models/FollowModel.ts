import {getOrderTrackHall} from 'src/api/interface/orders-follow-hall';
import {LotteryModel} from 'src/app/home/models/LotteryModel';


/**
 * 获取彩票列表数据
 * 复用 home 模块的彩票数据处理逻辑
 * @param shopCode 店铺编码
 * @returns 彩票列表数据
 */
export async function getFollowLotteryList(shopCode: number): Promise<ServerCommonLottery.ListCustomLotteryResult[]> {
  try {
    // 复用 home 模块的彩票数据获取逻辑
    const response = await LotteryModel.getLotteryList({shopCode});
    
    if (!response.data) {
      return [];
    }

    // 复用 home 模块的彩票数据处理逻辑
    const processedData = LotteryModel.getProcessedLotteryData(response.data);
    
    // 返回 category2 中开启发单功能的彩票
    return processedData.category2.filter(item => item.billingSwitch === 1);
  } catch (error) {
    console.error('获取彩票列表失败:', error);
    throw error;
  }
}

/**
 * 合并跟单大厅数据（用于分页加载）
 * @param currentData 当前数据
 * @param newData 新数据
 * @returns 合并后的数据
 */
export function mergeOrderTrackHallData(
  currentData: CommonFollowHall.ListOrderTrackHallResult | undefined,
  newData: CommonFollowHall.ListOrderTrackHallResult,
): CommonFollowHall.ListOrderTrackHallResult {
  if (!currentData) {
    return newData;
  }

  return {
    ...currentData,
    list: [...(currentData.list || []), ...(newData.list || [])],
    total: newData.total,
  };
}

/**
 * 检查是否有更多数据
 * @param total 总数
 * @param currentLength 当前长度
 * @returns 是否有更多数据
 */
export function hasMoreData(
  total: number | undefined,
  currentLength: number | undefined,
): boolean {
  return !!(total && currentLength && currentLength < total);
}

// 直接导出原始的 API 函数
export {getOrderTrackHall}; 