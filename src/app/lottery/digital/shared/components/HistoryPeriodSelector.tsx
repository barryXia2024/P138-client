import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {parseResult} from 'src/app/lottery/sport/digital/mockdata/historyData';
import {ArrowIcon} from '@/p138-react-common/components';
import {DigitalBalls} from 'src/app/lottery/result/components';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
import {isDev} from 'src/utils';

interface HistoryPeriodSelectorProps {
  currentPeriod?: string;
  deadline?: string;
  lotteryData?: LotteryDataSource.CharityLotteryDataSource;
  setLotteryData?: (data: LotteryDataSource.CharityLotteryDataSource) => void;
  onPeriodChange?: (period: string) => void;
  historyData: {termNo: string; result: string}[];
  needZero?: boolean;
}

export const HistoryPeriodSelector: React.FC<HistoryPeriodSelectorProps> = ({
  currentPeriod,
  deadline,
  historyData,
  needZero,
  lotteryData,
  setLotteryData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderHistoryItem = (
    item: {termNo: string; result: string},
    index: number,
  ) => {
    const {front, back} = parseResult(item.result);

    return (
      <View
        key={index + item.termNo}
        className="flex-row items-center py-2 px-4  ">
        {isDev && (
          <NativeCheckbox
            checked={lotteryData?.currentTermNo == item.termNo}
            onCheckedChange={() => {
              if (lotteryData) {
                setLotteryData?.({
                  ...lotteryData,
                  currentTermNo:
                    lotteryData?.currentTermNo == item.termNo
                      ? lotteryData.defaultTermNo
                      : item.termNo,
                  defaultTermNo: lotteryData.defaultTermNo ?? currentPeriod,
                });
              } else {
                Toast.show('当前数据不存在');
              }
            }}
          />
        )}
        <View>
          <Text className="text-md   text-gray-800">{item.termNo}期</Text>
        </View>
        <DigitalBalls
          needZero={needZero}
          size="small"
          balls={{redBalls: front.map(String), blueBalls: back.map(String)}}
        />
      </View>
    );
  };

  return (
    <View
      className={`bg-white mt-3 rounded-t-xl overflow-hidden ${isExpanded ? 'mb-4 rounded-xl' : ''}`}>
      {/* 期数信息显示 */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row px-4 py-2 items-center bg-pink-50"
        onPress={() => setIsExpanded(!isExpanded)}>
        <View>
          <Text className="text-md font-bold">{currentPeriod}期</Text>
        </View>
        <View className="text-md mr-4 flex-row gap-3">
          <Text> 截止时间: </Text>
          {deadline?.split(' ').map((item, index) => {
            return (
              <Text
                key={item}
                style={{color: index === 1 ? 'red' : 'black', fontSize: 14}}>
                {item}
              </Text>
            );
          })}
        </View>

        <ArrowIcon isTap={!isExpanded} />
      </TouchableOpacity>

      {/* 历史开奖数据列表 */}
      {isExpanded && (
        <ScrollView
          className="border-t border-gray-300 "
          style={{height: 120}}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}>
          {historyData.map(renderHistoryItem)}
        </ScrollView>
      )}
    </View>
  );
};
