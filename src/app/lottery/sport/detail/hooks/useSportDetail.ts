/**
 * Sport Detail 模块 Hook
 */

import {useCallback, useState, useEffect} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {getLiveStream, startLiveStream} from 'src/api/interface/competition-live-stream';
import {getBasketballCompetitionLive} from 'src/api/interface/competition-basketball';
import {getFootballCompetitionLive} from 'src/api/interface/competition-football';
import {useLiveStore} from 'src/store';
import {useAnchorStore} from 'src/app/live/store/anchorStore';
import {SportDetailState} from '../types';

/**
 * Sport Detail 模块的 Hook
 */
export const useSportDetail = () => {
  const {liveStreamID, competitionType} = useLocalSearchParams();
  const {currentMatch} = useLiveStore();


  // 状态管理
  const [state, setState] = useState<SportDetailState>({
    live: {
      liveUrl: undefined,
      liveStream: undefined,
      loadingLiveStream: false,
      liveStreamError: undefined,
    },
    competition: {
      liveInfo: undefined,
      loadingCompetition: false,
      competitionError: undefined,
    },
  });

  /**
   * 获取直播流信息
   */
  const fetchLiveStream = useCallback(async () => {
    if (!liveStreamID) return;

    setState(prev => ({
      ...prev,
      live: {...prev.live, loadingLiveStream: true, liveStreamError: undefined},
    }));

    try {
      const response = await getLiveStream({liveStreamID: liveStreamID as string});
      setState(prev => ({
        ...prev,
        live: {
          ...prev.live,
          liveStream: response.data,
          loadingLiveStream: false,
        },
      }));
    } catch (error) {
      console.error('获取直播流信息失败:', error);
      setState(prev => ({
        ...prev,
        live: {
          ...prev.live,
          loadingLiveStream: false,
          liveStreamError: '获取直播流信息失败',
        },
      }));
    }
  }, [liveStreamID]);

  /**
   * 获取篮球比赛信息
   */
  const fetchBasketballCompetition = useCallback(async () => {
    if (!currentMatch) return;

    setState(prev => ({
      ...prev,
      competition: {...prev.competition, loadingCompetition: true, competitionError: undefined},
    }));

    try {
      const response = await getBasketballCompetitionLive({
        competitionID: currentMatch.competitionId,
      });
      setState(prev => ({
        ...prev,
        competition: {
          ...prev.competition,
          liveInfo: response.data,
          loadingCompetition: false,
        },
      }));
    } catch (error) {
      console.error('获取篮球比赛信息失败:', error);
      setState(prev => ({
        ...prev,
        competition: {
          ...prev.competition,
          loadingCompetition: false,
          competitionError: '获取篮球比赛信息失败',
        },
      }));
    }
  }, [currentMatch]);

  /**
   * 获取足球比赛信息
   */
  const fetchFootballCompetition = useCallback(async () => {
    if (!currentMatch) return;

    setState(prev => ({
      ...prev,
      competition: {...prev.competition, loadingCompetition: true, competitionError: undefined},
    }));

    try {
      const response = await getFootballCompetitionLive(
        {
          competitionID: currentMatch.competitionId,
        },
        {
          competitionType: competitionType as ServerCommonLive.CompetitionType,
        },
      );
      setState(prev => ({
        ...prev,
        competition: {
          ...prev.competition,
          liveInfo: response.data,
          loadingCompetition: false,
        },
      }));
    } catch (error) {
      console.error('获取足球比赛信息失败:', error);
      setState(prev => ({
        ...prev,
        competition: {
          ...prev.competition,
          loadingCompetition: false,
          competitionError: '获取足球比赛信息失败',
        },
      }));
    }
  }, [currentMatch, competitionType]);

  /**
   * 根据比赛类型获取比赛信息
   */
  const fetchCompetitionInfo = useCallback(() => {
    if (!currentMatch) return;

    // LQ 是篮球，其他是足球
    if (competitionType === 'LQ') {
      fetchBasketballCompetition();
    } else {
      fetchFootballCompetition();
    }
  }, [currentMatch, competitionType, fetchBasketballCompetition, fetchFootballCompetition]);

  /**
   * 主播开始直播
   */
  const startAnchorLive = useCallback(async () => {
    if (!liveStreamID) return;

    try {
      const response = await startLiveStream({liveStreamID: liveStreamID as string});
      // 根据返回结果判断是否成功启动直播
      if (response.data?.liveStreamID) {
        // StartLiveStreamResult 只包含 liveStreamID，需要从 liveStream 中获取 URL
        if (state.live.liveStream?.liveUrl) {
          const liveUrl = state.live.liveStream.liveUrl.h5 || state.live.liveStream.liveUrl.m3u8;
          setState(prev => ({
            ...prev,
            live: {...prev.live, liveUrl},
          }));
        }
      }
    } catch (error) {
      console.error('主播开始直播失败:', error);
    }
  }, [liveStreamID, state.live.liveStream]);

  /**
   * 观众观看直播
   */
  const watchLive = useCallback(() => {
    if (state.live.liveStream?.liveUrl) {
      const liveUrl = state.live.liveStream.liveUrl.h5 || state.live.liveStream.liveUrl.m3u8;
      setState(prev => ({
        ...prev,
        live: {...prev.live, liveUrl},
      }));
    }
  }, [state.live.liveStream]);

  /**
   * 退出直播
   */
  const exitLive = useCallback(() => {
    setState(prev => ({
      ...prev,
      live: {...prev.live, liveUrl: undefined},
    }));
  }, []);

  // 初始化数据
  useEffect(() => {
    fetchLiveStream();
  }, [fetchLiveStream]);

  useEffect(() => {
    fetchCompetitionInfo();
  }, [fetchCompetitionInfo]);

  return {
    // 状态
    state,
    
    // 方法
    startAnchorLive,
    watchLive,
    exitLive,
  };
}; 