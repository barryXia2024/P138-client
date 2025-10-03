import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {router} from 'expo-router';

import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

import {
  DigitalTicket,
  PositionTicket,
} from 'src/app/lottery/sport/digital/core';
import {useDoubleBallStore} from '../store/useDoubleBallStore';
import {DoubleBallPlayEnum, DoubleBallUIConfig} from '../constants';
 
import {doubleBallMockdata} from '../mockdata';
import { useBettingListStore } from '../slip/store/useBettingListStore';
 

const useDoubleBall = () => {
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
    setLotteryData,
    lotteryData,
  } = useDoubleBallStore();

  const playTabs = useMemo(
    () =>
      Object.entries(DoubleBallUIConfig).map(([k, v]) => ({
        key: k,
        label: v.label,
      })),
    [],
  );

  const activeUI = useMemo(() => {
    const unit = DoubleBallUIConfig[playMode!];
    if (!unit) return undefined;
    return unit.subTabs ? unit.subTabs[subPlayMode!] : unit;
  }, [playMode, subPlayMode]);

  // 初始化/切换时注入规则
  useEffect(() => {
    const unit = DoubleBallUIConfig[playMode!];
    if (!unit) return;
    const firstSub = unit.subTabs ? Object.keys(unit.subTabs)[0] : undefined;
    const targetSub: DoubleBallPlayEnum = unit.subTabs
      ? subPlayMode || firstSub
      : undefined;
    const rules = unit.subTabs
      ? unit.subTabs[targetSub!]?.positionRules
      : unit.positionRules;
    if (rules && rules.length > 0) {
      setRules?.(rules, {play: playMode!, subPlay: targetSub});
    }
    if (targetSub && targetSub !== subPlayMode) setSubPlayMode(targetSub);
  }, [playMode, subPlayMode, setRules, setSubPlayMode]);

  const handlePlayTabPress = useCallback(
    (key: DoubleBallPlayEnum) => {
      console.log('handlePlayTabPress', key);

      setPlayMode(key);

      // 主玩法切换时，重置子玩法为第一个
      const unit = DoubleBallUIConfig[key];
      if (unit?.subTabs) {
        const firstSub: DoubleBallPlayEnum = Object.keys(
          unit.subTabs,
        )[0] as DoubleBallPlayEnum;
        setSubPlayMode(firstSub);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSubTabPress = useCallback(
    (key: DoubleBallPlayEnum) => {
      setSubPlayMode(key);
      const unit = DoubleBallUIConfig[playMode!];
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
      pathname: '/lottery/welfare/doubleBall/slip',
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
    getCharityLotteryData({lotteryName: LotteryName.DoubleBall}).then(res => {
      console.log(res);
      setLotteryData(res.data || doubleBallMockdata.data);
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

export default useDoubleBall;
