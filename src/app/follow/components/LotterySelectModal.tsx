import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomModal} from '@/p138-react-common/components';
import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {kScreenHeight} from '@/p138-react-common/utils/styles';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
 
} from 'src/modules/lottery/constants';
 
/**
 * 彩票选择弹窗组件的属性
 */
interface LotterySelectModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 彩票列表数据 */
  lotteryList: ServerCommonLottery.ListCustomLotteryResult[];
  /** 关闭弹窗的回调 */
  onClose: () => void;
  /** 选择彩票的回调 */
  onLotterySelect: (
    lottery: ServerCommonLottery.ListCustomLotteryResult,
  ) => void;
}

/**
 * 彩票选择弹窗组件
 *
 * 用于在跟单页面中选择彩票类型
 */
const LotterySelectModal: React.FC<LotterySelectModalProps> = ({
  isVisible,
  lotteryList,
  onClose,
}) => {
  const {setLotteryInfo} = useLotteryInfoStore();
 
  const onPress = (lottery: ServerCommonLottery.ListCustomLotteryResult) => {

    setLotteryInfo(lottery);
    onClose();
    if (SportLotteryType[lottery.lotteryName] === SportLotteryTypeEnum.Sport) {
      router.push({
        pathname: '/lottery/sport/competitive',
        params: {
          id: lottery.id,
          lotteryName: lottery.lotteryName,
        },
      });
    } else if (
      SportLotteryType[lottery.lotteryName] === SportLotteryTypeEnum.Traditional
    ) {
      router.push({
        pathname: '/lottery/sport/traditional',
        params: {
          id: lottery.id,
          lotteryName: lottery.lotteryName,
        },
      });
    } else {
      Toast.show('该功能暂未开放');
    }
  };
  return (
    <CustomModal position="left" isVisible={isVisible} onClose={onClose}>
      <View style={styles.container}>
        {lotteryList
          .filter(item => item.billingSwitch === 1)
          .map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onPress(item)}
              style={styles.lotteryItem}>
              <OSSImage
                source={{uri: item.lotteryIcon}}
                style={IMAGE_SIZE.IMAGE_SIZE50}
              />
              <Text style={styles.lotteryName}>{item.lotteryChineseName}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    gap: 32,
    height: kScreenHeight,
    width: '50%',
  },
  lotteryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lotteryName: {
    fontSize: 20,
    color: '#333',
  },
});

export default LotterySelectModal;
