import React from 'react';
import { TouchableOpacity,Image, View} from 'react-native';
import AppHeader from '@/p138-react-common/components/AppHeader';
import CollapsibleMatchList from './components/collapsibleMatchList';

import { router } from 'expo-router';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import useLotteryResultPageStore from './store/lotteryResultTabStore';
 

const LotteryResultTabs: {
    label: string;
    key: CommonCommonEnum.LotteryName;
  }[] = [
    {label: '竞彩足球', key: 'FootballLottery'},
    {label: '竞彩篮球', key: 'BasketballLottery'},
    // { label: '猜比分', key: '猜比分' },//暂时隐藏
    {label: '北京单场', key: 'BeijingSingleMatch'},
  ];
const LotteryResult: React.FC=() => {
  const {selectedLotteryType,setSelectedLotteryType}=useLotteryResultPageStore()

  return (
    <View className='flex-1 bg-f0f0f0'>
      {/* 顶部标题栏 */}
      <AppHeader
        title="开奖公告"
        rightComponent={
          <TouchableOpacity
            onPress={() => router.push('/shop/QRCodePage')}>
            <Image
              style={{width: 22, height: 22}}
              source={require('src/assets/imgs/live/share.png')}
            />
          </TouchableOpacity>
        }
      />
      {/* 玩法切换器 */}
      <TabSwitcher<CommonCommonEnum.LotteryName>
        tabs={LotteryResultTabs}
        activeTab={selectedLotteryType}
        onTabPress={setSelectedLotteryType}
      />

      <CollapsibleMatchList  />
    </View>
  );
};

export default LotteryResult;
