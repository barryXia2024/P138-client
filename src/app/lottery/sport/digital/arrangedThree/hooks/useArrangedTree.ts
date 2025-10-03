import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {
  ArrangedThreePlayEnum,
  ArrangedThreeSubPlayEnum,
  ArrangedThreeUIConfig,
} from '../constants';
import {useArrangedThreeStore} from '../store/useArrangedThreeStore';
import {router} from 'expo-router';
import {DigitalTicket, PositionTicket} from '../../core';
import {useBettingListStore} from '../slip/store/useBettingListStore';
import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

const useArrangedTree = () => {
  const [ticket, setTicket] = useState<PositionTicket>();
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
    setShowMissNumbers,
    reset,
  } = useArrangedThreeStore();
  useEffect(() => {
    reset();

    return () => {
      reset();
    };
  }, []);
  const uiConfig = ArrangedThreeUIConfig;
  const playTabs = useMemo(
    () =>
      Object.entries(uiConfig).map(([k, v]) => ({
        key: k as ArrangedThreePlayEnum,
        label: v.label,
      })),
    [uiConfig],
  );
  const subTabs = useMemo(() => {
    const unit = uiConfig[playMode];
    if (!unit?.subTabs)
      return [] as {key: ArrangedThreeSubPlayEnum; label: string}[];
    return Object.entries(unit.subTabs).map(([k, v]) => ({
      key: k as ArrangedThreeSubPlayEnum,
      label: v.label,
    }));
  }, [uiConfig, playMode]);
  console.log('subTabs=================', subTabs);

  const activeUI = useMemo(() => {
    const unit = uiConfig[playMode];
    if (!unit) return undefined;
    return unit.subTabs ? unit.subTabs[subPlayMode] : unit;
  }, [uiConfig, playMode, subPlayMode]);

  // 初始化/切换时注入规则
  useEffect(() => {
    const unit = uiConfig[playMode];
    setShowMissNumbers(false);
    if (!unit) return;
    const firstSub = unit.subTabs ? Object.keys(unit.subTabs)[0] : undefined;
    const targetSub = unit.subTabs ? subPlayMode || firstSub : undefined;
    const rules = unit.subTabs
      ? unit.subTabs[targetSub!]?.positionRules
      : unit.positionRules;
    if (rules && rules.length > 0) {
      setRules?.(rules, {play: playMode, subPlay: targetSub});
    }
    if (targetSub && targetSub !== subPlayMode) setSubPlayMode(targetSub);
  }, [playMode, subPlayMode, setRules, uiConfig, setSubPlayMode]);

  const handlePlayTabPress = useCallback(
    (key: ArrangedThreePlayEnum) => {
      console.log('handlePlayTabPress', key);

      setPlayMode(key);
      clearSelection();
      // 主玩法切换时，重置子玩法为第一个
      const unit = uiConfig[key];
      if (unit?.subTabs) {
        const firstSub: ArrangedThreeSubPlayEnum = Object.keys(
          unit.subTabs,
        )[0] as ArrangedThreeSubPlayEnum;
        setSubPlayMode(firstSub);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSubTabPress = useCallback(
    (key: ArrangedThreeSubPlayEnum) => {
      setSubPlayMode(key);
      const unit = uiConfig[playMode];
      const rules = unit?.subTabs?.[key]?.positionRules;
      if (rules && rules.length > 0) {
        clearSelection();
        setRules?.(rules, {play: playMode, subPlay: key});
      }
    },
    [clearSelection, playMode, setRules, setSubPlayMode, uiConfig],
  );

  const canProceed = (ticket?.betCount ?? 0) > 0;
  const onNextStep = useCallback(() => {
    if (!canProceed) {
      Toast.show('请按规则完成选号');
      return;
    }
    console.log('onNextStep-ticket', ticket);
    addTicket(ticket as DigitalTicket);
    router.push({pathname: '/lottery/sport/digital/arrangedThree/slip'});
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
      if (
        playMode === ArrangedThreePlayEnum.GroupThree &&
        subPlayMode === ArrangedThreeSubPlayEnum.Single &&
        positionIndex === 0
      ) {
        return `${n}${n}`;
      }
      return n;
    },
    [playMode, subPlayMode],
  );

  const onToggle = useCallback(
    (positionIndex: number, n: number) => {
      // 胆拖互斥逻辑：如果是拖码位置，检查是否选择了胆码中已存在的数字
      if (
        playMode === ArrangedThreePlayEnum.DirectSelection &&
        subPlayMode === ArrangedThreeSubPlayEnum.CombinationDrag &&
        positionIndex === 1
      ) {
        // 拖码位置（索引1），检查是否选择了胆码（索引0）中已存在的数字
        const danNumbers = positions[0] ?? [];
        if (danNumbers.includes(n)) {
          Toast.show('该球是胆码，不能重复选择');
          return; // 阻止选择
        }
      }
      // 组三 · 胆拖：拖码与胆码互斥提示
      if (
        playMode === ArrangedThreePlayEnum.GroupThree &&
        subPlayMode === ArrangedThreeSubPlayEnum.CourageDragged &&
        positionIndex === 1
      ) {
        const danNumbers = positions[0] ?? [];
        if (danNumbers.includes(n)) {
          globalThis.Toast.show('该球是胆码，不能选择为拖码');
          return;
        }
      }
      // 组三 · 单式：重号与单号不能相同
      if (
        playMode === ArrangedThreePlayEnum.GroupThree &&
        subPlayMode === ArrangedThreeSubPlayEnum.Single &&
        positionIndex === 1
      ) {
        const heavy = positions[0]?.[0];
        if (heavy === n) {
          Toast.show('重号与单号不能相同');
          return;
        }
      }
      // 组六 · 胆拖：拖码与胆码互斥提示
      if (
        playMode === ArrangedThreePlayEnum.GroupSix &&
        subPlayMode === ArrangedThreeSubPlayEnum.CourageDragged &&
        positionIndex === 1
      ) {
        const danNumbers = positions[0] ?? [];
        if (danNumbers.includes(n)) {
          globalThis.Toast.show('该球是胆码，不能选择为拖码');
          return;
        }
      }
      // 正常选择逻辑
      useArrangedThreeStore.getState().toggleNumber(positionIndex, n);
    },
    [playMode, subPlayMode, positions],
  );

  function arrangedThreePlayAllDissmiss(): string[][] {
    const dissmissArray = lotteryData?.omissionList || [];
    if (subPlayMode === ArrangedThreeSubPlayEnum.PositioningDuplex) {
      return [
        dissmissArray.slice(0, 10),
        dissmissArray.slice(10, 20),
        dissmissArray.slice(20, 30),
      ];
    } else if (subPlayMode === ArrangedThreeSubPlayEnum.CombinationDifferent) {
      return [
        dissmissArray.slice(0, 10),
        dissmissArray.slice(10, 20),
        dissmissArray.slice(20, 30),
      ];
    } else if (
      subPlayMode === ArrangedThreeSubPlayEnum.Single ||
      subPlayMode === ArrangedThreeSubPlayEnum.Duplex
    ) {
      return [
        dissmissArray.slice(0, 10),
        dissmissArray.slice(10, 20),
        dissmissArray.slice(20, 30),
      ];
    } else if (subPlayMode === ArrangedThreeSubPlayEnum.CourageDragged) {
      return [
        dissmissArray.slice(0, 10),
        dissmissArray.slice(20, 30),
        dissmissArray.slice(10, 20),
      ];
    }
    return [];
  }

  useEffect(() => {
    buildTicket().then(setTicket);
  }, [buildTicket, positions]);

  useEffect(() => {
    getCharityLotteryData({lotteryName: LotteryName.ArrangedThree}).then(
      res => {
        console.log(res);
        if (res.success && res.data) {
          setLotteryData(res.data);
        }
      },
    );
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
    arrangedThreePlayAllDissmiss,
  };
};

export default useArrangedTree;
