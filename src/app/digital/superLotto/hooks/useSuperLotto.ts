import {useCallback, useEffect} from 'react';

import {
  getBetCount,
  superLottoQuickPickOne,
  superLottoQuickPickOneTicket,
} from '../utils';
import {router} from 'expo-router';
import {useDigitalBetStore} from '../../store/useDigitalBet';
import {PositionTicket, SuperLottoPlayEnum} from '../../types';
import dayjs from 'dayjs';
import {useSuperLottoStore} from '../useSuperLottoStore';

const useSuperLotto = () => {
  const {
    positions,
    playMode,
    subPlayMode,
    betCount,
    setPositions,
    setBetCount,
    clearAll,
    setPlayMode,
  } = useSuperLottoStore();
  const {addTicket} = useDigitalBetStore();

  /**
   * 验证构建票据
   * @param positions 选号
   * @returns 是否有效
   */
  const validateBuildTicket = useCallback(
    (positions: string[][]) => {
      const m = playMode || SuperLottoPlayEnum.NORMAL;
      if (m === SuperLottoPlayEnum.NORMAL) {
        if ((positions[0]?.length ?? 0) < 5) {
          Toast.show('前区至少选5个');
          return false;
        }
        if ((positions[1]?.length ?? 0) < 2) {
          Toast.show('后区至少选2个');
          return false;
        }
      } else {
        const frontDan = positions[0] ?? [];
        const frontTuo = positions[1] ?? [];
        const backDan = positions[2] ?? [];
        const backTuo = positions[3] ?? [];
        if (frontDan.length < 1 || frontDan.length > 4) {
          Toast.show('前区胆码需要选择1-4个');
          return false;
        }
        if (frontTuo.length < 2) {
          Toast.show('前区拖码至少选择2个');
          return false;
        }
        if (backDan.length > 1) {
          Toast.show('后区胆码最多选择1个');
          return false;
        }
        if (backTuo.length < 2) {
          Toast.show('后区拖码至少选择2个');
          return false;
        }
        // 互斥校验
        if (frontDan.some(n => frontTuo.includes(n))) {
          Toast.show('前区胆码与拖码不能相同');
          return false;
        }
        if (backDan.some(n => backTuo.includes(n))) {
          Toast.show('后区胆码与拖码不能相同');
          return false;
        }
      }
      return true;
    },
    [playMode],
  );

  /**
   * 验证选号
   * @param positionIndex 位置索引
   * @param currentSelection 当前选号
   * @returns
   */
  const validateSLPositions = useCallback(
    (positionIndex: number, currentSelection: string[]) => {
      const m = playMode || SuperLottoPlayEnum.NORMAL;
      let max = Infinity;
      if (m === SuperLottoPlayEnum.NORMAL) {
        max = positionIndex === 0 ? 35 : positionIndex === 1 ? 12 : Infinity;
      } else if (m === SuperLottoPlayEnum.DANTUO) {
        if (positionIndex === 0)
          max = 4; // 前胆
        else if (positionIndex === 1)
          max = 35; // 前拖
        else if (positionIndex === 2)
          max = 1; // 后胆
        else if (positionIndex === 3) max = 12; // 后拖
      }
      if (currentSelection.length >= max) {
        if (positionIndex === 0) {
          Toast.show('红球胆码最多可选4个');
        } else if (positionIndex === 1) {
          Toast.show('红球拖码最多可选35个');
        } else if (positionIndex === 2) {
          Toast.show('蓝球胆码最多可选12个');
        } else if (positionIndex === 3) {
          Toast.show('蓝球拖码最多可选12个');
        }

        return false;
      }
      return true;
    },
    [playMode],
  );

  /**
   * 验证胆拖
   * @param positionIndex 位置索引
   * @param newPositions 选号
   * @param number 当前选号
   * @returns 是否有效
   */
  const validateSDanTuo = useCallback(
    (positionIndex: number, newPositions: string[][], number: string) => {
      if (playMode === SuperLottoPlayEnum.DANTUO) {
        let counterpartIndex = -1;
        if (positionIndex === 0) counterpartIndex = 1; // 前胆 vs 前拖
        if (positionIndex === 1) counterpartIndex = 0;
        if (positionIndex === 2) counterpartIndex = 3; // 后胆 vs 后拖
        if (positionIndex === 3) counterpartIndex = 2;
        if (counterpartIndex >= 0) {
          const counterpart = newPositions[counterpartIndex] ?? [];
          if (counterpart.includes(number)) {
            if (positionIndex === 0) {
              Toast.show('此球位红球托码');
              return false;
            } else if (positionIndex === 1) {
              Toast.show('此球位红球胆码');
              return false;
            } else if (positionIndex === 2) {
              Toast.show('此球位蓝球胆码');
              return false;
            } else if (positionIndex === 3) {
              Toast.show('此球位蓝球托码');
              return false;
            }
          }
        }
      }
      return true;
    },
    [playMode],
  );

  /**
   * 切换选号
   * @param positionIndex 位置索引
   * @param number 当前选号
   */
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

      const isValid = validateSLPositions(positionIndex, currentSelection);
      if (!isValid) {
        return;
      }
      const isValidDanTuo = validateSDanTuo(
        positionIndex,
        newPositions,
        number,
      );
      if (!isValidDanTuo) {
        return;
      }
      newPositions[positionIndex] = [...currentSelection, number];

      setPositions(newPositions);
    },

    [positions, setPositions, validateSDanTuo, validateSLPositions],
  );

  /**
   * 下一步
   */
  const handleNextStep = useCallback(() => {
  
    const isValid = validateBuildTicket(positions);
    if (!isValid) {
      return;
    }
    const ticket: PositionTicket = {
      betId: dayjs().unix().toString(),
      lotteryName: 'SevenStar',
      betAmount: betCount * 2,
      betCount: betCount,
      positions: positions,
      playMode,
      subPlayMode,
    };

    addTicket(ticket);

    router.push('/digital/slip');
  }, [addTicket, betCount, playMode, positions, subPlayMode, validateBuildTicket]);

  /**
   * 机选一注
   */
  const quickPickOne = useCallback(() => {
    const numbers = superLottoQuickPickOne(playMode);

    setPositions(numbers);
  }, [setPositions, playMode]);

  /**
   * 机选五注
   */
  const quickPickFive = useCallback(() => {
    const numbers = superLottoQuickPickOneTicket(playMode);
    addTicket(numbers);
    const numbers2 = superLottoQuickPickOneTicket(playMode);
    addTicket(numbers2);
    const numbers3 = superLottoQuickPickOneTicket(playMode);
    addTicket(numbers3);
    const numbers4 = superLottoQuickPickOneTicket(playMode);
    addTicket(numbers4);
    const numbers5 = superLottoQuickPickOneTicket(playMode);
    addTicket(numbers5);
    router.push('/digital/slip');
  }, [addTicket, playMode]);

  /**
   * 切换玩法
   * @param k 玩法
   */
  const handleTabPress = (k: SuperLottoPlayEnum) => {
    setPlayMode(k);
    clearAll();
  };

  /**
   * 清空选号
   */
  const onClearSelection = useCallback(() => {
    clearAll();
  }, [clearAll]);

  // 监听positions变化，计算投注数量
  useEffect(() => {
    setBetCount(getBetCount(positions, playMode));
  }, [positions, setBetCount, playMode]);

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);
  return {
    toggleNumber,
    handleTabPress,
    handleNextStep,
    quickPickOne,
    betCount,
    onClearSelection,
    quickPickFive,
  };
};

export default useSuperLotto;
