/**
 * Sport Detail 模块状态类型定义
 */

/**
 * 直播状态
 */
export interface LiveState {
  /** 直播流 URL */
  liveUrl?: string;
  /** 直播流信息 */
  liveStream?: ServerCommonLive.LiveStream;
  /** 是否正在加载直播流 */
  loadingLiveStream: boolean;
  /** 直播流错误信息 */
  liveStreamError?: string;
}

/**
 * 比赛信息状态
 */
export interface CompetitionState {
  /** 比赛信息（篮球或足球） */
  liveInfo?: ServerCommonLive.BasketBallCompetition | ServerCommonLive.FootBallCompetition;
  /** 是否正在加载比赛信息 */
  loadingCompetition: boolean;
  /** 比赛信息错误 */
  competitionError?: string;
}

/**
 * Sport Detail 模块总状态
 */
export interface SportDetailState {
  /** 直播状态 */
  live: LiveState;
  /** 比赛信息状态 */
  competition: CompetitionState;
} 