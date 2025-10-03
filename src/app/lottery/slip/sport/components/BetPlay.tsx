import {kScreenHeight, kScreenWidth} from '@/p138-react-common/utils/styles';
import {CustomModal} from '@/p138-react-common/components';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {
  BeijingSingleBettingString,
  FootballBettingString,
} from 'src/shared/constants/bettingString';
import {getBdMxnPlays} from 'src/api/interface/orders-bet';
import {LotteryNameMap} from 'src/modules/lottery/constants';
import {useSlipStore} from '../../store/slipStore';
import {calculateTotalBets} from 'p138-react-common/utils/fuc/lottery/bet';
import {calculatePrize} from 'src/modules/lottery/utils/prizeCalculator';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';

const BetPlay: React.FC = () => {
  const {selectedPassTypes, setSelectedPassTypes, passTypeOptions} =
    useBetInfoStore();
  const {selectedMatches, betPlayActiveTab, matchData} = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();

  // 使用store管理弹窗状态和数据
  const {showPassTypeModal, togglePassTypeModal, setBetInfo} = useSlipStore();

  const [mnArray, setMnArray] = useState<string[]>([]);

  // 临时状态，用于记录弹窗打开时的选中状态
  const [tempSelectedPassTypes, setTempSelectedPassTypes] = useState<string[]>(
    [],
  );

  useEffect(() => {
    if (showPassTypeModal) {
      // 弹窗打开时，初始化临时状态为全局状态
      setTempSelectedPassTypes(selectedPassTypes);
      hasMn().then(res => {
        setMnArray(res);
      });
    }
  }, [showPassTypeModal, selectedPassTypes]);

  const handlePassTypePress = (passType: string) => {
    const isMn = mnArray.includes(passType);

    if (isMn) {
      // 若点击的是 M串N，只保留当前项
      setTempSelectedPassTypes([passType]);
    } else {
      // 如果当前已经选择了 M串N 的某项，需要先清空再选
      setTempSelectedPassTypes(prev => {
        const filtered = prev.filter(p => !mnArray.includes(p));
        return filtered.includes(passType)
          ? filtered.filter(p => p !== passType)
          : [...filtered, passType];
      });
    }
  };

  const hasMn = async () => {
    const count = Object.keys(selectedMatches).length;
    if (lotteryInfo.lotteryName === LotteryNameMap.BeijingSingleMatch) {
      const res = await getBdMxnPlays({
        betPlay: betPlayActiveTab as CommonCommonEnum.BDBetType,
        matchCount: count,
      });
      return res.data || [];
    }
    if (count > 2) {
      return FootballBettingString[count];
    }
    return [];
  };

  // 业务逻辑处理 - 确认选择
  const handleConfirm = async () => {
    const finalSelection = tempSelectedPassTypes.length
      ? tempSelectedPassTypes
      : [passTypeOptions.at(-1)!];

    setSelectedPassTypes(finalSelection);

    // 计算投注信息
    if (finalSelection.length > 0) {
      if (
        SportLotteryType[lotteryInfo?.lotteryName] ===
        SportLotteryTypeEnum.Sport
      ) {
        const betInfo: ServerCommonOrder.BonusCalculatorV2Result | undefined =
          await calculatePrize(
            finalSelection.join('#'),
            selectedMatches,
            matchData,
            lotteryInfo,
          );
        if (betInfo) {
          setBetInfo({
            betsCount: betInfo.data?.number,
            maxPayout: betInfo.data.maxWinAmount,
            minPayout: betInfo.data.minWinAmount,
            betsAmount: betInfo.data.betAmount,
          });
        }
      } else {
        const betInfo = calculateTotalBets(finalSelection, selectedMatches);
        setBetInfo({
          betsCount: betInfo.betsCount,
          maxPayout: betInfo.maxPayout,
          minPayout: betInfo.minPayout,
          betsAmount: betInfo.betsCount * 2,
        });
      }
    }

    togglePassTypeModal();
  };

  const handleCancel = () => {
    // 取消时，仅关闭弹窗，不更新全局状态
    togglePassTypeModal();
  };

  return (
    <View style={styles.container}>
      <CustomModal
        position="bottom"
        isVisible={showPassTypeModal}
        onClose={handleCancel}>
        <View
          className="bg-white rounded-t-[8px] w-full"
          style={{minHeight: 300}}>
          <View className="p-4  w-full  ">
            <Text className="text-[22px]   w-full">自由过关(多选)</Text>
            <View className="flex-wrap gap-2 mt-4 w-full flex-row">
              {passTypeOptions.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.passTypeButton,
                    tempSelectedPassTypes.includes(t) &&
                      styles.selectedPassTypeButton, // 选中时变红
                  ]}
                  onPress={() => handlePassTypePress(t)}>
                  <Text
                    className="text-center text-xs"
                    style={{
                      color: tempSelectedPassTypes.includes(t)
                        ? '#f53b57'
                        : '#333',
                    }}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {mnArray.length > 0 && (
            <View className="p-4">
              <Text className="text-[22px] text-333">M串N(单选)</Text>
              <View className="flex-wrap gap-2 mt-4 w-full flex-row">
                {mnArray.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.passTypeButton,
                      tempSelectedPassTypes.includes(t) &&
                        styles.selectedPassTypeButton, // 选中时变红
                    ]}
                    onPress={() => handlePassTypePress(t)}>
                    <Text
                      className="text-center text-xs"
                      style={{
                        color: tempSelectedPassTypes.includes(t)
                          ? '#f53b57'
                          : '#333',
                      }}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        <View className="flex-row w-full border-t border-gray-200">
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.button,
              {
                backgroundColor: '#fff',
                borderRightWidth: 1,
                borderRightColor: '#ccc',
              },
            ]}
            onPress={handleCancel}>
            <Text className="text-333 text-base">取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.button, {backgroundColor: '#fff'}]}
            onPress={handleConfirm}>
            <Text className="text-[#f53b57] text-base">确定</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  passTypeButton: {
    width: 60,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedPassTypeButton: {
    borderColor: 'red', // 选中时边框变红
    color: 'red',
  },
  button: {
    padding: 10,
    // borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BetPlay;
