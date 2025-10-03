import { listFootballCompetition, listTraditionalFootballLotteryTermNo } from 'src/api/interface/competition-football';
import { 
  FootballCompetitionData, 
  FootballFilterConfig, 
  GetFootballDataParams,
  FootballListItem 
} from './types';

export class FootballListModel {
  // 足球筛选器配置
  static readonly filterConfig: FootballFilterConfig = {
    competitionType: ['JC', 'BD', 'SFC'],
    sort: ['matchNum', 'bdNum', 'sfcNum'],
    label: ['竞彩', '北单', '足彩'],
  };

  // 获取彩票期号列表
  static async getLotteryTerms(): Promise<number[]> {
    try {
      const res = await listTraditionalFootballLotteryTermNo({
        current: 1,
        pageSize: 10,
      });
      return res.success ? res.data?.list ?? [] : [];
    } catch (error) {
      console.error('获取足球彩票期号失败:', error);
      return [];
    }
  }

  // 获取足球比赛数据
  static async getCompetitionData(params: GetFootballDataParams): Promise<FootballCompetitionData> {
    try {
      const { date, currentPage, filterIndex, termNo } = params;
      
      const queryParams: ServerCommonLive.ListFootBallCompetitionCommandQuery = {
        current: currentPage,
        pageSize: 10,
        competitionType: this.filterConfig.competitionType[filterIndex],
        direction: 'asc',
        sort: this.filterConfig.sort[filterIndex],
      };

      // 足彩需要期号，其他需要日期
      if (filterIndex === 2) {
        queryParams.sfcTermNo = termNo;
      } else {
        queryParams.processDate = date;
      }

      const res = await listFootballCompetition(queryParams);
      
      if (res.success && res.data) {
        return {
          list: res.data.list ?? [],
          total: res.data.total ?? 0,
          query: res.data.query ?? {},
        };
      } else {
        throw new Error('获取足球数据失败');
      }
    } catch (error) {
      console.error('获取足球比赛数据失败:', error);
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
  static formatListItemForKey(item: ServerCommonLive.FootBallCompetition): FootballListItem {
    return {
      ...item,
      competitionId: item.id?.toString() || '',
    };
  }

  // 检查是否有更多数据
  static hasMoreData(currentData: FootballCompetitionData): boolean {
    return (currentData.list?.length ?? 0) < (currentData.total ?? 0);
  }
} 