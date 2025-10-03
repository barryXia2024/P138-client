import {AppHeader, ZTextInput} from '@/p138-react-common/components';

import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {trackAchievements} from 'src/api/interface/orders-follow-hall';
import {getOrderFollowSetting} from 'src/api/interface/orders-follow-hall-follow-setting';
import {subscribeFollowApi} from 'src/api/interface/orders-follow-hall-follow-subscribe';

import UserFollowInfoHeader from 'src/modules/follow/components/UserFollowInfoHeader';
import {useUserStore} from 'src/store';

const FollowAmountSection = () => {
  const [orderFollowSetting, setOrderFollowSetting] =
    useState<ServerCommonRepo.OrderFollowSetting>();
  // tab: 0=固定金额, 1=倍投
  const [tab, setTab] = useState(0);
  const {targetUserId, targetShopCode} = useLocalSearchParams<{
    targetUserId: string;
    targetShopCode: string;
  }>();
  // 固定金额
  const [amount, setAmount] = useState('');
  const [periods, setPeriods] = useState('5');
  const [stopOnWin, setStopOnWin] = useState(false);
  const {loginInfo} = useUserStore();

  // 倍投
  const [multiFirstAmount, setMultiFirstAmount] = useState('');
  const [multiStopOnWin, setMultiStopOnWin] = useState(false);
  const [trackAchievementsResult, setTrackAchievementsResult] =
    useState<CommonFollowHall.GetTrackAchievementsResult>();

  // 计算倍投金额
  const multiAmounts: string[] = [];
  let prev = Number(multiFirstAmount) || 0;
  for (let i = 0; i < 5; i++) {
    if (i === 0) {
      multiAmounts.push(multiFirstAmount);
    } else {
      prev = prev * 2;
      multiAmounts.push(prev ? String(prev) : '');
    }
  }
  useEffect(() => {
    trackAchievements({
      shopCode: Number(targetShopCode),
      userID: targetUserId,
    }).then(res => {
      setTrackAchievementsResult(res.data);
    });
    getOrderFollowSetting().then(res => {
      console.log(res.data, 'res.data');
      setOrderFollowSetting(res.data);
      setPeriods(res.data?.autoStopMultiple.toString() || '5');
      setStopOnWin(res.data?.stopAfterWin || false);
    });
  }, [targetUserId, targetShopCode]);

  const handleSubmit = () => {
    if (tab === 0) {
      if (
        orderFollowSetting?.subscribeMinAmount &&
        Number(amount) < Number(orderFollowSetting?.subscribeMinAmount)
      ) {
        Toast.show(
          `跟单金额不能小于最小跟单金额${orderFollowSetting?.subscribeMinAmount}`,
        );
        return;
      }
      subscribeFollowApi({
        afterCountAutoStop: Number(periods),
        subscribeMinAmount: amount,
        stopAfterWin: stopOnWin,
        subscribeType: tab === 0 ? 1 : 2,
        subscriberUserID: loginInfo?.userID,
        subscribedUserID: targetUserId,
      }).then(res => {
        if (res.success) {
          Toast.show('订阅成功');
          router.back();
        }
      });
    } else {
      if (
        orderFollowSetting?.subscribeMinAmount &&
        Number(multiFirstAmount) <
          Number(orderFollowSetting?.subscribeMinAmount)
      ) {
        Toast.show(
          `跟单金额不能小于最小跟单金额${orderFollowSetting?.subscribeMinAmount}`,
        );
        return;
      } else {
        subscribeFollowApi({
          afterCountAutoStop: 5,
          subscribeMinAmount: multiFirstAmount,
          stopAfterWin: multiStopOnWin,
          subscribeType: 2,
          subscriberUserID: loginInfo?.userID,
          subscribedUserID: targetUserId,
        }).then(res => {
          if (res.success) {
            Toast.show('订阅成功');
            router.back();
          }
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="跟单订阅"
        rightComponent={
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/follow/help',
              })
            }>
            <Text className="text-white">帮助</Text>
          </TouchableOpacity>
        }
      />
      <UserFollowInfoHeader
        trackAchievementsResult={trackAchievementsResult}
        variant={'other'}
      />

      {/* 固定金额区块 */}
      <View className="bg-white p-4 rounded-md mt-2">
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 0 && styles.tabActive]}
            onPress={() => setTab(0)}>
            <Text style={[styles.tabText, tab === 0 && styles.tabTextActive]}>
              固定金额
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 1 && styles.tabActive]}
            onPress={() => setTab(1)}>
            <Text style={[styles.tabText, tab === 1 && styles.tabTextActive]}>
              倍投
            </Text>
          </TouchableOpacity>
        </View>
        {tab === 0 && (
          <>
            <View style={styles.inputRow}>
              <Text style={styles.label}>每期跟单金额：</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.label}>元</Text>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>连续</Text>
              <ZTextInput
                style={[{width: 30, padding: 0, lineHeight: 30}]}
                value={periods}
                onChangeText={setPeriods}
                keyboardType="numeric"
              />
              <Text style={styles.label}>期不中停止跟单</Text>
              <Text style={{color: 'red', marginLeft: 2, fontSize: 12}}>!</Text>
            </View>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setStopOnWin(!stopOnWin)}
              activeOpacity={0.8}>
              <View
                style={[styles.checkbox, stopOnWin && styles.checkboxChecked]}>
                {stopOnWin && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.label}>中奖后，自动停止跟单</Text>
            </TouchableOpacity>
          </>
        )}

        {/* 倍投区块 */}
        {tab === 1 && (
          <>
            {[0, 1, 2, 3, 4].map(idx => (
              <View style={styles.inputRow} key={idx}>
                <Text style={styles.label}>{`第${idx + 1}期跟单金额：`}</Text>
                {idx === 0 ? (
                  <TextInput
                    style={styles.input}
                    value={multiFirstAmount}
                    onChangeText={setMultiFirstAmount}
                    keyboardType="numeric"
                  />
                ) : (
                  <Text
                    style={[
                      styles.input,
                      {
                        textAlignVertical: 'center',
                        textAlign: 'left',
                        paddingTop: 6,
                        backgroundColor: '#f7f7f7',
                      },
                    ]}>
                    {multiAmounts[idx]}
                  </Text>
                )}
                <Text style={styles.label}>元</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setMultiStopOnWin(!multiStopOnWin)}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.checkbox,
                  multiStopOnWin && styles.checkboxChecked,
                ]}>
                {multiStopOnWin && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.label}>中奖后，自动停止跟单</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 温馨提示 */}
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>温馨提示</Text>
        <Text style={styles.tipsText}>
          钱包余额不足，会导致跟单失败，因余额不足导致跟单失败，自行承担。
        </Text>
      </View>
      <TouchableOpacity style={styles.autoBtn} onPress={handleSubmit}>
        <Text style={styles.autoBtnText}>自动跟单</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#f0f0f0'},
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    alignItems: 'center',
  },
  tabActive: {backgroundColor: '#f53b57', marginRight: 0},
  tabText: {color: '#333', fontSize: 15},
  tabTextActive: {color: '#fff', fontWeight: 'bold'},
  inputRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  label: {color: '#333', fontSize: 15},
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginHorizontal: 6,
    width: 80,
    height: 32,
    color: '#333',
    fontSize: 15,
  },
  checkboxRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {borderColor: '#f53b57', backgroundColor: '#f53b57'},
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tipsBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  tipsTitle: {color: '#333', fontWeight: 'bold', marginBottom: 2},
  tipsText: {color: '#666', fontSize: 13},
  autoBtn: {
    backgroundColor: '#f53b57',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 8,
  },
  autoBtnText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default FollowAmountSection;
