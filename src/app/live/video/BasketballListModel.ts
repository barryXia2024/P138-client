import { listBasketballCompetition } from 'src/api/interface/competition-basketball';
import { 
  BasketballCompetitionData, 
  BasketballFilterConfig, 
  GetBasketballDataParams,
  BasketballListItem 
} from './types';

export class BasketballListModel {
  // 篮球筛选器配置
  static readonly filterConfig: BasketballFilterConfig = {
    competitionType: ['LQ'],
    sort: ['createdAt'],
    label: ['篮球'],
  };

  // 获取篮球比赛数据
  static async getCompetitionData(params: GetBasketballDataParams): Promise<BasketballCompetitionData> {
    try {
      const { date, currentPage, filterIndex } = params;
      
      const queryParams: ServerCommonLive.ListBasketBallCompetitionCommandQuery = {
        current: currentPage,
        pageSize: 10,
        competitionId: null,
        direction: 'asc',
        sort: this.filterConfig.sort[filterIndex],
        processDate: date,
      };

      const res = await listBasketballCompetition(queryParams);
      
      if (res.success && res.data) {
        return {
          list: res.data.list ?? [],
          total: res.data.total ?? 0,
          query: res.data.query ?? {},
        };
      } else {
        throw new Error('获取篮球数据失败');
      }
    } catch (error) {
      console.error('获取篮球比赛数据失败:', error);
      throw error;
    }
  }

  // 获取比赛类型字符串
  static getCompetitionType(filterIndex: number): ServerCommonLive.CompetitionType {
    return this.filterConfig.competitionType[filterIndex];
  }

  // 获取筛选器标签
  static getFilterLabels(): string[] {
    return this.filterConfig.label;
  }

  // 格式化列表项用于 keyExtractor
  static formatListItemForKey(item: ServerCommonLive.BasketBallCompetition): BasketballListItem {
    return {
      ...item,
      competitionId: item.id?.toString() || '',
    };
  }

  // 检查是否有更多数据
  static hasMoreData(currentData: BasketballCompetitionData): boolean {
    return (currentData.list?.length ?? 0) < (currentData.total ?? 0);
  }
} 