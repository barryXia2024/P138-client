import {
  listSportsStatistics,
  listSportsDrawAnnouncement,
} from 'src/api/interface/lottery-lottery-type-draw';

import dayjs from 'dayjs';

export class DrawModel {
  /**
   * 获取开奖统计信息
   * @param params 开奖统计参数
   * @returns 开奖统计响应
   */
  static async getDrawStatistics(
    params: LotteryDrawAnnoumcememt.ListSportsStatisticsCommandQuery,
  ) {
    try {
      const response = await listSportsStatistics(params);
      return response;
    } catch (error) {
      console.error('获取开奖统计失败:', error);
      throw error;
    }
  }

  /**
   * 获取开奖公告
   * @param params 开奖公告参数
   * @returns 开奖公告响应
   */
  static async getDrawAnnouncement(
    params: LotteryDrawAnnoumcememt.ListSportsDrawAnnouncementCommandQuery,
  ) {
    try {
      const response = await listSportsDrawAnnouncement(params);
      return response;
    } catch (error) {
      console.error('获取开奖公告失败:', error);
      throw error;
    }
  }

  /**
   * 获取足球开奖数据
   * @returns 足球开奖数据
   */
  static async getFootballDrawData(): Promise<
    LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null
  > {
    try {
      // 获取统计信息
      const statisticsRes = await this.getDrawStatistics({
        lotteryName: 'FootballLottery',
      });

      if (
        !statisticsRes.success ||
        !statisticsRes.data ||
        statisticsRes.data.length === 0
      ) {
        return null;
      }

      // 获取第一个分组的数据
      const firstGroup = statisticsRes.data[0];
      const processDate = dayjs(firstGroup.processDate).format('YYYY-MM-DD');

      // 获取开奖公告
      const announcementRes = await this.getDrawAnnouncement({
        lotteryName: 'FootballLottery',
        processDate,
      });

      return announcementRes.success ? announcementRes.data || null : null;
    } catch (error) {
      console.error('获取足球开奖数据失败:', error);
      return null;
    }
  }

  /**
   * 获取篮球开奖数据
   * @returns 篮球开奖数据
   */
  static async getBasketballDrawData(): Promise<
    LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null
  > {
    try {
      // 获取统计信息
      const statisticsRes = await this.getDrawStatistics({
        lotteryName: 'BasketballLottery',
      });

      if (
        !statisticsRes.success ||
        !statisticsRes.data ||
        statisticsRes.data.length === 0
      ) {
        return null;
      }

      // 获取第一个分组的数据
      const firstGroup = statisticsRes.data[0];
      const processDate = dayjs(firstGroup.processDate).format('YYYY-MM-DD');

      // 获取开奖公告
      const announcementRes = await this.getDrawAnnouncement({
        lotteryName: 'BasketballLottery',
        processDate,
      });

      return announcementRes.success ? announcementRes.data || null : null;
    } catch (error) {
      console.error('获取篮球开奖数据失败:', error);
      return null;
    }
  }
 /**
   * 获取篮球开奖数据
   * @returns 篮球开奖数据
   */
 static async getBeijingSingleMatchDrawData(): Promise<
 LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null
> {
 try {
   // 获取统计信息
   const statisticsRes = await this.getDrawStatistics({
     lotteryName: 'BeijingSingleMatch',
   });

   if (
     !statisticsRes.success ||
     !statisticsRes.data ||
     statisticsRes.data.length === 0
   ) {
     return null;
   }

   // 获取第一个分组的数据
   const firstGroup = statisticsRes.data[0];
   const processDate = dayjs(firstGroup.processDate).format('YYYY-MM-DD');

   // 获取开奖公告
   const announcementRes = await this.getDrawAnnouncement({
     lotteryName: 'BeijingSingleMatch',
     processDate,
   });

   return announcementRes.success ? announcementRes.data || null : null;
 } catch (error) {
   console.error('获取北京单场开奖数据失败:', error);
   return null;
 }
}

  /**
   * 获取所有开奖数据
   * @returns 所有开奖数据
   */
  static async getAllDrawData(): Promise<
    Record<Extract<CoreCommonEnum.LotteryName, 'FootballLottery' | 'BasketballLottery' | 'BeijingSingleMatch'>, LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null>
  > {
    try {
      const [footballData, basketballData, beijingSingleMatchData] = await Promise.all([
        this.getFootballDrawData(),
        this.getBasketballDrawData(),
        this.getBeijingSingleMatchDrawData(),
      ]);

      return {
        FootballLottery: footballData,
        BasketballLottery: basketballData,
        BeijingSingleMatch: beijingSingleMatchData,
      };
    } catch (error) {
      console.error('获取所有开奖数据失败:', error);
      return {
        FootballLottery: null,
        BasketballLottery: null,
        BeijingSingleMatch: null,
      };
    }
  }

  /**
   * 格式化开奖时间
   * @param termNo 期号
   * @returns 格式化的时间
   */
  static formatDrawTime(termNo: string): string {
    try {
      return dayjs(termNo).format('YYYY-MM-DD');
    } catch (error) {
      return termNo;
    }
  }

  /**
   * 检查开奖数据是否有效
   * @param drawData 开奖数据
   * @returns 是否有效
   */
  static isValidDrawData(
    drawData: LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null,
  ): boolean {
    return (
      drawData !== null && drawData.length > 0 && drawData[0] !== undefined
    );
  }

  /**
   * 获取开奖结果显示文本
   * @param drawData 开奖数据
   * @returns 显示文本
   */
  static getDrawDisplayText(
    drawData: LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null,
  ): string {
    if (!this.isValidDrawData(drawData)) {
      return '暂无开奖数据';
    }

    const firstDraw = drawData![0];
    return `${firstDraw.home} ${firstDraw.matchScore} ${firstDraw.away}`;
  }
}
