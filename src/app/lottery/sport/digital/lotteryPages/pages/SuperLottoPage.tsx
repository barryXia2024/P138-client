import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';

import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {HistoryPeriodSelector, DigitalBetFooter} from '../../components';
import {TabSwitcher} from '@/p138-react-common/components';
import {SuperLottoGrid} from '../../components/common/LotteryGrids';
import {useSuperLottoStore} from '../../lotteryTypes/superLotto';
import {useBetlistStore, buildSuperLottoTicket} from '../../betSlip';
 ;
import {SuperLottoUIConfig} from '../../lotteryTypes/superLotto/uiConfig';
import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {superLottoPlayAllDissmiss} from '../../lotteryTypes/utils/combination';
import { SuperLottoPlayEnum, SuperLottoSubPlayEnum } from '../../types';
import { DigitalLotteryNames } from '../../lotteryTypes/configs/lotteryConfigs';

const SuperLottoConfigSchema = SuperLottoUIConfig;

export default function SuperLottoPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  const activeSubTab = SuperLottoSubPlayEnum.DEFAULT;
  const {setMode, setShowDissmiss,getBetCount,mode,clearSelection} = useSuperLottoStore();
  const superLottoConfig = SuperLottoConfigSchema[mode!];

  const handleTabPress = useCallback(
    (k: SuperLottoPlayEnum) => {
      setMode?.(k);
      setShowDissmiss(false);
      // 切换面板：普通=2个position，胆拖=4个position
      setMode?.(k);
    },
    [setMode, setShowDissmiss],
  );

  const betCount = getBetCount();
  const {addTicket, clearAll, lotteryData, setLotteryData} = useBetlistStore();
  const tabs = (
    Object.keys(
      SuperLottoConfigSchema,
    ) as (keyof typeof SuperLottoConfigSchema)[]
  ).map(key => ({
    label: SuperLottoConfigSchema[key].label,
    key: key as SuperLottoPlayEnum,
  }));

  useEffect(() => {
    clearAll();
    setMode?.(SuperLottoPlayEnum.NORMAL);
    getCharityLotteryData({
      lotteryName: lotteryInfo?.lotteryName  ||'SuperLotto',
    }).then(res => {
      console.log(res);
      setLotteryData(res.data);
    });
    return () => {
      clearAll();
      clearSelection();
    }
  }, []);
  if (lotteryData?.omissionList) {
    console.log(
      superLottoPlayAllDissmiss(mode!, lotteryData?.omissionList),
    );
  }

  const canProceed = betCount > 0;

  const handleNextStep = useCallback(async () => {
    if (!canProceed) {
      globalThis.Toast.show('请按规则完成选号');
      return;
    }
    // 构建票据并加入列表（含计算）
    const ticket = await buildSuperLottoTicket();
    if (!ticket) return;
    addTicket(ticket);
    // 清空当前选号
    useSuperLottoStore.getState().clearSelection();
    // 跳转 betlist
    router.push({
      pathname: '/lottery/sport/digital/betlist',
    });
  }, [canProceed, addTicket]);

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />

      <TabSwitcher
        tabs={tabs}
        activeTab={mode!}
        onTabPress={handleTabPress}
        tabClassName="p-2"
      />

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        <View className=" mt-4">
          <HistoryPeriodSelector
            currentPeriod={lotteryData?.currentTermNo}
            deadline={lotteryData?.buyEndTime}
            needZero
            historyData={lotteryData?.vos || []}
          />
        </View>

        <SuperLottoGrid
          lotteryName={lotteryInfo?.lotteryName as DigitalLotteryNames}
          getNumbers={i => superLottoConfig.labels[i].numbers}
          getSelected={i => useSuperLottoStore.getState().positions[i] ?? []}
          onToggle={(i, n) => useSuperLottoStore.getState().toggleNumber(i, n)}
          labels={superLottoConfig.labels}
          activeUI={superLottoConfig}
          activePlay={mode!}
          activeSubPlay={activeSubTab}
        />
      </ScrollView>

      <DigitalBetFooter onNextStep={handleNextStep} canProceed={canProceed} />
    </View>
  );
}
