import React from 'react';
import {View} from 'react-native';

import {TabSwitcher} from '@/p138-react-common/components';
import CollapsibleMatchList from 'src/modules/lottery/result/components/collapsibleMatchList';
import useLotteryResultPageStore from 'src/modules/lottery/result/store/lotteryResultTabStore';
const LotteryResultTabs: {
  label: string;
  key: CommonCommonEnum.LotteryName;
}[] = [
  {label: '竞彩足球', key: 'FootballLottery'},
  {label: '竞彩篮球', key: 'BasketballLottery'},
  // { label: '猜比分', key: '猜比分' },//暂时隐藏
  {label: '北京单场', key: 'BeijingSingleMatch'},
];
const SportLotteryResult: React.FC = () => {
  const {selectedLotteryType, setSelectedLotteryType} =
    useLotteryResultPageStore();

  return (
    <View className="flex-1 bg-white  ">
      <TabSwitcher<
        CommonCommonEnum.LotteryName | LotteryStore.LotteryResultTabsType
      >
        tabs={LotteryResultTabs}
        activeTab={selectedLotteryType}
        onTabPress={setSelectedLotteryType}
      />

      <CollapsibleMatchList />
    </View>
  );
};

export default SportLotteryResult;
