import {useCallback, useMemo} from 'react';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {useLotteryEventStore} from 'src/modules/lottery/store/event';
import {LOTTERY_CONFIG, RENDER_CONFIG} from '../constants';
import {filterHandicapDtos} from '../utils/oddsUtils';
import {FootballPlayMoreHookReturn, RenderConfigItem} from '../types';

export const useFootballPlayMore = (): FootballPlayMoreHookReturn => {
  const {selectedMatches, setSelectedMatches} = useBetInfoStore();
  const {
    footballPlayMore: {competitionInfo, isVisible, isScoreDialogVisible},
    setFootballPlayMore,
  } = useLotteryEventStore();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  const competitionId = competitionInfo?.competitionId?.toString();
  const lotteryName = lotteryInfo?.lotteryName;
  const currentConfig = LOTTERY_CONFIG[lotteryName];

  // 关闭弹窗
  const handleClose = useCallback(() => {
    setFootballPlayMore({
      competitionInfo: null,
      isVisible: false,
      isScoreDialogVisible: false,
    });
  }, [setFootballPlayMore]);

  // 确认选择
  const handleConfirm = useCallback(
    (selectedOdds: string[]) => {
      if (!competitionId || selectedOdds.length === 0) {
        handleClose();
        return;
      }

      setSelectedMatches({
        ...selectedMatches,
        [competitionId]: [...selectedOdds],
      });
      handleClose();
    },
    [competitionId, selectedMatches, setSelectedMatches, handleClose],
  );

  // 获取过滤后的赔率数据
  const filteredHandicapDtos = useMemo(() => {
    if (!competitionInfo || !currentConfig) return [];
    return filterHandicapDtos(competitionInfo, currentConfig.playKey);
  }, [competitionInfo, currentConfig]);

  // 获取渲染配置
  const renderConfig = useMemo((): RenderConfigItem[] | null => {
    if (!competitionInfo || !currentConfig) return null;

    const containers: RenderConfigItem[] = [];
    for (let i = 0; i < RENDER_CONFIG.oddsRowCount; i++) {
      const handicapDto = competitionInfo.handicapDtos?.[i];
      if (!handicapDto) continue;

      const renderType = RENDER_CONFIG.simpleRenderIndices.includes(i as 0 | 1)
        ? 'simple'
        : 'complex';
      const shouldRender =
        renderType === currentConfig.renderType ||
        (currentConfig.renderType === 'complex' && renderType === 'simple');

      if (shouldRender) {
        containers.push({
          index: i,
          handicapDto,
          renderType,
        });
      }
    }

    return containers;
  }, [competitionInfo, currentConfig]);

  return {
    competitionInfo,
    isVisible,
    isScoreDialogVisible,
    competitionId,
    lotteryName,
    currentConfig,
    selectedMatches,
    handleClose,
    handleConfirm,
    filteredHandicapDtos,
    renderConfig,
  };
}; 