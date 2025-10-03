import {useCallback, useEffect, useMemo, useState} from 'react';

import {router} from 'expo-router';

import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

import {DigitalTicket} from '../../core';
import {useSuperLottoStore} from '../store/useSuperLottoStore';

import {SuperLottoUIConfig} from '../constants';

import {SuperLottoPlayEnum, SuperLottoSubPlayEnum} from '../constants/index';
import {useBettingListStore} from '../slip/store/useBettingListStore';

const useSuperLotto = () => {
  const [ticket, setTicket] = useState<DigitalTicket>();
  const {
    positions,
    playMode,
    subPlayMode,
    lotteryData,
    setLotteryData,
    setPlayMode,
    setSubPlayMode,
    setRules,
    clearSelection,
    buildTicket,
    toggleNumber,
  } = useSuperLottoStore();
  const {addTicket} = useBettingListStore();
  console.log('playMode', playMode, subPlayMode);

  const uiConfig = SuperLottoUIConfig;
  const playTabs = useMemo(
    () =>
      Object.entries(uiConfig).map(([k, v]) => ({
        key: k as SuperLottoPlayEnum,
        label: v.label,
      })),
    [uiConfig],
  );

  const subTabs = useMemo(() => {
    const unit = uiConfig[playMode];
    console.log(unit,'========')

    if (!unit?.subTabs){
      return [] as {key: SuperLottoSubPlayEnum; label: string}[];
    }
    console.log('activeUI', unit.subTabs, subPlayMode, playTabs, playMode);
    console.log(unit.subTabs[subPlayMode])
      
    return Object.entries(unit.subTabs[subPlayMode]).map(([k, v]) => ({
      key: k as SuperLottoSubPlayEnum,
      label: v.label,
    }));
  }, [uiConfig, playMode]);

  const activeUI = useMemo(() => {
    const unit = uiConfig[playMode];

    return unit.subTabs ? unit.subTabs[subPlayMode] : unit;
  }, [uiConfig, playMode, subPlayMode]);

  

  // 初始化/切换时注入规则
  useEffect(() => {
    const unit = uiConfig[playMode];
    if (!unit) return;
    const firstSub = unit.subTabs ? Object.keys(unit.subTabs)[0] : undefined;
    const targetSub = unit.subTabs ? subPlayMode || firstSub : undefined;
    const rules = unit.subTabs
      ? unit.subTabs[targetSub!]?.positionRules
      : unit.positionRules;
    if (rules && rules.length > 0) {
      setRules?.(rules, {play: playMode, subPlay: targetSub});
    }
    console.log(targetSub,'=====targetSub===')
    if (targetSub && targetSub !== subPlayMode) setSubPlayMode(targetSub);
  }, [playMode, subPlayMode, setRules, uiConfig, setSubPlayMode]);

  const handlePlayTabPress = useCallback(
    (key: SuperLottoPlayEnum) => {
      console.log('handlePlayTabPress', key);

      setPlayMode(key);
      clearSelection();
      // 主玩法切换时，重置子玩法为第一个
      const unit = uiConfig[key];
      if (unit?.subTabs) {
        const firstSub: SuperLottoSubPlayEnum = Object.keys(
          unit.subTabs,
        )[0] as SuperLottoSubPlayEnum;
        setSubPlayMode(firstSub);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSubTabPress = useCallback(
    (key: SuperLottoSubPlayEnum) => {
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
    // addTicket(ticket as PositionTicket);
    if (ticket) {
      addTicket(ticket);
    }

    router.push({pathname: '/lottery/sport/digital/superLotto/slip'});
  }, [addTicket, canProceed, ticket]);

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
  const getDisplayValue = useCallback((positionIndex: number, n: number) => {
    return n;
  }, []);

  const onToggle = useCallback(
    (positionIndex: number, n: number) => {
      // 正常选择逻辑
      toggleNumber(positionIndex, n);
    },
    [toggleNumber],
  );

  useEffect(() => {
    buildTicket().then(setTicket);
  }, [buildTicket, positions]);

  useEffect(() => {
    getCharityLotteryData({lotteryName: LotteryName.ArrangedThree}).then(
      res => {
        console.log(res);
        setLotteryData(res.data);
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
  };
};

export default useSuperLotto;
