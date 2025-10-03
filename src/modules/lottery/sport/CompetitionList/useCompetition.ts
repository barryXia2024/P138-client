import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  useBetInfoStore,
  useLotteryEventStore,
  useLotteryInfoStore,
  useSportsCompetitionFilterStore,
} from '../../store';
import {filterMatches} from '../../utils/lottery';
import { getTimeSportsLotteryData } from 'src/api/interface/lottery-lottery-type-data';
import dayjs from 'dayjs';

export const useCompetition = () => {
  const {resetStore, setMatchData, setMatchDataBatch} = useBetInfoStore();
  const {
    selectedLeagues,
    selectedOddsRanges,
    onlyWinDrawLose,
    resetSportsCompetitionFilterStore,
  } = useSportsCompetitionFilterStore();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {filterDialog, setFilterDialog} = useLotteryEventStore();
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  // 切换折叠状态
  const toggleSection = useCallback((title: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  const filteredData = useMemo(() => {
    return filterMatches(
      filterDialog.matchData,
      selectedLeagues,
      selectedOddsRanges,
      onlyWinDrawLose,
    );
  }, [
    filterDialog.matchData,
    selectedLeagues,
    selectedOddsRanges,
    onlyWinDrawLose,
  ]);

  // 获取彩票数据并存储到zustand store
  useEffect(() => {
    setIsLoading(true);
    getTimeSportsLotteryData({
      lotteryName: lotteryInfo?.lotteryName || 'FootballLottery',
    })
      .then(res => {
        if (res.success) {
    
          
          // 性能优化：批量处理比赛数据
          if (res.data) {
            setFilterDialog({
              isVisible: false,
              matchData: res.data.map(item => ({
                ...item,
                timeSportsLottery: item.timeSportsLottery?.filter(match =>dayjs(match.competitionTime).isAfter(dayjs())) || [],
              }))|| [],
              lotteryName: lotteryInfo?.lotteryName,
            });
            setIsLoading(false);
            // 使用 Map 进行去重，避免重复的比赛ID
            const matchDataMap = new Map<string, LotteryDataSource.MatchInfo>();
            
            // 扁平化处理，避免嵌套循环
            const allMatches = res.data.flatMap(group => 
              group.timeSportsLottery || []
            );
            
            // 批量收集比赛数据
            allMatches.forEach(match => {
              const matchId = match.competitionId?.toString();
              if (matchId && !matchDataMap.has(matchId)) {
                matchDataMap.set(matchId, match);
              }
            });
            
            // 批量更新 store，减少渲染次数
            const matchDataObject = Object.fromEntries(matchDataMap);
            
            // 使用批量更新，一次性更新所有比赛数据
            setMatchDataBatch(matchDataObject);
          }
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });

    return () => {
      resetStore(); // 重置状态
      resetSportsCompetitionFilterStore();
    };
  }, [lotteryInfo, resetStore, setIsLoading, setFilterDialog, setMatchDataBatch, resetSportsCompetitionFilterStore]);

  // 根据筛选条件选择分组方式
  const sections = useMemo(() => {
    return filteredData.map(group => ({
      title: group.date, // 日期
      totalMatches: group.timeSportsLottery?.length ?? 0,
      data: collapsedSections[group.date]
        ? [] // 折叠状态下隐藏数据
        : group.timeSportsLottery.sort((a, b) => {
            // 提取数字部分进行比较
            const numA = parseInt(a.matchNum.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.matchNum.match(/\d+/)?.[0] || '0');
            return numA - numB;
          }) || [],
    }));
  }, [collapsedSections, filteredData]);
  return {
    sections,
    isLoading,
    toggleSection,
    collapsedSections,
  };
};
