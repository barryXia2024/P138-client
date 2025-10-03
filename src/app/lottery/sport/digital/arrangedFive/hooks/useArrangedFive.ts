import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {useArrangedFiveStore} from '../store/useArrangedFiveStore';
import {router} from 'expo-router';
import {ArrangedFiveTicket} from '../../core';
import {useBettingListStore} from '../slip/store/useBettingListStore';
import {
  ArrangedFivePlayEnum,
  ArrangedFiveSubPlayEnum,
  ArrangedFiveUIConfig,
} from '../constants';
import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

const useArrangedFive = () => {
  const [ticket, setTicket] = useState<ArrangedFiveTicket>();
  const {addTicket, lotteryData, setLotteryData} = useBettingListStore();

  const {
    buildTicket,
    clearSelection,
    setRules,
    positions,
    playMode,
    subPlayMode,
    setSubPlayMode,
    setPlayMode,
    reset,
  } = useArrangedFiveStore();
  const uiConfig = ArrangedFiveUIConfig;
  const playTabs = useMemo(
    () =>
      Object.entries(uiConfig).map(([k, v]) => ({
        key: k as ArrangedFivePlayEnum,
        label: v.label,
      })),
    [uiConfig],
  );
  const subTabs = useMemo(() => {
    const unit = uiConfig[playMode];
    if (!unit?.subTabs)
      return [] as {key: ArrangedFiveSubPlayEnum; label: string}[];
    return Object.entries(unit.subTabs).map(([k, v]) => ({
      key: k as ArrangedFiveSubPlayEnum,
      label: v.label,
    }));
  }, [uiConfig, playMode]);

  const activeUI = useMemo(() => {
    const unit = uiConfig[playMode];
    console.log(unit, ArrangedFiveUIConfig, playMode, '=====111======');
    if (!unit) return undefined;
    return unit.subTabs ? unit.subTabs[subPlayMode] : unit;
  }, [uiConfig, playMode, subPlayMode]);
  useEffect(() => {
    reset();

    return () => {
      reset();
    };
  }, []);

  // 初始化/切换时注入规则
  useEffect(() => {
    const unit = uiConfig[playMode];
    if (!unit) return;

    const rules = unit.subTabs
      ? unit.subTabs[subPlayMode!]?.positionRules
      : unit.positionRules;
    if (rules && rules.length > 0) {
      setRules?.(rules, {play: playMode, subPlay: subPlayMode});
    }

    return () => {
      clearSelection();
    };
  }, [playMode, subPlayMode, setRules, uiConfig, setSubPlayMode]);

  const handlePlayTabPress = useCallback(
    (key: ArrangedFivePlayEnum) => {
      setPlayMode(key);
      clearSelection();
      // 主玩法切换时，重置子玩法为第一个
      const unit = uiConfig[key];
      if (unit?.subTabs) {
        const firstSub: ArrangedFiveSubPlayEnum = Object.keys(
          unit.subTabs,
        )[0] as ArrangedFiveSubPlayEnum;
        setSubPlayMode(firstSub);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSubTabPress = useCallback((key: ArrangedFiveSubPlayEnum) => {
    setSubPlayMode(key);
    const unit = uiConfig[playMode];
    const rules = unit?.subTabs?.[key]?.positionRules;
    if (rules && rules.length > 0) {
      clearSelection();
      setRules?.(rules, {play: playMode, subPlay: key});
    }
  }, []);

  const canProceed = (ticket?.betCount ?? 0) > 0;
  const onNextStep = useCallback(() => {
    if (!canProceed) {
      Toast.show('请按规则完成选号');
      return;
    }
    console.log('onNextStep-ticket', ticket);
    addTicket(ticket as ArrangedFiveTicket);
    router.push({pathname: '/lottery/sport/digital/arrangedFive/slip'});
  }, [canProceed, addTicket, ticket]);

  const getNumbers = useCallback(
    (positionIndex: number) => {
      if (!activeUI) return [];
      const label = activeUI.labels?.[positionIndex];
      if (label?.numbers) return label.numbers;
      // 如果没有预定义numbers，根据numberRange生成
      const range = activeUI.positionRules?.[positionIndex]?.numberRange ?? 10;
      return Array.from({length: range}, (_, n) => n);
    },
    [activeUI],
  );
  const getDisplayValue = useCallback(
    (positionIndex: number, n: number) => {
      // 组三单式：重号显示为双数格式（00, 11, 22等）

      return n;
    },
    [playMode, subPlayMode],
  );

  const onToggle = useCallback(
    (positionIndex: number, n: number) => {
      // 正常选择逻辑
      useArrangedFiveStore.getState().toggleNumber(positionIndex, n);
    },
    [playMode, subPlayMode, positions],
  );
  const getSelected = (index: number) => {
    console.log('getSelected', playMode);
    if (playMode === ArrangedFivePlayEnum.DirectCombinationDuplex) {
      if (subPlayMode === ArrangedFiveSubPlayEnum.TwoSame) {
        const countMap = positions[index]?.reduce(
          (acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
          },
          {} as Record<number, number>,
        );
        if (!countMap) return [];

        const hasMoreThan2 = Object.values(countMap).some(count => count > 1);
        if (hasMoreThan2) {
          return positions[index] ?? [];
        } else {
          return [];
        }
      } else if (subPlayMode === ArrangedFiveSubPlayEnum.ThreeSame) {
        const countMap = positions[index]?.reduce(
          (acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
          },
          {} as Record<number, number>,
        );
        if (!countMap) return [];
        const hasMoreThan2 = Object.values(countMap).some(count => count > 1);
        if (hasMoreThan2) {
          const newPositions = positions[index]?.filter(
            item => countMap[item] !== 2,
          );

          return newPositions ?? [];
        } else {
          return [];
        }
      } else if (subPlayMode === ArrangedFiveSubPlayEnum.TwoGroupTwoSame) {
        const pos = positions[index] ?? [];
        const countMap: Record<number, number> = {};

        pos.forEach(num => {
          countMap[num] = (countMap[num] || 0) + 1;
        });

        const pairs = Object.entries(countMap)
          .filter(([_, c]) => c === 2)
          .map(([num]) => Number(num));

        if (pairs.length === 1) {
          // 只有一个数字是对子 → 只显示这个数字
          return [pairs[0]];
        } else if (pairs.length === 2) {
          // 有两个数字是对子 → 显示全部数字
          return pos;
        } else {
          // 没有符合二对的情况 → 不显示
          return [];
        }
      } else if (subPlayMode === ArrangedFiveSubPlayEnum.FourSame) {
        const pos = positions[index] ?? [];
        const countMap: Record<number, number> = {};

        pos.forEach(num => {
          countMap[num] = (countMap[num] || 0) + 1;
        });

        const result: number[] = [];

        Object.entries(countMap).forEach(([numStr, count]) => {
          const num = Number(numStr);
          if (count === 4) {
            // 出现四次 → 显示这个数字
            result.push(num);
          } else if (count === 1) {
            // 出现一次 → 显示
            result.push(num);
          }
          // 出现 2 或 3 次 → 不显示
        });

        // 如果所有数字都是 1 个，也会返回空数组吗？
        const allOnce = Object.values(countMap).every(c => c === 1);
        return allOnce ? [] : result;
      }
    }
    return positions[index] ?? [];
  };
  useEffect(() => {
    if (positions.length > 0) {
      console.log('useEffect buildTicket', positions);
      buildTicket().then(setTicket);
    }
  }, [buildTicket, positions]);
  useEffect(() => {
    getCharityLotteryData({lotteryName: LotteryName.ArrangedFive}).then(res => {
      console.log(res);
      setLotteryData(res.data as LotteryDataSource.CharityLotteryDataSource);
    });
    return () => {
      clearSelection();
    };
  }, []);
  return {
    playTabs,
    subTabs,
    activeUI,
    uiConfig,
    handlePlayTabPress,
    handleSubTabPress,
    canProceed,
    onNextStep,
    getNumbers,
    getDisplayValue,
    onToggle,
    ticket,
    lotteryData,
    setLotteryData,
    getSelected,
  };
};

export default useArrangedFive;
