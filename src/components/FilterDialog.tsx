import { View, Text, TouchableOpacity, Platform, Dimensions, ScrollView } from 'react-native';
import { XStack } from 'tamagui';
import { useSportsCompetitionFilterStore } from '../store/lottery/filter';
import {CustomModal} from '@/p138-react-common/components';
import { CheckboxWithLabel } from '@/p138-react-common/components/checkBox';
import { useState, useEffect, useMemo } from 'react';
import { kScreenHeight } from '@/p138-react-common/utils/styles';

const ODDS_OPTIONS = [
  { label: '赔率<1.50', value: 'under1.5' },
  { label: '赔率1.50~2.00', value: '1.5to2' },
  { label: '赔率>2.00', value: 'above2' },
] as const;

// 获取屏幕高度
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

export const FilterDialog = ({
  isVisible,
  matchData,
  setIsFilterDialogVisible,
  gameType = 'FootballLottery',
}: {
  isVisible: boolean;
  matchData?: LotteryDataSource.TimeSportsLotteryResult[];
  setIsFilterDialogVisible: (isFilterDialogVisible: boolean) => void;
  gameType?: CommonCommonEnum.LotteryName;
}) => {
  const {
    selectedLeagues,
    selectedOddsRanges,
    onlyWinDrawLose,
    setSelectedLeagues,
    setSelectedOddsRanges,
    setOnlyWinDrawLose,
  } = useSportsCompetitionFilterStore();

  // 临时存储选择的数据
  const [tempLeagues, setTempLeagues] = useState<string[]>([]);
  const [tempOddsRanges, setTempOddsRanges] = useState<string[]>([]);
  const [tempOnlyWinDrawLose, setTempOnlyWinDrawLose] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  // 从数据中提取所有唯一的联赛名称
  const availableLeagues = useMemo(() => {
    if (!matchData?.length) return [];

    const leagueSet = new Set<string>();
    matchData?.forEach(match => {
      // 遍历 timeSportsLottery 数组
      match?.timeSportsLottery?.forEach(lottery => {
        if (lottery?.leagueName && typeof lottery.leagueName === 'string') {
          leagueSet.add(lottery.leagueName);
        }
      });
    });

    return Array.from(leagueSet);
  }, [matchData]);

  // 当弹窗打开时，初始化临时数据
  useEffect(() => {
    if (isVisible) {
      if (isFirstOpen) {
        // 首次打开默认全选
        setTempLeagues(availableLeagues);
        setIsFirstOpen(false);
      } else if (selectedLeagues.length === 0) {
        setTempLeagues([]);
      } else {
        // 只保留当前可用的联赛
        const filteredLeagues = selectedLeagues.filter(league => availableLeagues.includes(league));
        setTempLeagues(filteredLeagues);
      }

      // 只在足球模式下设置这些选项
      if (gameType === 'FootballLottery') {
        setTempOddsRanges(selectedOddsRanges);
        setTempOnlyWinDrawLose(onlyWinDrawLose);
      }
    }
  }, [isVisible, availableLeagues, selectedLeagues, isFirstOpen, gameType]);

  // 临时操作函数
  const tempToggleLeague = (league: string) => {
    setTempLeagues(prev =>
      prev.includes(league) ? prev.filter(l => l !== league) : [...prev, league]
    );
  };

  const tempSelectAllLeagues = () => {
    setTempLeagues(availableLeagues);
  };

  const tempUnselectAllLeagues = () => {
    setTempLeagues([]);
  };

  const tempSelectTopLeagues = () => {
    if (gameType === 'BasketballLottery') {
      // 篮球选择 NBA 和 CBA
      const topBasketball = ['NBA', 'CBA'].filter(league => availableLeagues.includes(league));
      setTempLeagues(topBasketball.length ? topBasketball : []);
    } else {
      // 足球选择五大联赛
      const topFive = ['英超', '西甲', '德甲', '意甲', '法甲'].filter(league =>
        availableLeagues.includes(league)
      );
      setTempLeagues(topFive.length ? topFive : []);
    }
  };

  const tempToggleOddsRange = (range: string) => {
    setTempOddsRanges(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  // 确认按钮处理函数
  const handleConfirm = () => {
    setSelectedLeagues(tempLeagues);
    // 只在足球模式下设置这些选项
    if (gameType === 'FootballLottery') {
      setSelectedOddsRanges(tempOddsRanges);
      setOnlyWinDrawLose(tempOnlyWinDrawLose);
    }
    setIsFilterDialogVisible(false);
  };

  // 清空所有选项
  const handleClear = () => {
    setTempLeagues([]);
    if (gameType === 'FootballLottery') {
      setTempOddsRanges([]);
      setTempOnlyWinDrawLose(false);
    }
  };

  return (
    <CustomModal
      position='bottom'
      onClose={() => setIsFilterDialogVisible(false)}
      height={kScreenHeight*0.6}
      isVisible={isVisible}>
      <View className='bg-white w-full h-full'  >
        <ScrollView
          style={{ maxHeight: MAX_HEIGHT, minHeight: 300 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}>
          <View className='bg-white p-4'>
            {/* 联赛筛选 */}
            <View>
              <XStack space='$4'>
                <TouchableOpacity
                  style={styles.button}
                  onPress={tempSelectAllLeagues}>
                  <Text style={{ color: '#000' }}>全选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={tempUnselectAllLeagues}>
                  <Text style={{ color: '#000' }}>反选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={tempSelectTopLeagues}>
                  <Text style={{ color: '#000' }}>
                    {gameType === 'BasketballLottery' ? 'NBA/CBA' : '五大联赛'}
                  </Text>
                </TouchableOpacity>
              </XStack>
              <XStack style={styles.leagueGrid}>
                {availableLeagues.map(league => (
                  <TouchableOpacity
                    key={league}
                    activeOpacity={1}
                    style={{
                      borderRadius: 10,
                      padding: 10,
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: tempLeagues.includes(league) ? 'red' : '#ccc',
                      width: '30%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                    onPress={() => tempToggleLeague(league)}>
                    <Text
                      style={{
                        color: tempLeagues.includes(league) ? 'red' : '#000',
                      }}>
                      {league}
                    </Text>
                  </TouchableOpacity>
                ))}
              </XStack>
            </View>

            {/* 只在足球模式下显示赔率筛选和胜平负选项 */}
            {gameType === 'FootballLottery' && (
              <View>
                {/* 赔率筛选 */}
                <View className='gap-2 mt-4'>
                  <Text>胜平负最低赔率</Text>
                  <XStack
                    flexWrap='wrap'
                    gap='$2'>
                    {ODDS_OPTIONS.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.button,
                          tempOddsRanges.includes(option.value) && {
                            borderColor: 'red',
                          },
                        ]}
                        onPress={() => tempToggleOddsRange(option.value)}>
                        <Text style={{ color: '#000' }}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </XStack>
                </View>

                {/* 只显示胜平负 */}
                <View className='mt-4'>
                  <CheckboxWithLabel
                    checked={tempOnlyWinDrawLose}
                    onCheckedChange={checked => setTempOnlyWinDrawLose(checked === true)}
                    label='只显示胜平负单关'
                    width={200}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View className='flex-row justify-between w-full border-t border-gray-200'>
          <TouchableOpacity
            style={[styles.button, { borderRadius: 0, height: 55 }]}
            onPress={handleClear}>
            <Text style={{ color: '#000', fontSize: 16 }}>清空所有选项</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { borderRadius: 0, height: 55 }]}
            onPress={handleConfirm}>
            <Text style={{ color: 'red', fontSize: 16 }}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

const styles = {
  leagueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
  },
} as const;
