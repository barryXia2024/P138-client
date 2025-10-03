import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {router} from 'expo-router';

import {Button} from '@/p138-react-common/components';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useSevenStarStore, useSuperLottoStore} from '../lotteryTypes';
import {buildSevenStarTicket, buildSuperLottoTicket} from '../betSlip';
import {DigitalTicket} from '../core';
import {useArrangedThreeStore} from '../arrangedThree/store/useArrangedThreeStore';
import {
  ArrangedThreePlayEnum,
  ArrangedThreeSubPlayEnum,
  ArrangedThreeUIConfig,
} from '../arrangedThree/constants';

import {useArrangedFiveStore} from '../arrangedFive/store/useArrangedFiveStore';

interface HeaderSectionProps {
  deadline?: string;
  lotteryName: string;
  onClearBets: () => void;
  addTicket?: (ticket: DigitalTicket) => void;
  quickPick?: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  deadline,
  addTicket,
  onClearBets,
  quickPick,
}) => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  return (
    <View style={styles.header}>
      <Text style={styles.deadlineText}>
        <Text style={styles.deadlineTime}>
          {deadline ? dayjs(deadline).format('YYYY-MM-DD HH:mm') : ''}
        </Text>{' '}
        截止 ,请尽快提交投注
      </Text>

      <View style={styles.headerActions}>
        <Button
          title="+继续选号"
          type="primary"
          size="small"
          textStyle={{fontSize: 16, fontWeight: 'bold'}}
          onPress={() => router.back()}
        />

        <Button
          title="机选一注"
          type="primary"
          size="small"
          textStyle={{fontSize: 16, fontWeight: 'bold'}}
          onPress={async () => {
            try {
              const ln = String(lotteryInfo?.lotteryName || '');
              console.log(ln);
              if (ln === 'SevenStar') {
                useSevenStarStore.getState().quickPick();
                const t = await buildSevenStarTicket();
                if (t) addTicket?.(t);
              } else if (ln === 'ArrangedThree') {
                const store = useArrangedThreeStore.getState();
                // 设置玩法为 直选-定位复式，并调用机选（每个位置选1个号码，相当于单式）
                const rules =
                  ArrangedThreeUIConfig[ArrangedThreePlayEnum.DirectSelection]
                    .subTabs![ArrangedThreeSubPlayEnum.PositioningDuplex]
                    .positionRules!;
                store.setPlayMode(ArrangedThreePlayEnum.DirectSelection);
                store.setSubPlayMode(
                  ArrangedThreeSubPlayEnum.PositioningDuplex,
                );
                store.setRules?.(rules, {
                  play: ArrangedThreePlayEnum.DirectSelection,
                  subPlay: ArrangedThreeSubPlayEnum.PositioningDuplex,
                });
                setTimeout(async () => {
                  store.quickPick();
                  const t = await store.buildTicket();
                  console.log(t);
                  if (t) addTicket?.(t as unknown as DigitalTicket);
                }, 100);
              } else if (ln === 'ArrangedFive') {
                const store = useArrangedFiveStore.getState();
                store.quickPick();
                const t = await store.buildTicket();
                if (t) addTicket?.(t as DigitalTicket);
              } else {
                quickPick?.();
              }
              Toast.show('已添加机选1注');
            } catch {
              Toast.show('机选失败');
            }
          }}
        />
      </View>
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
    marginTop: 5,
  },
});

export default HeaderSection;
