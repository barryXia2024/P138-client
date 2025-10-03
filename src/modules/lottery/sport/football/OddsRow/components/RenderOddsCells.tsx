import React, {useCallback, useRef, useEffect} from 'react';
import OddsCell from '../../oddsCell';
import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {useBetInfoStore} from 'src/modules/lottery/store';
import {RenderOddsCellsProps} from '../types';
import {BETTING_TYPE_SETTINGS} from '../constants';

/**
 * 渲染赔率单元格组件
 * 根据赔率数据渲染对应的投注选项
 */
const RenderOddsCells: React.FC<RenderOddsCellsProps> = ({
  handicapDto,
  competition,
  oddsCellStyle,
  toggleSelection,
  selectedMatches,
}) => {
  const {betPlayActiveTab} = useBetInfoStore();

  // 使用ref来保存最新的betPlayActiveTab值解决缓存问题
  const betPlayActiveTabRef = useRef(betPlayActiveTab);

  // 更新ref值
  useEffect(() => {
    betPlayActiveTabRef.current = betPlayActiveTab;
  }, [betPlayActiveTab]);

  const handleToggleSelection = useCallback(
    (oddsCellKey: string) => {
      // 使用ref中的最新值
      const currentBetPlayActiveTab =
        betPlayActiveTabRef.current as LotteryCommon.FootballLotteryBettingType;
      const maxCount = BETTING_TYPE_SETTINGS[currentBetPlayActiveTab].maxCount;

      return toggleSelection(
        competition.competitionId.toString(),
        oddsCellKey,
        maxCount,
      );
    },
    [competition.competitionId, toggleSelection],
  );

  if (!handicapDto?.competitionOddsDtos) return null;

  return (
    <>
      {handicapDto.competitionOddsDtos.map(competitionOddsDtos => {
        const oddsCellKey = generateOddsCellKey(
          competition.competitionId,
          handicapDto,
          competitionOddsDtos,
        );

        const isSelected =
          selectedMatches[competition.competitionId]?.includes(oddsCellKey);

        return (
          <OddsCell
            key={oddsCellKey}
            competitionOddsDtos={competitionOddsDtos}
            handicapDtos={handicapDto}
            toggleSelection={() => handleToggleSelection(oddsCellKey)}
            style={oddsCellStyle}
            isSelected={isSelected}
          />
        );
      })}
    </>
  );
};

export default React.memo(RenderOddsCells);
