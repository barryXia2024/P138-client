import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {TabSwitcher} from '@/p138-react-common/components';

import {HistoryPeriodSelector} from '../../sport/digital/components';

import CommonBetFooter from '../../sport/digital/components/common/CommonBetFooter';

import {useHappy8Store} from './store/useHappy8Store';
import useHappy8 from './hooks/useHappy8';
import {Happy8PlayEnum, quickPickButtons, quickPickButtonsMap,QuickPickButtonEnum} from './constants';

import Happy8Grid from './components/Happy8Grid';
import TopTab from '../../sport/digital/arrangedThree/components/topTab';


const Happy8Page: React.FC = () => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {lotteryData,setLotteryData,playMode, setPickN, subPlayMode} = useHappy8Store();
  const [quickPickButton, setQuickPickButton] = useState<QuickPickButtonEnum>(QuickPickButtonEnum.pick1);

  const {
    playTabs,
    
    activeUI,
    handlePlayTabPress,
    canProceed,
    onNextStep,
    ticket,
    handleSubTabPress,
    onToggle,

  } = useHappy8();
  console.log(playMode,subPlayMode, 'playMode,subPlayMode');
 
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
        <TabSwitcher<QuickPickButtonEnum>
          tabs={quickPickButtons.map(item => ({label: item.label, key: item.key  }))}
          tabClassName="w-[70px]"
          activeTab={quickPickButton}
          onTabPress={key => {
            setQuickPickButton(key);
            const n = quickPickButtonsMap[key] ?? 1;
            console.log(n,'========n')
            setPickN(n);
            handleSubTabPress(key);
          }}
        />

        {quickPickButton !== QuickPickButtonEnum.pick1 && (
          <TopTab
            tabs={playTabs}
            selectedTab={playMode}
            onTabPress={e => {
              handlePlayTabPress(e.label as Happy8PlayEnum);
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

          <Happy8Grid activeUI={activeUI!} onToggle={onToggle} />
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

export default Happy8Page;
