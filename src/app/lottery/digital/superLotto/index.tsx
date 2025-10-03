import React, {useCallback, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {TabSwitcher} from '@/p138-react-common/components';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {HistoryPeriodSelector} from 'src/app/lottery/digital/shared/components/HistoryPeriodSelector';
import Grid from './components/Grid';
import Footer from './components/Footer';
import {useSuperLottoStore} from 'src/app/lottery/digital/superLotto/store';
import {useBettingListStore} from 'src/app/lottery/digital/superLotto/slip/store';
import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';

import {SuperLottoPlayEnum} from 'src/app/lottery/digital/shared/enums';
import {ROUTE_DIGITAL_SUPER_LOTTO_SLIP} from 'src/app/lottery/digital/shared/routes';
// import {BaseTicket} from '../core/types';

const TABS = [
  {label: '普通选号', key: SuperLottoPlayEnum.NORMAL},
  {label: '胆拖选号', key: SuperLottoPlayEnum.DANTUO},
];

export default function SuperLottoPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {setPlayMode, playMode, clearSelection} = useSuperLottoStore();

  const handleTabPress = useCallback(
    (k: SuperLottoPlayEnum) => {
      setPlayMode?.(k);
    },
    [setPlayMode],
  );

  // const betCount = getBetCount(); // 暂不使用
  const {addTicket, clearAll, lotteryData, setLotteryData} =
    useBettingListStore();
  const tabs = TABS;

  useEffect(() => {
    clearAll();
    setPlayMode?.(SuperLottoPlayEnum.NORMAL);
    getCharityLotteryData({
      lotteryName: 'SuperLotto',
    }).then(res => {
      if (res.data) {
        setLotteryData(res.data);
      }
    });
    return () => {
      clearAll();
      clearSelection();
    };
  }, [
    clearAll,
    clearSelection,
    setPlayMode,
    lotteryInfo?.lotteryName,
    setLotteryData,
  ]);

  // 下一步按钮常开，点击时在 handleNextStep 内校验
  const canProceed = true;

  const handleQuickPick = useCallback(() => {
    useSuperLottoStore.getState().quickPick();
  }, []);

  const handleQuickPick5 = useCallback(async () => {
    const store = useSuperLottoStore.getState();
    for (let i = 0; i < 5; i++) {
      store.quickPick();
      const t = await store.buildTicket?.();
      if (t) addTicket(t);
    }
    store.clearSelection();
    router.push({pathname: ROUTE_DIGITAL_SUPER_LOTTO_SLIP});
  }, [addTicket]);

  const handleNextStep = useCallback(async () => {
    if (!canProceed) {
      globalThis.Toast.show('请按规则完成选号');
      return;
    }
    const ticket = await useSuperLottoStore.getState().buildTicket?.();
    if (!ticket) return;
    addTicket(ticket);
    useSuperLottoStore.getState().clearSelection();
    router.push({pathname: ROUTE_DIGITAL_SUPER_LOTTO_SLIP});
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
        activeTab={playMode!}
        onTabPress={handleTabPress}
        tabClassName="p-2"
      />

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        <HistoryPeriodSelector
          currentPeriod={lotteryData?.currentTermNo}
          deadline={lotteryData?.buyEndTime}
          needZero
          historyData={lotteryData?.vos || []}
          lotteryData={lotteryData}
          setLotteryData={setLotteryData}
        />

        <Grid onQuickPick={handleQuickPick} onQuickPick5={handleQuickPick5} />
      </ScrollView>

      <Footer onNextStep={handleNextStep} canProceed={canProceed} />
    </View>
  );
}
