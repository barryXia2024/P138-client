import React, { FC } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {router} from 'expo-router';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';

interface HeaderSectionProps {
  deadline: string;
  lotteryName: string;
  onClearBets: () => void;
}
export const BuyEndTime = (props:{deadline: string}) => {
  return (
    <Text style={styles.deadlineText}>
      截止时间:{' '}
      <Text style={styles.deadlineTime}>
        {dayjs(props.deadline).format('YYYY-MM-DD HH:mm')}
      </Text>{' '}
      ,请尽快提交投注
    </Text>
  );
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  deadline,
  lotteryName,
  onClearBets,
}) => {
  const isSportLottery =
    SportLotteryType[lotteryName as keyof typeof SportLotteryType] ===
    SportLotteryTypeEnum.Sport;

  return (
    <View style={styles.header}>
      <BuyEndTime deadline={deadline}/>

      {isSportLottery && (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={router.back}>
            <Text style={styles.actionButtonText}>+添加赛事</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onClearBets}>
            <Text style={styles.actionButtonText}>清空列表</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deadlineText: {
    fontSize: 16,
    color: '#333',
  },
  deadlineTime: {
    color: '#f53b57',
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#f53b57',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HeaderSection;
