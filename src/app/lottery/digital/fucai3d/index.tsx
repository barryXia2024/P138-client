import React, {useCallback, useEffect} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {router} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {TabSwitcher} from '@/p138-react-common/components';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {HistoryPeriodSelector} from 'src/app/lottery/digital/shared/components/HistoryPeriodSelector';
import {useFucai3DStore} from './store';
import Grid from './components/Grid';
import Footer from './components/Footer';
import {useBettingListStore} from './slip/store';
import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from './shared/enums';
import TopTab from '../../sport/digital/arrangedThree/components/topTab';
import QuickItem from '../../sport/digital/components/quikItem';

const PLAY_TABS = [
  {label: '直选', key: Fucai3DPlayEnum.DirectSelection},
  {label: '组三', key: Fucai3DPlayEnum.GroupThree},
  {label: '组六', key: Fucai3DPlayEnum.GroupSix},
  {label: '1D', key: Fucai3DPlayEnum.OneD},
  {label: '2D', key: Fucai3DPlayEnum.TwoD},
];

const getSubTabs = (playMode: Fucai3DPlayEnum) => {
  if (playMode === Fucai3DPlayEnum.DirectSelection) {
    return [{label: '定位复式', key: Fucai3DSubPlayEnum.PositioningDuplex}];
  }
  if (playMode === Fucai3DPlayEnum.GroupThree) {
    return [
      {label: '单式', key: Fucai3DSubPlayEnum.Single},
      {label: '复式', key: Fucai3DSubPlayEnum.Duplex},
    ];
  }
  if (playMode === Fucai3DPlayEnum.GroupSix) {
    return [{label: '复式', key: Fucai3DSubPlayEnum.Duplex}];
  }
  if (playMode === Fucai3DPlayEnum.OneD) {
    return [
      {label: '1D', key: Fucai3DSubPlayEnum.OneD},
      {label: '猜1D', key: Fucai3DSubPlayEnum.GuessOneD},
    ];
  }
  if (playMode === Fucai3DPlayEnum.TwoD) {
    return [
      {label: '2D', key: Fucai3DSubPlayEnum.TwoD},
      {label: '猜2D两不同号', key: Fucai3DSubPlayEnum.GuessTwoDDiff},
      {label: '猜2D两同号', key: Fucai3DSubPlayEnum.GuessTwoDSame},
    ];
  }

  return [
    {label: '单式', key: Fucai3DSubPlayEnum.Single},
    {label: '复式', key: Fucai3DSubPlayEnum.Duplex},
  ];
};

export default function Fucai3DPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {
    setPlayMode,
    setSubPlayMode,
    playMode,
    subPlayMode,
    clearSelection,
    positions,
    applyQuickPickCount,
  } = useFucai3DStore();
  const {addTicket, clearAll, lotteryData, setLotteryData} =
    useBettingListStore();

  const handlePlayTabPress = useCallback(
    (k: Fucai3DPlayEnum) => {
      setPlayMode?.(k);
      // 切换玩法时自动选中第一个子玩法
      const subTabs = getSubTabs(k);
      if (subTabs.length > 0) {
        setSubPlayMode?.(subTabs[0].key);
      }
    },
    [setPlayMode, setSubPlayMode],
  );

  const handleSubTabPress = useCallback(
    (k: Fucai3DSubPlayEnum) => {
      setSubPlayMode?.(k);
    },
    [setSubPlayMode],
  );

  useEffect(() => {
    clearAll();
    setPlayMode?.(Fucai3DPlayEnum.DirectSelection);
    setSubPlayMode?.(Fucai3DSubPlayEnum.PositioningDuplex);
    getCharityLotteryData({
      lotteryName: lotteryInfo?.lotteryName || 'Fucai3D',
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
    setSubPlayMode,
    lotteryInfo?.lotteryName,
    setLotteryData,
  ]);

  // 下一步按钮常开，点击时校验
  const canProceed = true;

  const handleQuickPick = useCallback(() => {
    useFucai3DStore.getState().quickPick();
  }, []);

  const handleNextStep = useCallback(async () => {
    if (!canProceed) {
      globalThis.Toast.show('请按规则完成选号');
      return;
    }
    const ticket = await useFucai3DStore.getState().buildTicket?.();
    if (!ticket) return;
    addTicket(ticket);
    useFucai3DStore.getState().clearSelection();
    router.push({pathname: '/lottery/digital/fucai3d/slip'});
  }, [canProceed, addTicket]);

  const playTabs = PLAY_TABS;
  const subTabs = getSubTabs(playMode);

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />

      <View className="mt-4">
        <TopTab
          tabs={playTabs}
          onTabPress={e => {
            handlePlayTabPress(e.label as Fucai3DPlayEnum);
          }}
        />
      </View>

      {/* 子玩法 */}
      {subTabs.length > 0 && (
        <View className="mt-3">
          <TabSwitcher
            tabs={subTabs}
            activeTab={subPlayMode}
            tabClassName="p-4"
            onTabPress={key => handleSubTabPress(key)}
          />
        </View>
      )}

      <ScrollView
        className="flex-1 px-4 bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          <HistoryPeriodSelector
            currentPeriod={lotteryData?.currentTermNo}
            deadline={lotteryData?.buyEndTime}
            lotteryData={lotteryData}
            setLotteryData={setLotteryData}
            historyData={lotteryData?.vos || []}
          />
        </View>

        <Grid onQuickPick={handleQuickPick} />

        {/* 快选区域 */}
        {playMode === Fucai3DPlayEnum.GroupThree &&
          subPlayMode === Fucai3DSubPlayEnum.Duplex && (
            <View className="bg-white p-4 rounded-md mt-4">
              <Text className="text-lg font-bold text-gray-500">快速选号</Text>
              <View className="flex-row flex-wrap">
                {[
                  {label: '10选10 赔率 1.92', count: 10},
                  {label: '10选9 赔率 2.40', count: 9},
                  {label: '10选8 赔率 3.09', count: 8},
                  {label: '10选7 赔率 4.12', count: 7},
                ].map((item, idx) => (
                  <View className="w-1/2 p-2" key={item?.label ?? idx}>
                    <QuickItem
                      item={item}
                      selected={
                        (positions?.[0]?.length ?? 0) === (item?.count ?? 0)
                      }
                      onPress={it => applyQuickPickCount(it?.count ?? 0)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* 组六快选区域 */}
        {playMode === Fucai3DPlayEnum.GroupSix &&
          subPlayMode === Fucai3DSubPlayEnum.Duplex && (
            <View className="bg-white p-4 rounded-md mt-4">
              <Text className="text-lg font-bold text-gray-500">快速选号</Text>
              <View className="flex-row flex-wrap">
                {[
                  {label: '10选10 赔率 1.92', count: 10},
                  {label: '10选9 赔率 2.40', count: 9},
                  {label: '10选8 赔率 3.09', count: 8},
                  {label: '10选7 赔率 4.12', count: 7},
                ].map((item, idx) => (
                  <View className="w-1/2 p-2" key={item?.label ?? idx}>
                    <QuickItem
                      item={item}
                      selected={
                        (positions?.[0]?.length ?? 0) === (item?.count ?? 0)
                      }
                      onPress={it => applyQuickPickCount(it?.count ?? 0)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
      </ScrollView>

      <Footer onNextStep={handleNextStep} canProceed={canProceed} />
    </View>
  );
}
