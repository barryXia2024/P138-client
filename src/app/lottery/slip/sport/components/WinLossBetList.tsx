import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {getTimeSportsLotteryData} from 'src/api/interface/lottery-lottery-type-data';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import CompetitionCardAdapter from 'src/modules/lottery/sport/competitionCard';

const WinLossBetList: React.FC = () => {
  const {resetStore, setMatchData, setGroupedMatches} = useBetInfoStore(); // 获取 `setMatchData` 和 `setGroupedMatches`
  const {lotteryInfo} = useLotteryInfoStore();
  const [lotteryData, setLotteryData] = useState<
    LotteryDataSource.TimeSportsLotteryResult[]
  >([]); // 彩票数据

  // 获取彩票数据并存储到zustand store
  useEffect(() => {
    getTimeSportsLotteryData({
      lotteryName: lotteryInfo?.lotteryName!,
    })
      .then(res => {
        if (res.success && res.data) {
          // if (lotteryInfo?.lotteryName === 'WinLossLottery') {
          //   data == sfcai.data;
          // }
          setLotteryData(
            res.data.sort(
              (a, b) => parseInt(a.date, 10) - parseInt(b.date, 10),
            ),
          );
          // 将比赛数据按日期和联赛进行分组
          res.data.forEach(group => {
            group.timeSportsLottery?.forEach(match => {
              const matchId = match.competitionId;
              // 存储比赛信息
              setMatchData(matchId.toString(), match);
            });
          });
        }
      })
      .catch(() => {});
  }, [lotteryInfo?.lotteryName, resetStore, setMatchData, setGroupedMatches]);
  console.log(lotteryData);
  return (
    <View style={styles.container}>
      {lotteryData.length > 0 && (
        <FlatList
          style={{marginHorizontal: 10}}
          data={lotteryData[0].timeSportsLottery}
          keyExtractor={competition => competition.competitionId.toString()} // 使用 competitionId 作为 key
          renderItem={({
            item: competition,
          }: {
            item: LotteryDataSource.MatchInfo;
          }) => (
            <CompetitionCardAdapter
              competition={competition}
              key={competition.competitionId}
              isMatchBetList
            />
          )}
          contentContainerStyle={styles.matchList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  matchList: {
    paddingBottom: 20,
  },
});

export default React.memo(WinLossBetList);
