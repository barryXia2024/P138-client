import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {AppHeader, Button} from '@/p138-react-common/components';
import SportBetList from './components/sportBetList';
import WinLossBetList from './components/WinLossBetList';
import BetPlay from './components/BetPlay';
import CustomerMultiplier from './components/CustomerMultiplier';
import HeaderSection from './components/HeaderSection';
import BetInfoContainer from './components/BetInfoContainer';
import {useBetSlipLogic} from './hooks/useBetSlipLogic';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';
import {useBetInfoStore} from 'src/modules/lottery/store';
import {useSlipStore} from '../store/slipStore';
import {LotteryName} from '@/p138-react-common/constants/LotteryCommon';

const LotterySportBettingSlip = () => {
  const {lotteryInfo, getDeadline, clearBets, loading, getOpimization} =
    useBetSlipLogic();
  const {betPlayActiveTab, multiplier, setMultiplier} = useBetInfoStore();
  console.log(loading, 'loading');

  // 使用store管理弹窗状态
  const {toggleMultiplierModal, showMultiplierModal, betInfo} = useSlipStore();
  const BetListComponent =
    SportLotteryType[lotteryInfo?.lotteryName] === SportLotteryTypeEnum.Sport
      ? SportBetList
      : WinLossBetList;

  return (
    <View style={styles.container}>
      <AppHeader
        title={`${lotteryInfo?.lotteryChineseName}投注`}
        rightComponent={
          lotteryInfo?.lotteryName == LotteryName.FootballLottery ||
          lotteryInfo?.lotteryName == LotteryName.BasketballLottery ? (
            <Button
              type="text"
              textStyle={{color: '#fff'}}
              title="奖金优化"
              onClick={() =>
                getOpimization((betInfo.betsAmount * multiplier).toString())
              }
            />
          ) : null
        }
      />
      {betPlayActiveTab === 'C1C' && (
        <Text style={{fontSize: 14, margin: 10}}>
          自选比赛+系统自能匹配一场全包，组成2串1，自选场次命中即可中奖
        </Text>
      )}
      <HeaderSection
        deadline={getDeadline()}
        lotteryName={lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName}
        onClearBets={clearBets}
      />

      <BetListComponent />

      <BetInfoContainer loading={loading} />

      <BetPlay />
      <CustomerMultiplier
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        toggleMultiplierModal={toggleMultiplierModal}
        showMultiplierModal={showMultiplierModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default LotterySportBettingSlip;
