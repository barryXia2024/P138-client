import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';
import {
  formatCurrency,
  formatNumberWithZero,
  isEmpty,
} from '@/p138-react-common/utils';
import {betPlayColorGreen} from '@/p138-react-common/utils/styles/color';
import {
  ArrangedFiveTicket,
  ArrangedThreeTicket,
  DoubleBallTicket,
  Fucai3DTicket,
  SevenHappyTicket,
  SevenStarTicket,
  SuperLottoTicket,
} from './ticketItem';
import DigitalBall from 'src/app/lottery/components/DigitalBall';
import {isDev} from 'src/utils';

const DigitalTicketList = ({
  orderData,
}: {
  orderData: ServerCoreOrder.LotteryOrder;
  isShowCp?: boolean;
}) => {
  const digitalTicketContent = (betItem: string, betPlay: string) => {
    if (orderData.lotteryName == LotteryName.SuperLotto) {
      return SuperLottoTicket(betItem, betPlay);
    } else if (orderData.lotteryName == LotteryName.SevenStar) {
      return SevenStarTicket(betItem, betPlay);
    } else if (orderData.lotteryName == LotteryName.ArrangedThree) {
      return ArrangedThreeTicket(betItem, betPlay);
    } else if (orderData.lotteryName == LotteryName.ArrangedFive) {
      return ArrangedFiveTicket(betItem, betPlay);
    } else if (orderData.lotteryName == LotteryName.SevenHappy) {
      return SevenHappyTicket(betItem, betPlay);
    } else if (orderData.lotteryName == LotteryName.DoubleBall) {
      return DoubleBallTicket(betItem, betPlay);
    } else if (orderData.lotteryName === LotteryName.Fucai3D) {
      return Fucai3DTicket(betItem, betPlay);
    } else if (orderData.lotteryName === LotteryName.Happy8) {
      return SevenHappyTicket(betItem, betPlay);
    }
    return (
      <Text style={{fontWeight: 'bold'}}>
        <Text className="  font-blod">
          {betItem.split('#').map(num => num.split('|').map(num => num + ' '))}
        </Text>
      </Text>
    );
  };
  console.log(orderData.betContentDigitalLotteryList[0].matched,'========orderData.lotteryNumber')

 
  return (
    <View className="bg-white mb-2">
      <View className="flex-row  items-center p-2">
        <Text className="text-lg font-bold">投注信息</Text>
        <View
          className="px-2 py-1 rounded-md ml-2"
          style={{backgroundColor: betPlayColorGreen}}>
          <Text className="text-md  text-white">第{orderData.termNo} 期</Text>
        </View>
      </View>
      <View className="flex-row border-b border-gray-100 gap-[2px]">
        <Text className="  text-center bg-[#f5f5f5] py-3" style={{width: 130}}>
          玩法
        </Text>
        <Text className="flex-1 text-center bg-[#f5f5f5] py-3">投注</Text>

        <Text className=" text-center bg-[#f5f5f5] py-3" style={{width: 80}}>
          倍数/金额
        </Text>
        {[10, 12].includes(orderData.orderStatus) && isDev && (
          <Text className=" text-center bg-[#f5f5f5] py-3" style={{width: 100}}>
            命中
          </Text>
        )}
      </View>
      {orderData?.betContentDigitalLotteryList?.map((item, index) => (
        <View
          key={JSON.stringify(item) + index}
          className="flex-row border-b border-gray-100">
          <View
            className="  items-center justify-center border border-gray-100"
            style={{width: 130}}>
            <Text className="text-center font-bold text-[16px]">
              {item.betPlay}
            </Text>
          </View>
          <View className="flex-1 items-center justify-center">
            <Text className="text-center   text-lg">
              {digitalTicketContent(item.betItem, item.betPlay)}
            </Text>
          </View>

          <View style={{width: 100}} className="items-center justify-center">
            <Text className="text-center text-[16px] ">
              {item.betMultiple} 倍/{item.betAmount}元
            </Text>
          </View>
          {[10, 12].includes(orderData.orderStatus) && (
            <View style={{width: 100}} className="items-center justify-center">
              {item.isWin &&item.matched?.length&&item.matched?.length<10000 && (
                <Text
                  className="text-center text-lg  w-full"
                  style={{fontWeight: 'bold'}}>
                  {item.matched}
                </Text>
              )}
              {item.isWin && (
                <View  className='w-full'>
                  <Text className='text-right'>lv：{item.prizeLevel}</Text>
                  <Text className="text-red-500 text-right">
                    {formatCurrency(item.winAmount)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      {!isEmpty(orderData.lotteryNumber) && (
        <View className="mt-4 justify-center items-center">
          <Text className="text-lg font-bold">开奖号码</Text>
          <View className="flex-row flex-wrap">
            {orderData.lotteryNumber
              ?.split('|')
              ?.map((item, index) =>
                item
                  .split('#')
                  .map((item, i) => (
                    <DigitalBall
                      key={JSON.stringify(item) + index + i}
                      value={item}
                      selected
                      color={index % 2 === 0 ? 'red' : 'blue'}
                    />
                  )),
              )}
          </View>
        </View>
      )}
    </View>
  );
};

export default DigitalTicketList;
