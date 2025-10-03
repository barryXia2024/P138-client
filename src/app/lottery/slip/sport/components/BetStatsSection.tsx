import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {useSlipStore} from '../../store/slipStore';

const BetStatsSection: React.FC = () => {
  const {multiplier} = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();
  const {betInfo} = useSlipStore();

  const isSportLottery = SportLotteryType[lotteryInfo?.lotteryName as keyof typeof SportLotteryType] === SportLotteryTypeEnum.Sport;

  return (
    <>
      {/* 投注统计 */}
      <View style={styles.betStats}>
        <Text style={styles.betStatsText}>
          <Text style={styles.highlightText}>{betInfo.betsCount}</Text> 注{' '}
          <Text style={styles.highlightText}>{multiplier}</Text> 倍
        </Text>
        <Text style={styles.betStatsText}>
          金额:{' '}
          <Text style={styles.highlightText}>
            {betInfo.betsAmount * multiplier}
          </Text>{' '}
          元
        </Text>
      </View>

      {/* 预计奖金 */}
      {isSportLottery && (
        <View style={styles.prizeContainer}>
          <Text style={styles.prizeText}>
            预计奖金：
            {betInfo.minPayout !== betInfo.maxPayout ? (
              <Text style={styles.highlightText}>
                {(betInfo.minPayout * multiplier).toFixed(2)}-
                {(betInfo.maxPayout * multiplier).toFixed(2)}元
              </Text>
            ) : (
              <Text style={styles.highlightText}>
                {(betInfo.minPayout * multiplier).toFixed(2)}元
              </Text>
            )}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  betStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  betStatsText: {
    fontSize: 14,
  },
  highlightText: {
    color: '#f53b57',
    fontWeight: 'bold',
  },
  prizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  prizeText: {
    fontSize: 14,
  },
});

export default BetStatsSection; 