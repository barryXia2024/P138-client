import { generateDates } from 'src/modules/live/utils';
import { FootballListModel } from './FootballListModel';
import { BasketballListModel } from './BasketballListModel';
import { CompetitionType } from './types';

export class ListManager {
  // 生成日期列表
  static generateDates() {
    return generateDates();
  }

  // 获取彩票期号（只有足球需要）
  static async getLotteryTerms(): Promise<number[]> {
    return FootballListModel.getLotteryTerms();
  }

  // 根据比赛类型获取对应的 Model
  static getModel(competitionType: CompetitionType) {
    switch (competitionType) {
      case 'JC':
      case 'BD':
      case 'SFC':
        return FootballListModel;
      case 'LQ':
        return BasketballListModel;
      default:
        throw new Error('不支持的比赛类型');
    }
  }

  // 获取筛选器标签
  static getFilterLabels(competitionType: CompetitionType): string[] {
    switch (competitionType) {
      case 'JC':
      case 'BD':
      case 'SFC':
        return FootballListModel.getFilterLabels();
      case 'LQ':
        return BasketballListModel.getFilterLabels();
      default:
        return [];
    }
  }

  // 获取比赛类型字符串
  static getCompetitionTypeString(competitionType: CompetitionType, filterIndex: number): CompetitionType {
    switch (competitionType) {
      case 'JC':
      case 'BD':
      case 'SFC':
        return FootballListModel.getCompetitionType(filterIndex);
      case 'LQ':
        return BasketballListModel.getCompetitionType(filterIndex);
      default:
        return 'LQ';
    }
  }

  // 获取今日日期
  static getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD 格式
  }

  // 格式化日期
  static formatDate(date: string): string {
    return date; // 已经是 YYYY-MM-DD 格式
  }
} 