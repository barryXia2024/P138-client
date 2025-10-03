
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import {getTimeSportsLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import TabSwitcher from '@/p138-react-common/components/TabSwitcher';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';

import CompetitionCardAdapter from 'src/modules/lottery/sport/competitionCard';

const SportLotteryList: React.FC = () => {
  const {resetStore, setMatchData} = useBetInfoStore();
  const [betPlayActiveTab, setBetPlayActiveTab] = useState<number>(0);

  const {lotteryInfo} = useLotteryInfoStore();
  const [lotteryData, setLotteryData] = useState<
    LotteryDataSource.TimeSportsLotteryResult[]
  >([]);

  // 获取彩票数据
  const fetchLotteryData = useCallback(async () => {
    try {
      const res = await getTimeSportsLotteryData({
          lotteryName: lotteryInfo?.lotteryName as CoreCommonEnum.LotteryName,
      });
      console.log('res=====', res);

      if (res.success && res.data) {
        const sortedData = res.data.sort(
          (a, b) => parseInt(a.date, 10) - parseInt(b.date, 10),
        );
        setLotteryData(sortedData);

        // 批量更新比赛数据
        const matchDataUpdates = res.data.flatMap(
          group =>
            group.timeSportsLottery?.map(match => ({
              key: match.competitionId.toString(),
              value: match,
            })) || [],
        );

        matchDataUpdates.forEach(({key, value}) => {
          setMatchData(key, value);
        });
      }
    } catch (error) {}
  }, [lotteryInfo?.lotteryName, setMatchData]);

  useEffect(() => {
    fetchLotteryData();
    return () => resetStore();
  }, [fetchLotteryData, resetStore]);

  // 使用 useMemo 缓存 TabSwitcher 数据
  const tabData = useMemo(
    () =>
      lotteryData.map((data, index) => ({
        label: `${data.date} (销售中)`,
        key: index,
      })),
    [lotteryData],
  );

  // 使用 useMemo 缓存当前选中的彩票数据
  const currentLotteryData = useMemo(
    () => lotteryData[betPlayActiveTab]?.timeSportsLottery || [],
    [lotteryData, betPlayActiveTab],
  );

  // 使用 useMemo 缓存截止时间
  const endTime = useMemo(
    () => currentLotteryData[0]?.buyEndTime || '',
    [currentLotteryData],
  );

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      {lotteryData.length > 0 && (
        <>
          <TabSwitcher
            tabs={tabData}
            tabClassName='flex-none px-3'
            activeTab={betPlayActiveTab}
            onTabPress={(index)=>{
              resetStore()
              setBetPlayActiveTab(index)
            }}
          />
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              截止时间：
              <Text style={{color: themeRedColor}}>{endTime} </Text>
            </Text>
          </View>
          <FlatList
            className="mx-[10px] gap-2 flex-1"
            data={currentLotteryData}
            keyExtractor={competition => competition.competitionId.toString()}
            renderItem={({item:competition}) => {
              return <CompetitionCardAdapter competition={competition} />;
            }}
            contentContainerStyle={styles.matchListContent}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  matchListContent: {
    paddingBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fef9f9',
    marginTop: 10,
    marginHorizontal: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default React.memo(SportLotteryList);
