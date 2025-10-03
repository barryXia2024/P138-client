import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {AppHeader, Button} from '@/p138-react-common/components';
import {FlatList} from '@/p138-react-common/components/FlatList';
import {useBetlistStore} from '../';

import {computeSuperLotto} from '../../lotteryTypes';

import {useLotteryInfoStore} from 'src/modules/lottery/store';
import DigitalBall, { DigitalBallSize } from 'src/app/lottery/components/DigitalBall';
import CustomerMultiplier from 'src/app/lottery/slip/sport/components/CustomerMultiplier';
import MultiplierSection from 'src/app/lottery/slip/sport/components/MultiplierSection';
import closeImg from 'src/assets/imgs/home/close.png';
import HeaderSection from '../../components/HeaderSection';
import {DigitalTicket, PositionTicket, SuperLottoTicket} from '../../core';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';
import {saveLotteryScheme} from 'src/api/interface/orders-bet';
import {calculatorRegistry} from '../../calculators';
import {useUserStore} from 'src/store';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';
import {SuperLottoPlayEnum} from '../../types';

const SuperLottoItem = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
  append,
}: {
  item: SuperLottoTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: any;
  }) => void;
  append: string;
}) => {
  const {betCount} = computeSuperLotto(item);
  const multiplier = ticketsMultiplier[item.betId] || 1;
  // 基础金额：每注2元，追加后每注3元
  const perBetAmount = append === '1' ? 3 : 2;
  const totalAmount = perBetAmount * betCount * multiplier;
  const DantuoItem = () => {
    return (
      <>
        <View className="flex-row flex-wrap">
          {item.positions[0].map((v: number, index: number) => (
            <DigitalBall
              key={index}
              value={v}
              color="red"
              needZero
              selected
              size="medium"
            />
          ))}
          <DigitalBall
            key={'dan'}
            value={'拖'}
            color="red"
            selected
            size="medium"
          />
          {item.positions[1].map((v: number, index: number) => (
            <DigitalBall
              key={index}
              value={v}
              color="red"
              needZero
              selected
              size="medium"
            />
          ))}
        </View>
        <View className="flex-row flex-wrap">
          {item.positions[2].map((v: number, index: number) => (
            <DigitalBall
              key={index}
              value={v}
              color="blue"
              needZero
              selected
              size="medium"
            />
          ))}
          <DigitalBall
            key={'tuo'}
            value={'拖'}
            color="blue"
            selected
            size="medium"
          />
          {item.positions[3].map((v: number, index: number) => (
            <DigitalBall
              key={index}
              value={v}
              color="blue"
              needZero
              selected
              size="medium"
            />
          ))}
        </View>
      </>
    );
  };
  const NormalItem = () => {
    return (
      <>
        <View className="flex-row flex-wrap">
          {item.positions[0].map((v: number, index: number) => (
            <DigitalBall
              key={index}
              value={v}
              color="red"
              selected
              needZero
              size="medium"
            />
          ))}
        </View>
        <View className="flex-row flex-wrap">
          {item.positions[1].map((v: number, index: number) => (
            <DigitalBall
              key={index}
              value={v}
              color="blue"
              selected
              needZero
              size="medium"
            />
          ))}
        </View>
      </>
    );
  };
  const computed = () => {
    const calculator = calculatorRegistry[item.lotteryName];
    return calculator(item);
  };

  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity
        className="absolute right-0 top-0 p-2"
        activeOpacity={1}
        onPress={() => removeTicket(item.betId)}>
        <Image
          source={closeImg}
          className="w-8 h-8"
          resizeMode="contain"
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>
      {item.mode === 'normal' ||
      item.playMode === SuperLottoPlayEnum.NORMAL ||
      item.mode === SuperLottoPlayEnum.NORMAL ? (
        <NormalItem />
      ) : (
        <DantuoItem />
      )}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          [{computed().betPlay}]{betCount}注 {multiplier}倍
          <Text className="text-red-500 font-bold">{totalAmount}元</Text>
        </Text>
        <MultiplierSection
          title=""
          multiplier={multiplier}
          setMultiplier={value => {
            setTicketsMultiplier({...ticketsMultiplier, [item.betId]: value});
          }}
          toggleMultiplierModal={() => {
            setMultiplierModal({
              isVisiable: true,
              value: multiplier,
              type: 'multiplier',
              ticket: item,
            });
          }}
        />
      </View>
    </View>
  );
};
const PositionItem: React.FC<{
  item: PositionTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: DigitalTicket;
  }) => void;
  append: string;
}> = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
  append,
}) => {
  const multiplier = ticketsMultiplier[item.betId] || 1;
  // 基础金额：每注2元，追加后每注3元
  const perBetAmount = append === '1' ? 3 : 2;
  const totalAmount = perBetAmount * (item.betCount || 1) * multiplier;
  const array = [
    '第一位',
    '第二位',
    '第三位',
    '第四位',
    '第五位',
    '第六位',
    '第七位',
  ];
  return (
    <View className="bg-white p-4 rounded-xl mx-2 mt-4">
      <TouchableOpacity
        className="absolute right-0 top-0 p-2"
        onPress={() => removeTicket(item.betId)}>
        <Image
          source={closeImg}
          className="w-8 h-8"
          resizeMode="contain"
          style={{width: 32, height: 32}}
        />
      </TouchableOpacity>
      {item.positions?.map((pos: number[], idx: number) => (
        <View key={idx} className="flex-row flex-wrap mb-1">
          <Text className="mr-2 text-lg">{array[idx]}</Text>
          {pos
            .sort((a, b) => a - b)
            .map((v: number, i: number) => (
              <DigitalBall
                key={i}
                value={v}
                color="red"
                selected
                size={DigitalBallSize.Medium}
              />
            ))}
        </View>
      ))}
      <View className="flex-row justify-between items-center">
        <Text className="text-lg">
          {item.betCount > 1 ? '[复式]' : '[单式]'} {item.betCount}注{' '}
          {multiplier}倍{' '}
          <Text className="text-red-500  d">{totalAmount}元</Text>
          {append === '1' && (
            <Text className="text-xs text-gray-500"> (追加投注)</Text>
          )}
        </Text>
        <MultiplierSection
          title=""
          multiplier={multiplier}
          setMultiplier={value => {
            setTicketsMultiplier({...ticketsMultiplier, [item.betId]: value});
          }}
          toggleMultiplierModal={() => {
            setMultiplierModal({
              isVisiable: true,
              value: multiplier,
              type: 'multiplier',
              ticket: item,
            });
          }}
        />
      </View>
    </View>
  );
};
export default function BetlistPage() {
  const router = useRouter();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const [append, setAppend] = useState('2');
  const {
    tickets,
    ticketsMultiplier,
    setTicketsMultiplier,
    removeTicket,
    addTicket,

    lotteryData,
    clearAll,
  } = useBetlistStore();

  const {isSave} = useLocalSearchParams();
  const {loginInfo, shopInfo} = useUserStore();
  const [chaseNumber, setChaseNumber] = useState(1);

  const [multiplierModal, setMultiplierModal] = useState<{
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: DigitalTicket;
  }>({isVisiable: false, value: 1, type: 'multiplier'});

  const betTotalAmount = () => {
    return tickets.reduce((acc, curr) => {
      if (curr.lotteryName === 'SuperLotto') {
        const {betCount} = computeSuperLotto(curr as any);
        const multiplier = ticketsMultiplier[curr.betId] || 1;
        // 基础金额：每注2元，追加后每注3元
        const perBetAmount = append === '1' ? 3 : 2;
        const totalBetAmount = perBetAmount * betCount * multiplier;
        return acc + totalBetAmount;
      }
      const betCount = curr.betCount || 1;
      const multiplier = ticketsMultiplier[curr.betId] || 1;
      // 基础金额：每注2元，追加后每注3元
      const perBetAmount = append === '1' ? 3 : 2;
      const totalBetAmount = perBetAmount * betCount * multiplier;
      return acc + totalBetAmount;
    }, 0);
  };

  const submitProgram = () => {
    const betPlayArray = new Set<string>();
    const betContentDigitalLottery = tickets.map(raw => {
      const item = raw;
      const gameKey = item.lotteryName;
      console.log('gameKey', gameKey);
      const calculator = calculatorRegistry[gameKey];
      const computed = calculator(item);
      const multiplier = ticketsMultiplier[item.betId] || 1;
      // 基础金额：每注2元，追加后每注3元
      const perBetAmount = append === '1' ? 3 : 2;
      const totalAmount = perBetAmount * (computed.betCount || 1) * multiplier;
      betPlayArray.add(computed.betPlay ?? '');
      return {
        betContentDigitalLotteryID: undefined,
        betPlay: computed.betPlay ?? '',
        playType: null,
        betItem: computed.betItem ?? '',
        betAmount: totalAmount.toFixed(2),
        betMultiple: multiplier,
        orderItemID: undefined,
      };
    });
    return {
      bettingString: null,
      shopLotteryID: lotteryInfo?.id as string,
      lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      lotteryType: lotteryInfo?.lotteryType as CoreCommonEnum.LotteryType,
      buyEndTime: lotteryData?.buyEndTime,
      betCount: 1,
      append: append as CoreCommonEnum.AppendType,
      optimizationType: undefined,
      bonusDetailList: null,
      single: false,
      betContentDigitalLottery: betContentDigitalLottery,
      chaseNumber: chaseNumber,
      betContentSportsLotteryList: null,
      betContentTraditionalLotteryList: null,
      playName: betPlayArray.size === 1
      ? (betPlayArray.values().next().value as string)
      : '混合投注',
      shopCode: shopInfo?.shopCode || 0,
      userID: loginInfo?.userID || '',
      paymentMethod: null,
      betPlay:
        betPlayArray.size === 1
          ? (betPlayArray.values().next().value as string)
          : '混合投注',
      betMultiple: 1,
      frontEndOnly: JSON.stringify({
        buyEndTime: lotteryData?.buyEndTime,
        currentTermNo: lotteryData?.currentTermNo,
        vos: lotteryData?.vos,
      }),
      winMixAmount: '0',
      winAmount: '0',
      betAmount: (betTotalAmount() * chaseNumber).toFixed(2),
      username: loginInfo?.username,
      needUploadTicket: true,
      lotteryIcon: lotteryInfo?.lotteryIcon as string,
      termNo: lotteryData?.currentTermNo,

      lotteryCategory:
        lotteryInfo?.lotteryCategory as CoreCommonEnum.LotteryCategory,

      commissionRate: '',
      lotteryNumber: null,
      paymentStatus: 2,
      // winStatus: null,
      orderType: null,
      currentOrderNo: '',
      optimization: '',
      declaration: null,
      programContent: null,
      commission: '0',
    };
  };

  const saveLotteryPlan = () => {
    console.log('tickets======', tickets);
    const dict: ServerCoreOrder.SaveSchemeCommand = submitProgram();

    // 提交订单
    saveLotteryScheme(dict).then(res => {
      if (res.success) {
        router.dismissAll();
        router.dismissTo({
          pathname: '/order/bet/detail',
          params: {
            orderId: res.data?.orderId,
          },
        });
      }
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <AppHeader
        title={'选号列表'}
        rightComponent={
          <Button
            title="清空"
            type="text"
            textStyle={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}
            onPress={() => {
              clearAll();
              router.back();
            }}
          />
        }
      />

      <HeaderSection
        deadline={lotteryData?.buyEndTime || ''}
        lotteryName={lotteryInfo?.lotteryName || ''}
        onClearBets={() => {}}
        addTicket={addTicket}
      />

      <FlatList
        data={tickets}
        renderItem={({item}) =>
          (item as any).lotteryName === 'SuperLotto' ? (
            <SuperLottoItem
              item={item as SuperLottoTicket}
              ticketsMultiplier={ticketsMultiplier}
              setTicketsMultiplier={setTicketsMultiplier}
              removeTicket={removeTicket}
              setMultiplierModal={setMultiplierModal}
              append={append}
            />
          ) : (
            <PositionItem
              item={item as PositionTicket}
              ticketsMultiplier={ticketsMultiplier}
              setTicketsMultiplier={setTicketsMultiplier}
              removeTicket={removeTicket}
              setMultiplierModal={setMultiplierModal}
              append={append}
            />
          )
        }
      />

      <View className="bg-white mt-1">
        <View className="flex-row justify-center py-3 items-center">
          {lotteryInfo?.lotteryName === LotteryName.SuperLotto && (
            <NativeCheckbox
              label="追加（最高可中1800万）"
              checked={append === '1'}
              onCheckedChange={() => {
                setAppend(append === '1' ? '2' : '1');
              }}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setMultiplierModal({
                isVisiable: true,
                value: 1,
                type: 'betTimes',
              });
            }}>
            <Text>
              追号<Text className="text-red-500 font-bold">{chaseNumber}</Text>
              期
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between border-t border-gray-300 p-4">
          {isSave !== '1' && (
            <CustomAlertDialog
              title="提示"
              trigger={
                <Button
                  title="保存"
                  className="border-red-500 border"
                  style={{padding: 0, height: 35, width: 65}}
                  textStyle={{color: 'red', fontSize: 16, fontWeight: 'bold'}}
                  size="small"
                />
              }
              description="保存方案后续可以转为投注方案，也可以不投注等开奖后验证您的思路。确定保存吗？"
              onConfirm={saveLotteryPlan}
            />
          )}

          <View className=" items-center justify-center">
            <Text>
              <Text className="text-md text-red-500 font-bold">
                {betTotalAmount() * chaseNumber}
              </Text>
              元
            </Text>
            <Text>
              <Text className="  text-red-500  ">{tickets.length}</Text>注{' '}
              <Text className="  text-red-500  ">1</Text>期
            </Text>
          </View>
          <Button
            title="确认投注"
            style={{padding: 0, height: 35, width: 80}}
            textStyle={{fontSize: 16, fontWeight: 'bold'}}
            size="small"
            type="primary"
            onPress={() => {
              const dict: ServerCoreOrder.SaveSchemeCommand = submitProgram();
              router.push({
                pathname: '/lottery/slip/digitalPayConfirm',
                params: {
                  jcBetsInfoString: JSON.stringify(
                    tickets.map(t => ({...t, game: 'SuperLotto'})),
                  ),
                  amout: betTotalAmount(),
                  multiplierDictString: JSON.stringify(ticketsMultiplier),
                  dictString: JSON.stringify(dict),
                },
              });
            }}
            textStyle={{fontSize: 18, fontWeight: 'bold'}}
          />
        </View>
      </View>

      <CustomerMultiplier
        multiplier={multiplierModal.value}
        type="digital"
        setMultiplier={value => {
          if (multiplierModal.type === 'betTimes') {
            setChaseNumber(value);
          }
          if (multiplierModal.type === 'multiplier') {
            if (multiplierModal.ticket) {
              ticketsMultiplier[multiplierModal.ticket.betId] = value;
            }
          }
        }}
        maxMultiplierTitle={
          multiplierModal?.type === 'multiplier' ? '倍' : '期'
        }
        toggleMultiplierModal={() => {
          setMultiplierModal(prev => ({...prev, isVisiable: !prev.isVisiable}));
        }}
        showMultiplierModal={multiplierModal.isVisiable}
      />
    </View>
  );
}
