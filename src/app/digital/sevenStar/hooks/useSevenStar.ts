import {useCallback, useEffect} from 'react';
import {useSevenStarStore} from '../useSevenStarStore';
import {getBetCount, sevenStarQuickPickOne} from '../utils';
import {router} from 'expo-router';
import {useDigitalBetStore} from '../../store/useDigitalBet';
import {
  PositionTicket,
  SevenStarPlayEnum,
  SevenStarSubPlayEnum,
} from '../../types';
import dayjs from 'dayjs';

const useSevenStar = () => {
  const {positions, betCount, setPositions, setBetCount, clearAll} = useSevenStarStore();
  const {addTicket} = useDigitalBetStore();

  const toggleNumber = useCallback(
    (positionIndex: number, number: string) => {
      const newPositions = [...positions];
      const currentSelection = newPositions[positionIndex] ?? [];

      // 取消选择
      if (currentSelection.includes(number)) {
        newPositions[positionIndex] = currentSelection.filter(
          n => n !== number,
        );
        setPositions(newPositions);
        return;
      }

      newPositions[positionIndex] = [...currentSelection, number];

      setPositions(newPositions);
    },

    [positions, setPositions],
  );

  const handleNextStep = useCallback(() => {
    if (betCount === 0) {
      Toast.show('每一位至少选择一个号码');
      return;
    }
    const ticket: PositionTicket = {
      betId: dayjs().unix().toString(),
      lotteryName: 'SevenStar',
      betAmount: betCount * 2,
      betCount: betCount,
      positions: positions,
      playMode: SevenStarPlayEnum.NORMAL,
      subPlayMode: SevenStarSubPlayEnum.DIRECT_SELECTION,
    };

    addTicket(ticket);

    router.push('/digital/slip');
  }, [addTicket, betCount, positions]);

  const quickPickOne = useCallback(() => {
    const numbers = sevenStarQuickPickOne();

    setPositions(numbers);
  }, [setPositions]);

  const onClearSelection = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // 监听positions变化，计算投注数量
  useEffect(() => {
    setBetCount(getBetCount(positions));
  }, [positions, setBetCount]);

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);
  return {
    toggleNumber,

    handleNextStep,
    quickPickOne,
    betCount,
    onClearSelection,
  };
};

export default useSevenStar;
