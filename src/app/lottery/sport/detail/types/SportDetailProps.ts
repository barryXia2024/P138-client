/**
 * Sport Detail 模块组件属性类型定义
 */

import {ViewStyle} from 'react-native';

/**
 * 主页面组件属性
 */
export interface SportDetailProps {
  /** 路由参数 */
  params: {
    liveStreamID?: string;
    competitionId?: string;
    competitionType?: string;
  };
}

/**
 * 直播播放器组件属性
 */
export interface LivePlayerProps {
  /** 直播流 URL */
  liveUrl: string;
  /** 退出播放器回调 */
  onExit: () => void;
  /** 是否为主播模式 */
  isAnchor: boolean;
}

/**
 * 比赛信息组件属性
 */
export interface CompetitionInfoProps {
  /** 比赛信息 */
  liveInfo?: ServerCommonLive.BasketBallCompetition | ServerCommonLive.FootBallCompetition;
  /** 直播流信息 */
  liveStream?: ServerCommonLive.LiveStream;
  /** 比赛类型 */
  competitionType: ServerCommonLive.CompetitionType;
  /** 样式 */
  className?: string;
  /** 内联样式 */
  style?: ViewStyle;
} 