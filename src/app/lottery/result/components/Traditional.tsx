import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Image, View, Text, Platform} from 'react-native';

import TabSwitcher from '@/p138-react-common/components/TabSwitcher';

import {FlatList} from '@/p138-react-common/components/FlatList';
import {listDigitalDrawAnnouncement} from 'src/api/interface/lottery-lottery-type-draw';
 
import TraditionalBalls from './TraditionalBalls';
import {router} from 'expo-router';
import {parseLotteryResult} from '../utils';
import { formattedDate } from '@/p138-react-common/utils/fuc';

const LotteryResultTabs: {
  label: string;
  key: CoreCommonEnum.LotteryName;
}[] = [
  {label: '胜负彩', key: 'WinLossLottery'},
  {label: '4场进球彩', key: 'GameTotalGoalsBet4'},
  {label: '6场半全场', key: 'HalfTimeFullTimeBet6'},
];
const TraditionalLotteryResult: React.FC = () => {
  const [data, setData] =
    useState<LotteryDrawAnnoumcememt.DigitalDrawAnnouncement[]>();
  const [params, setParams] =
    useState<LotteryDrawAnnoumcememt.ListDigitalDrawAnnouncementCommand>(
      {
        lotteryNames: ['WinLossLottery'],
        termNo: null,
     
      },
    );

  const getList = async () => {
    listDigitalDrawAnnouncement(params ).then(res => {
      if (res.success) {
  
          setData(res.data);
      }
    });
  };

  useEffect(() => {
    getList();
  }, [params]);

  return (
    <View className="flex-1">
      {/* 玩法切换器 */}
      <TabSwitcher
        tabs={LotteryResultTabs}
        activeTab={params.lotteryNames?.[0]}
        onTabPress={tab => {
          setParams({...params, lotteryNames: [tab]});
        }}
      />

      <FlatList
        data={data || []}
        style={{flex: 1}}
        onRefresh={async () => {
          setParams({...params});
          await getList();
        }}
        hasMore={false}
        onLoadMore={async () => {
          setParams({...params});
          await getList();
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              className="bg-white m-2 p-2 rounded-lg"
              onPress={() => {
                router.push({
                  pathname: '/lottery/result/detail/traditional',
                  params: {
                    dataString: JSON.stringify(item),
                  },
                });
              }}>
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-bold">
                    {item.lotteryChineseName}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {formattedDate(item.createdAt)}
                  </Text>
                  <View
                    className="border border-[#ffda44] rounded-full p-1"
                    style={{backgroundColor: 'rgba(255, 248, 196, .7)'}}>
                    <Text className="text-[10px] text-[#ff9500]">
                      销量 {item.digitalDrawDetail.saleAmount}
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('src/assets/imgs/home/icon_arrow_right.png')}
                  // className="w-[20px] h-[20px] ml-2"
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: Platform.OS === 'web' ? 20 : 0,
                  }}
                />
              </View>

              <View>
                <TraditionalBalls
                  balls={parseLotteryResult(item.digitalDrawDetail.result)}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default TraditionalLotteryResult;
