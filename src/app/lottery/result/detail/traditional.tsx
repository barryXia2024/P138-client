import React  from 'react';
import {
  Image,
  View,
  Text,
  ScrollView,
} from 'react-native';

import {kScreenWidth} from '@/p138-react-common/utils/styles';

import {useLocalSearchParams} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {LotteryPrizeTableBlock, TraditionalBalls} from '../components';
import {parseLotteryResult} from '../utils';

const TraditionalLotteryResult: React.FC = () => {
  const {dataString} = useLocalSearchParams<{
    dataString: string;
  }>();
  const data: LotteryDrawAnnouncement.DigitalDrawAnnouncement = JSON.parse(
    dataString as string,
  );

  return (
    <View
      style={{
        width: kScreenWidth,
        flex: 1,
      }}>
      <AppHeader title="开奖详情" />

      <ScrollView className="flex-1">
        <View className="bg-white justify-center items-center flex-1 p-3">
          <View className="flex-row items-center gap-2 justify-between flex-1 w-full">
            <Text className="text-lg">{data.termNo}期 </Text>
            <Text className="text-sm text-gray-500">
              {data.digitalDrawDetail.openDate}
            </Text>
          </View>
          <TraditionalBalls
            balls={parseLotteryResult(data.digitalDrawDetail.result || '')}
          />
        </View>
        <LotteryPrizeTableBlock
          prizeList={
            data.digitalDrawDetail.vos?.filter(item => item.name !== '任九') ||
            []
          }
          salesAmount={data.digitalDrawDetail.saleAmount}
          jackpotAmount={data.digitalDrawDetail.poolBonus}
        />
        <LotteryPrizeTableBlock
          prizeList={
            data.digitalDrawDetail.vos?.filter(item => item.name === '任九') ||
            []
          }
          salesAmount={data.digitalDrawDetail.nineSaleAmount || 0}
          jackpotAmount={data.digitalDrawDetail.ninePoolBonus || 0}
        />
        <View className="flex-row bg-gray-100 border-b border-gray-200">
          <Text className="flex-1 text-center py-2 font-bold">场次</Text>
          <Text className="flex-1 text-center py-2 font-bold">主队</Text>

          <Text className="flex-1 text-center py-2 font-bold">比分</Text>
          <Text className="flex-1 text-center py-2 font-bold">客队</Text>

          <Text className="flex-1 text-center py-2 font-bold">赛果</Text>
        </View>
        {data.digitalDrawDetail.competitionVos?.map((item, index) => (
          <View
            key={index}
            className="flex-row border-b border-gray-100 bg-white">
            <Text className="flex-1 text-center py-2">{index + 1}</Text>
            <Text className="flex-1 text-center py-2">{item.home}</Text>
            <Text className="flex-1 text-center py-2">
              {item.matchScore + '\n'}
              <Text className="text-sm text-gray-500">
                半场 {item.halfMatchScore}
              </Text>
            </Text>
            <Text className="flex-1 text-center py-2">{item.away}</Text>
            <Text className="flex-1 text-center py-2 text-red-500">
              {item.result}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TraditionalLotteryResult;
