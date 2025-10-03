import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {router} from 'expo-router';

import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

import {
  DigitalTicket,
  PositionTicket,
} from 'src/app/lottery/sport/digital/core';
import {useHappy8Store} from '../store/useHappy8Store';
import {
  Happy8PlayEnum,
  Happy8UIConfig,
  QuickPickButtonEnum,
} from '../constants';

import {happy8Mockdata} from '../mockdata';
import {useBettingListStore} from '../slip/store/useBettingListStore';

const useHappy8 = () => {
  const [ticket, setTicket] = useState<PositionTicket>();
  const {addTicket} = useBettingListStore();

  const {
    positions,
    playMode,
    subPlayMode,
    setSubPlayMode,
    setPlayMode,
    setRules,
    toggleNumber,
    buildTicket,
    clearSelection,
    lotteryData,
    setLotteryData,
  } = useHappy8Store();

  const playTabs = useMemo(
    () =>
      Object.entries(Happy8UIConfig).map(([k, v]) => ({
        key: k,
        label: v.label,
      })),
    [],
  );

  const activeUI = useMemo(() => {
    const unit = Happy8UIConfig[playMode!];
    console.log(unit, 'unit');
    if (!unit) return undefined;

    return unit.subTabs ? unit.subTabs[QuickPickButtonEnum.pick1] : unit;
  }, [playMode, subPlayMode]);

  // 初始化/切换时注入规则
  useEffect(() => {
    const unit = Happy8UIConfig[playMode!];
    if (!unit) return;
    const firstSub: QuickPickButtonEnum | undefined = unit.subTabs
      ? (Object.keys(unit.subTabs)[0] as QuickPickButtonEnum)
      : undefined;
    const targetSub: QuickPickButtonEnum | undefined = unit.subTabs
      ? subPlayMode || firstSub
      : undefined;
    const rules = unit.subTabs
      ? unit.subTabs[targetSub!]?.positionRules
      : unit.positionRules;
    if (rules && rules.length > 0) {
      setRules?.(rules, {play: playMode!, subPlay: targetSub!});
    }
    if (targetSub && targetSub !== subPlayMode) setSubPlayMode(targetSub);
  }, [playMode, subPlayMode, setRules, setSubPlayMode]);

  const handlePlayTabPress = useCallback(
    (key: Happy8PlayEnum) => {
      console.log('handlePlayTabPress', key);

      setPlayMode(key);

      
    },

    [],
  );

  const handleSubTabPress = useCallback(
    (key: QuickPickButtonEnum) => {
      setSubPlayMode(key);
      
      setPlayMode(Happy8PlayEnum.normal);
      const unit = Happy8UIConfig[playMode!];
      const rules = unit?.subTabs?.[key]?.positionRules;
      if (rules && rules.length > 0) {
        setRules?.(rules, {play: playMode!, subPlay: key});
      }


    
    },
    [playMode, setRules, setSubPlayMode],
  );

  const canProceed = (ticket?.betCount ?? 0) > 0;
  const onNextStep = useCallback(async () => {
    if (!canProceed) {
      Toast.show('请按规则完成选号');
      return;
    }
    // console.log('onNextStep-ticket', ticket);
    // addTicket(ticket as DigitalTicket);
    // router.push({pathname: '/lottery/welfare/doubleBall/slip'});

    // 构建票据并加入列表（含计算）
    const ticket = await buildTicket();
    if (!ticket) return;
    addTicket(ticket);
    // 清空当前选号
    clearSelection();
    // 跳转 betlist
    router.push({
      pathname: '/lottery/welfare/happy8/slip',
    });
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

  const onToggle = useCallback(
    (positionIndex: number, n: number) => {
      // 正常选择逻辑
      toggleNumber(positionIndex, n);
    },
    [playMode, subPlayMode, positions],
  );

  useEffect(() => {
    buildTicket().then(setTicket);
  }, [buildTicket, positions]);

  useEffect(() => {
    getCharityLotteryData({lotteryName: LotteryName.Happy8}).then(res => {
      console.log(res);
      setLotteryData(res.data as LotteryDataSource.CharityLotteryDataSource);
    });
  }, []);
  return {
    playTabs,

    activeUI,

    handlePlayTabPress,
    handleSubTabPress,
    canProceed,
    onNextStep,
    getNumbers,

    onToggle,
    ticket,
    lotteryData,
  };
};

export default useHappy8;
