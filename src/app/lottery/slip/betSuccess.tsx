import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {AppHeader} from '@/p138-react-common/components';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {isEmpty} from '@/p138-react-common/utils';
import { LotteryTypeEnum } from '@/p138-react-common/constants';

const BetSuccess = () => {
  const {lotteryInfo} = useLotteryInfoStore();
  const {redirectUrl} = useLocalSearchParams<{redirectUrl: string}>();

  console.log(redirectUrl, 'redirectUrl');

  const goBetList = () => {
    if (
      lotteryInfo?.lotteryName === 'SuperLotto' ||
      lotteryInfo?.lotteryName === 'SevenStar'
    ) {
      router.dismissTo({
        pathname: `/lottery/sport/digital?id=${lotteryInfo?.id}&lotteryName=${lotteryInfo?.lotteryName}`,
      });
      return;
    }else if(lotteryInfo?.lotteryType===LotteryTypeEnum.Digital){
      router.dismissTo({
        pathname: `/lottery/sport/digital?id=${lotteryInfo?.id}&lotteryName=${lotteryInfo?.lotteryName}`,
      });
      return;
    } else {
      router.dismissAll();
      router.dismissTo({
        pathname: '/lottery/sport/competitive',
        params: {
          id: lotteryInfo?.id,
          lotteryName: lotteryInfo?.lotteryName,
        },
      });
    }

    // router.navigate({
    //   pathname: '/lottery/sport/competitive',
    //   params: {
    //     id: lotteryInfo?.id,
    //     lotteryName: lotteryInfo?.lotteryName,
    //   },
    // });
  };
  const goRecord = () => {
    if (!isEmpty(redirectUrl)) {
      router.dismissAll();
      router.dismissTo({
        pathname: redirectUrl as string,
      });
      return;
    }
    router.dismissTo('Home');
    router.push({
      pathname: '/order/bet/record',
      params: {
        tabType: 0,
      },
    });
  };

  const goHome = () => {
    router.dismissAll();
    router.dismissTo({
      pathname: '/Home',
    });
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader
        title="投注成功"
        leftComponent={<></>}
        rightComponent={
          <TouchableOpacity onPress={goHome}>
            <Text style={{color: '#fff'}}>首页</Text>
          </TouchableOpacity>
        }
      />
      <View style={{flex: 1}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('src/assets/imgs/login/icon_circle_sel.png')}
            style={{width: 40, height: 40}}
          />
          <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>
            恭喜您投注成功
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginTop: 10,
              textAlign: 'center',
              color: '#999',
            }}>
            您可以继续投注，也可以查看记录
          </Text>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payButton, {backgroundColor: '#f53b57'}]}
            onPress={goBetList}>
            <Text style={styles.payButtonText}>继续投注</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.payButton,
              {
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#f53b57',
              },
            ]}
            onPress={goRecord}>
            <Text style={[styles.payButtonText, {color: '#f53b57'}]}>
              查看记录
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  footer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 100,
  },
  payButton: {
    backgroundColor: '#f53b57',
    paddingVertical: 10,
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BetSuccess;
