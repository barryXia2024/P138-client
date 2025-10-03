import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ViewStyle,
  ActivityIndicator,
  ScrollView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import {getFootBallCompetitionStatistic} from 'src/api/interface/competition-football';
import {useLiveStore} from 'src/store';

export const StatisticsBar: React.FC<CompetitionProps.StatisticsBarProps> = ({
  home,
  away,
  label,
}) => {
  const getValue = (value: string | number) => {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  };
  const homeValue = getValue(home);
  const awayValue = getValue(away);
  const total = homeValue + awayValue === 0 ? 1 : homeValue + awayValue;
  const homePercent = homeValue / total;
  const awayPercent = awayValue / total;
  return (
    <View style={{marginBottom: 16}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
        <Text style={{width: 40, textAlign: 'right', color: '#e55'}}>
          {home}
        </Text>
        {/* 左右对称进度条 */}
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            height: 16,
            marginHorizontal: 4,
          }}>
          {/* 左侧（灰色+红色） */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: 16,
              borderRadius: 8,
              overflow: 'hidden',
            }}>
            {/* 灰色（左端圆角） */}
            <View
              style={{
                width: `100%`,
                backgroundColor: '#eee',
                height: 16,
                // borderRadius: 8,
                // borderBottomLeftRadius: 8,
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  width: `${homePercent * 100}%`,
                  backgroundColor: '#e55',
                  height: 16,
                  borderRadius: 8,
                }}
              />
            </View>
            {/* 红色（无圆角） */}
          </View>
          {/* 中间文字 */}
          <View
            style={{
              width: 60,
              justifyContent: 'center',
              alignItems: 'center',
              height: 16,
              backgroundColor: 'transparent',
            }}>
            <Text style={{color: '#333', fontSize: 13}}>{label}</Text>
          </View>
          {/* 右侧（蓝色+灰色） */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              height: 16,
              borderRadius: 8,
              overflow: 'hidden',
            }}>
            {/* 灰色（右端圆角） */}
            <View
              style={{
                width: `100%`,
                backgroundColor: '#eee',
                height: 16,

                //   alignItems: 'flex-end'
              }}>
              <View
                style={{
                  width: `${awayPercent * 100}%`,
                  backgroundColor: '#3a8bff',
                  height: 16,
                  borderRadius: 8,
                }}
              />
            </View>
          </View>
        </View>
        <Text style={{width: 40, textAlign: 'left', color: '#3a8bff'}}>
          {away}
        </Text>
      </View>
    </View>
  );
};

export const BasketballCompetitionStatistics = ({
  liveInfo,
}: {
  liveInfo?: ServerCommonLive.BasketBallCompetition;
}) => {
  const {currentMatch} = useLiveStore();

  // 解析比分数据
  const parseScore = (score: string) => {
    const [home, away] = score.split(':').map(Number);
    return {home, away};
  };

  const totalScore = parseScore(liveInfo?.matchScore ?? '');
  const sectionOne = parseScore(liveInfo?.sectionOneScore ?? '');
  const sectionTwo = parseScore(liveInfo?.sectionTwoScore ?? '');
  const sectionThree = parseScore(liveInfo?.sectionThreeScore ?? '');
  const sectionFour = parseScore(liveInfo?.sectionFourScore ?? '');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>各节比分</Text>
      <View style={styles.table}>
        <View style={[styles.row, {backgroundColor: '#f0f0f0'}]}>
          <Text style={styles.cell}>球队</Text>
          <Text style={styles.cell}>第一节</Text>
          <Text style={styles.cell}>第二节</Text>
          <Text style={styles.cell}>第三节</Text>
          <Text style={styles.cell}>第四节</Text>
          <Text style={styles.cell}>总分</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{currentMatch?.home}</Text>
          <Text style={styles.cell}>{sectionOne.home}</Text>
          <Text style={styles.cell}>{sectionTwo.home}</Text>
          <Text style={styles.cell}>{sectionThree.home}</Text>
          <Text style={styles.cell}>{sectionFour.home}</Text>
          <Text style={styles.cell}>{totalScore.home}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>{currentMatch?.away}</Text>
          <Text style={styles.cell}>{sectionOne.away}</Text>
          <Text style={styles.cell}>{sectionTwo.away}</Text>
          <Text style={styles.cell}>{sectionThree.away}</Text>
          <Text style={styles.cell}>{sectionFour.away}</Text>
          <Text style={styles.cell}>{totalScore.away}</Text>
        </View>
      </View>
    </View>
  );
};

export const CompetitionStatistics = ({
  competitionType,
}: {
  competitionType?: ServerCommonLive.CompetitionType;
}) => {
  const {currentMatch} = useLiveStore();
  const [statisticList, setStatisticList] =
    useState<ServerCommonLive.GetFootBallCompetitionStatisticResult>();
  const [loading, setLoading] = useState(false);
  const away = statisticList?.statisticList?.[0];
  const home = statisticList?.statisticList?.[1];
  const statMap = [
    {
      label: '控球率',
      home: home?.possession ?? 0 + '',
      away: away?.possession ?? 0 + '',
    },
    {
      label: '进球数',
      home: home?.goalNum ?? 0 + '',
      away: away?.goalNum ?? 0 + '',
    },
    {
      label: '失球数',
      home: home?.loseNum ?? 0 + '',
      away: away?.loseNum ?? 0 + '',
    },
    {
      label: '射门',
      home: home?.shootNum ?? 0 + '',
      away: away?.shootNum ?? 0 + '',
    },
    {
      label: '射正',
      home: home?.shootTargetNum ?? 0 + '',
      away: away?.shootTargetNum ?? 0 + '',
    },
    {
      label: '进攻数',
      home: home?.attack ?? 0 + '',
      away: away?.attack ?? 0 + '',
    },
    {
      label: '危险进攻',
      home: home?.dangerousAttack ?? 0 + '',
      away: away?.dangerousAttack ?? 0 + '',
    },
    {
      label: '角球数',
      home: home?.cornNum ?? 0 + '',
      away: away?.cornNum ?? 0 + '',
    },
    {
      label: '黄牌数',
      home: home?.yellowNum ?? 0 + '',
      away: away?.yellowNum ?? 0 + '',
    },
    {
      label: '红牌数',
      home: home?.redNum ?? 0 + '',
      away: away?.redNum ?? 0 + '',
    },
  ];

  useEffect(() => {
    setLoading(true);
    getFootBallCompetitionStatistic({
      competitionID: currentMatch?.competitionId ?? 0,
      competitionType: competitionType ?? 'JC',
      lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
    }).then(res => {
      setStatisticList(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
          marginLeft: 15,
        }}>
        赛事统计
      </Text>
      {statMap.map(item => (
        <StatisticsBar
          key={item.label}
          home={item.home}
          away={item.away}
          label={item.label}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    textAlign: 'center',
  },
});
