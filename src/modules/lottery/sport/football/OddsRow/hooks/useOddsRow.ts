import {useMemo} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useBetInfoStore} from 'src/modules/lottery/store';
import {parseOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {BETTING_TYPE_SETTINGS} from '../constants';

export const useOddsRow = (competition: LotteryDataSource.MatchInfo) => {
  const {selectedMatches, betPlayActiveTab} = useBetInfoStore();

  // 获取当前投注类型配置
  const currentBettingConfig = useMemo(() => {
    return (
      BETTING_TYPE_SETTINGS[
        betPlayActiveTab as LotteryCommon.FootballLotteryBettingType
      ] || BETTING_TYPE_SETTINGS.default
    );
  }, [betPlayActiveTab]);

  // 获取赔率数据
  const handicapDtos = useMemo(() => {
    if (!competition.handicapDtos) return [];

    const {index, sliceCount} = currentBettingConfig;
    return sliceCount > 1
      ? competition.handicapDtos.slice(0, sliceCount)
      : [competition.handicapDtos[index]];
  }, [competition.handicapDtos, currentBettingConfig]);

  // 获取样式
  const oddsCellStyle = useMemo((): StyleProp<ViewStyle> => {
    return {
      width: currentBettingConfig.width as any,
      marginLeft: -1,
      marginTop: -1,
    };
  }, [currentBettingConfig.width]);

  // 获取选中项信息
  const getSelectedInfo = (oddsCellKey: string) => {
    const info = parseOddsCellKey(oddsCellKey);
    return info.betItem;
  };

  // 获取选中项文本
  const selectedText = useMemo(() => {
    const selectedItems = selectedMatches[competition.competitionId];
    if (!selectedItems?.length) return '';

    return selectedItems.map(getSelectedInfo).join(' ');
  }, [selectedMatches, competition.competitionId]);

  // 判断是否有选中项
  const hasSelectedItems = useMemo(() => {
    return (selectedMatches[competition.competitionId]?.length || 0) > 0;
  }, [selectedMatches, competition.competitionId]);

  return {
    handicapDtos,
    oddsCellStyle,
    getSelectedInfo,
    selectedText,
    hasSelectedItems,
    betPlayActiveTab,
    currentBettingConfig,
  };
};
