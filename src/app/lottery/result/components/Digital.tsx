import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, Image, View, Text, Platform} from 'react-native';

import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {FlatList} from '@/p138-react-common/components/FlatList';
import {listDigitalDrawAnnouncement} from 'src/api/interface/lottery-lottery-type-draw';
import dayjs from 'dayjs';
import DigitalBalls from './DigitalBalls';
import {router} from 'expo-router';
import {parseLotteryResult} from '../utils';

const DigitalLotteryResultItem = ({
  item,
}: {
  item: LotteryDrawAnnoumcememt.DigitalDrawAnnouncement;
}) => {
  return (
    <TouchableOpacity
      className="bg-white m-2 p-2 rounded-lg"
      onPress={() => {
        router.push({
          pathname: '/lottery/result/detail/digital',
          params: {
            lotteryName: item.lotteryName,
            lotteryChineseName: item.lotteryChineseName,
          },
        });
      }}>
      <View className="flex-row justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{item.lotteryChineseName}</Text>
          <Text className="text-sm text-gray-500">
            {item.termNo}期{' '}
            {dayjs(item.digitalDrawDetail.openDate, 'YYYY年MM月DD日').format(
              'MM-DD',
            )}
          </Text>
          <View
            className="border border-[#ffda44] rounded-full p-1"
            style={{backgroundColor: 'rgba(255, 248, 196, .7)'}}>
            <Text className="text-[10px] text-[#ff9500]">
              奖池 {item.digitalDrawDetail.poolBonus}
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
        <DigitalBalls
          balls={parseLotteryResult(item.digitalDrawDetail.result)}
          disabled
        />
      </View>
      <View>
        <Text className="text-[12px] text-gray-500">
          下期开奖{' '}
          {dayjs(item.digitalDrawDetail.nextOpenDate).format(
            'YYYY-MM-DD HH:mm',
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const dict: Record<
  LotteryStore.LotteryResultTabsType,
  CoreCommonEnum.LotteryName[]
> = {
  AllDigitalLottery: [],
  SportDigitalLottery: [
    'ArrangedFive',
    'ArrangedThree',
    'SuperLotto',
    'SevenStar',
  ],
  TraditionalDigitalLottery: ['DoubleBall', 'SevenHappy', 'Happy8', 'Fucai3D'],
};
const LotteryResultTabs: {
  label: string;
  key: LotteryStore.LotteryResultTabsType;
}[] = [
  {label: '体福彩开奖', key: 'AllDigitalLottery'},
  {label: '体彩开奖', key: 'SportDigitalLottery'},
  // { label: '猜比分', key: '猜比分' },//暂时隐藏
  {label: '福彩开奖', key: 'TraditionalDigitalLottery'},
];
const DigitalLotteryResult: React.FC = () => {
  const [selectedLotteryType, setSelectedLotteryType] =
    useState<LotteryStore.LotteryResultTabsType>('AllDigitalLottery');
  const [data, setData] = useState<
    LotteryDrawAnnoumcememt.DigitalDrawAnnouncement[]
  >([]);

  const getList = useCallback(async () => {
 
    listDigitalDrawAnnouncement({
      lotteryNames: dict[selectedLotteryType],
      termNo: null,
    }).then(res => {
      if (res.success) {
        setData(res.data || []);
      }
    });
  }, [selectedLotteryType]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <View style={{flex: 1,backgroundColor:'#f0f0f0'}}>
      <TabSwitcher<LotteryStore.LotteryResultTabsType>
        tabs={LotteryResultTabs}
        activeTab={selectedLotteryType}
        onTabPress={setSelectedLotteryType}
      />

      <FlatList
        data={data}
        style={{flex: 1}}
        renderItem={DigitalLotteryResultItem}
      />
    </View>
  );
};

export default DigitalLotteryResult;
