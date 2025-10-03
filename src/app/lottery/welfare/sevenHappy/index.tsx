import React, {useState} from 'react';
import {View, ScrollView, Text} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {TabSwitcher} from '@/p138-react-common/components';

import {HistoryPeriodSelector} from '../../sport/digital/components';

import CommonBetFooter from '../../sport/digital/components/common/CommonBetFooter';

import {useSevenHappyStore} from './store/useSevenHappyStore';
import useSevenHappy from './hooks/useSevenHappy';
import {SevenHappyPlayEnum, SevenHappyUIConfig} from './constants';

import SevenHappyGrid from './components/SevenHappyGrid';
import TopTab from '../../sport/digital/arrangedThree/components/topTab';

const quickPickButtons = [
  {label: '机选7位', key: 'quickPick7'},
  {label: '机选8位', key: 'quickPick8'},
  {label: '机选9位', key: 'quickPick9'},
  {label: '机选10位', key: 'quickPick10'},
  {label: '机选11位', key: 'quickPick11'},
  {label: '机选12位', key: 'quickPick12'},
  {label: '机选13位', key: 'quickPick13'},
  {label: '机选14位', key: 'quickPick14'},
  {label: '机选15位', key: 'quickPick15'},
];
const quickPickButtonsMap: Record<string, number> = {
  quickPick7: 7,
  quickPick8: 8,
  quickPick9: 9,
  quickPick10: 10,
  quickPick11: 11,
  quickPick12: 12,
  quickPick13: 13,
  quickPick14: 14,
  quickPick15: 15,
};

const SevenHappyPage: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {quickPick, playMode, lotteryData,setLotteryData} = useSevenHappyStore();
  const [quickPickButton, setQuickPickButton] = useState<string>();

  const {
    playTabs,

    activeUI,
    handlePlayTabPress,
    canProceed,
    onNextStep,
    ticket,

    onToggle,
  } = useSevenHappy();

  if (!activeUI) return null;
 

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title={lotteryInfo?.lotteryChineseName}
        titleDes="玩法说明"
        titleDesOnPress={() => router.push(ROUTE_PATHS.GAME_RULE)}
        onBackPress={() => router.dismissTo('/Home')}
        rightComponent={<CompetitionHeaderRight />}
      />

      <ScrollView
        className="flex-1  bg-[#f0f0f0]"
        showsVerticalScrollIndicator={false}>
        <TopTab
          tabs={playTabs}
          onTabPress={e => {
            handlePlayTabPress(e.label as SevenHappyPlayEnum);
          }}
        />
        {playMode === SevenHappyPlayEnum.normal && (
          <TabSwitcher
            tabs={quickPickButtons}
            tabClassName="w-[70px]"
            activeTab={quickPickButton}
            onTabPress={e => {
               
              setQuickPickButton(e);
              quickPick(quickPickButtonsMap[e]);
            }}
          />
        )}

        <View className="mt-4">
          {/* 期数选择器 */}
          <HistoryPeriodSelector
            currentPeriod={lotteryData?.currentTermNo}
            deadline={lotteryData?.buyEndTime}
            historyData={lotteryData?.vos ?? []}
            lotteryData={lotteryData}
            setLotteryData={setLotteryData}
          />

          <SevenHappyGrid activeUI={activeUI} onToggle={onToggle} />
        </View>
      </ScrollView>

      <CommonBetFooter
        summary={null}
        betCount={ticket?.betCount ?? 0}
        betAmount={ticket?.betAmount ?? 0}
        canProceed={canProceed}
        onClear={() => {}}
        onNextStep={onNextStep}
      />
    </View>
  );
};

export default SevenHappyPage;
