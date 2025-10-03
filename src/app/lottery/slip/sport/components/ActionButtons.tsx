import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';

import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';
import {useLotteryInfoStore, useBetInfoStore} from 'src/modules/lottery/store';
import {useCreateOrder} from '../../store/createOrder';
import {useSlipStore} from '../../store/slipStore';
import {useUserStore} from 'src/store/user';
import {router, useLocalSearchParams} from 'expo-router';
import {listCustomLotteryApi} from 'src/api/interface/lottery-lottery-type';
import {getOrderFollowSetting} from 'src/api/interface/orders-follow-hall-follow-setting';
import {parseOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
  SportPlayNameMap,
} from 'src/modules/lottery/constants';
import {Button} from '@/p138-react-common/components';

const ActionButtons = (props: {loading: boolean}) => {
  const {loading} = props;

  const {isSave, play} = useLocalSearchParams();
  const {lotteryInfo} = useLotteryInfoStore();
  const {saveOrder} = useCreateOrder();
  const {userInfo, shopInfo} = useUserStore();
  const {multiplier, selectedMatches, matchData, resetStore, betPlayActiveTab} =
    useBetInfoStore();
  const {betInfo} = useSlipStore();

  // 验证4或6场比赛数量
  const validateMatchCount = () => {
    if (
      ['GameTotalGoalsBet4', 'HalfTimeFullTimeBet6'].includes(
        lotteryInfo?.lotteryName as string,
      )
    ) {
      const array = Object.values(selectedMatches).filter(
        item => item.length > 1,
      );
      const minMatchCount =
        lotteryInfo?.lotteryName === 'GameTotalGoalsBet4' ? 4 : 6;

      if (array.length < minMatchCount) {
        Toast.show(
          `请选择全部${minMatchCount}场比赛主队和客队总进球数进行投注`,
        );
        return false;
      }
    }
    return true;
  };

  // 提交投注
  const handleSubmit = async () => {
    if (!userInfo?.realName) {
      Toast.show('请先实名认证');
      router.push({
        pathname: '/personCenter/realAuth',
      });
      return;
    }

    const res = await listCustomLotteryApi({
      shopCode: shopInfo?.shopCode || 0,
    });

    const minBetAmount = res.data?.find(
      item => item.lotteryName === lotteryInfo?.lotteryName,
    )?.minBetAmount;

    if (!validateMatchCount()) {
      return;
    }

    if (lotteryInfo?.lotteryName === 'WinLossLottery') {
      if (Object.values(selectedMatches).length < 14) {
        Toast.show(`请选择全部14场比赛进行投注`);
        return;
      }
    }

    if (lotteryInfo?.lotteryName === 'ChooseNine') {
      if (Object.values(selectedMatches).length < 9) {
        Toast.show(`请选择全部9场比赛进行投注`);
        return;
      }
    }

    const amount = betInfo.betsAmount * multiplier;
    console.log('amount', amount, minBetAmount);
    if (amount < parseFloat(minBetAmount ?? '20')) {
      Toast.show(`投注金额不能少于${minBetAmount ?? 20}元`);
      return;
    }

    const playName = isSave === '1' ? play : SportPlayNameMap[betPlayActiveTab];
    router.push({
      pathname: '/lottery/slip/payConfirm',
      params: {
        lottery: lotteryInfo?.lotteryName,
        play: playName,
        id: lotteryInfo?.id,
        jcBetsInfoString: JSON.stringify(betInfo),
      },
    });
  };

  // 保存投注
  const handleSave = () => {
    if (!validateMatchCount()) {
      return;
    }

    const keys = Object.keys(selectedMatches);
    const compivisions = keys.map(key => {
      let value = matchData[key];
      value.handicapDtos = getHandicapDtos(
        value.handicapDtos,
        selectedMatches[key],
      );
      return value;
    });
    const dict = {
      amount: betInfo.betsAmount * multiplier,
      betAmount: {
        betsCount: betInfo.betsCount,
        maxPayout: betInfo.maxPayout,
        minPayout: betInfo.minPayout,
        betsAmount: betInfo.betsAmount,
      },
      play: SportPlayNameMap[betPlayActiveTab],
      orderType: 1 as CoreCommonEnum.OrderType,
      orderStatus: 1 as CoreCommonEnum.OrderStatus,
      frontEndOnly: JSON.stringify(compivisions),
    };

    if (saveOrder) {
      saveOrder(dict)?.then(res => {
        if (res.success) {
          resetStore();
          if (Platform.OS === 'web') {
            router.dismissAll();
          }
          router.dismissTo({
            pathname: '/order/bet/detail',
            params: {
              orderId: res.data?.orderId,
            },
          });
        }
      });
    }
  };

  // 创建跟单
  const handleCreateFollow = () => {
    if (!userInfo?.realName) {
      Toast.show('请先实名认证');
      router.push({
        pathname: '/personCenter/realAuth',
      });
      return;
    }
    getOrderFollowSetting().then(res => {
      const amountLimit = res.data?.amountLimit ?? '0';
      if (Number(amountLimit) > betInfo.betsAmount * multiplier) {
        Toast.show(`发单金额不能少于${amountLimit}元`);
        return;
      }
      router.push({
        pathname: '/lottery/follow/create',
        params: {
          betsInfo: JSON.stringify(betInfo),
          commissionRate: res.data?.commissionRate,
        },
      });
    });
  };

  const getHandicapDtos = (
    handicapDtos: LotteryDataSource.HandicapDto[] | null,
    selectKeys: string[],
  ) => {
    const filteredHandicapDtos = handicapDtos?.filter(handicap =>
      selectKeys.some(key => {
        const {playChineseName} = parseOddsCellKey(key);
        return handicap.playChineseName === playChineseName;
      }),
    );
    return handicapDtos;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        {isSave !== '1' && (
          <CustomAlertDialog
            title="提示"
            trigger={
              <Button
                loading={loading}
                title="保存"
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
                type="default"
              />
            }
            description="保存方案后续可以转为投注方案，也可以不投注等开奖后验证您的思路。确定保存吗？"
            onConfirm={handleSave}
          />
        )}

        {lotteryInfo?.billingSwitch === 1 &&
          SportLotteryType[lotteryInfo?.lotteryName] ===
            SportLotteryTypeEnum.Sport && (
            <Button
              loading={loading}
              title="发单"
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              onPress={handleCreateFollow}
              type="default"
            />
          )}
      </View>

      <Button
        loading={loading}
        title="确认投注"
        style={styles.primaryButton}
        onPress={handleSubmit}
        type="primary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    gap: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#f53b57',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#f53b57',
  },
  primaryButton: {
    backgroundColor: '#f53b57',
  },
});

export default ActionButtons;
