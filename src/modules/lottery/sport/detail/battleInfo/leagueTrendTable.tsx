import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFootballLeagueTrend } from 'src/api/interface/competition-football';
import { useLiveStore } from 'src/store';

type LeagueTrendItem = {
  teamId: number;
  tableType: number; // 1: 主场, 2: 客场, 3: 总计
  playNum: number;
  winNum: number;
  drawNum: number;
  lostNum: number;
  winPercent: string;
  bigNum: number;
  bigPercent: string;
  smallNum: number;
  smallPercent: string;
};



// 映射原始数据为结构化对象
const mapTrendList = (list: LeagueTrendItem[]) => {
  return list.reduce((acc, item) => {
    const typeMap = { 1: 'home', 2: 'away', 3: 'total' } as const;
    const key = typeMap[item.tableType as keyof typeof typeMap];
    acc[key] = {
      total: item.playNum,
      win: item.winNum,
      draw: item.drawNum,
      lose: item.lostNum,
      big: item.bigNum,
      small: item.smallNum,
    };
    return acc;
  }, {} as Record<'home' | 'away' | 'total', any>);
};

// 表头组件
const TableHeader = ({ headers }: { headers: string[] }) => (
  <View style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
    <View style={{ width: 60, paddingVertical: 12, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: '#eee' }}>
      <Text style={{ color: '#666', fontSize: 14, fontWeight: '500', textAlign: 'center' }}>类型</Text>
    </View>
    {headers.map((header, index) => (
      <View
        key={header}
        style={{
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderRightWidth: index === headers.length - 1 ? 0 : 1,
          borderRightColor: '#eee',
        }}
      >
        <Text style={{ color: '#666', fontSize: 14, fontWeight: '500', textAlign: 'center' }}>{header}</Text>
      </View>
    ))}
  </View>
);

// 行组件
const TableRow = ({
  label,
  data,
  isLast,
}: {
  label: string;
  data: number[];
  isLast?: boolean;
}) => (
  <View
    style={{
      flexDirection: 'row',
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: '#eee',
      backgroundColor: '#fff',
    }}
  >
    <View style={{ width: 60, paddingVertical: 12, paddingHorizontal: 8, borderRightWidth: 1, borderRightColor: '#eee' }}>
      <Text style={{ color: '#333', fontSize: 14, textAlign: 'center' }}>{label}</Text>
    </View>
    {data.map((value, index) => (
      <View
        key={index + value + Math.random()}
        style={{
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderRightWidth: index === data.length - 1 ? 0 : 1,
          borderRightColor: '#eee',
        }}
      >
        <Text style={{ color: '#333', fontSize: 14, textAlign: 'center' }}>{value}</Text>
      </View>
    ))}
  </View>
);

// 主组件
const LeagueTrendTable: React.FC = ( ) => {
  const [trendData, setTrendData] = useState<ServerCommonLive.FootBallCompetitionLeagueTrend>();
  const {
    currentMatch
  } = useLiveStore();
  useEffect(() => {
    // const dict: ServerCommonLive.GetFootBallCompetitionCrownOddsCommandQuery = {
    //   competitionID: currentMatch?.competitionId ?? 0,
    //   competitionType: currentMatch?.competitionType ?? 'JC',
    //   lotteryName: currentMatch?.lotteryName ?? '竞彩足球',

    // }
    // getFootballCrownOdds(dict).then((res) => {
    //   setCrownOdds(res.data);
    // })

    const dict: ServerCommonLive.GetFootBallCompetitionLeagueTrendCommandQuery = {
      competitionID: currentMatch?.competitionId ?? 0,
      competitionType: currentMatch?.competitionType ?? 'JC',
      lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
      awayId: currentMatch?.awayId ?? 0,
      homeId: currentMatch?.homeId ?? 0,
      leagueId: currentMatch?.leagueId ?? 0,
    }
    getFootballLeagueTrend(dict).then((res) => {
      setTrendData(res.data);
    })



  }, []);

  if (!trendData) return null;

  const homeData = mapTrendList(trendData?.homeLeagueTrendList ?? []);
  const awayData = mapTrendList(trendData?.awayLeagueTrendList ?? []);

  const headers = ['全场', '胜', '平', '负', '大球', '小球'];

  const buildRows = (prefix: string, d: any) => [
    {
      label: `${prefix}总`,
      data: [d.total?.total ?? 0, d.total?.win ?? 0, d.total?.draw ?? 0, d.total?.lose ?? 0, d.total?.big ?? 0, d.total?.small ?? 0],
    },
    {
      label: `${prefix}主场`,
      data: [d.home?.total ?? 0, d.home?.win ?? 0, d.home?.draw ?? 0, d.home?.lose ?? 0, d.home?.big ?? 0, d.home?.small ?? 0],
    },
    {
      label: `${prefix}客场`,
      data: [d.away?.total ?? 0, d.away?.win ?? 0, d.away?.draw ?? 0, d.away?.lose ?? 0, d.away?.big ?? 0, d.away?.small ?? 0],
    },
  ];

  return (
    <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
      <Text>{currentMatch?.home}</Text>
      {/* 主队数据 */}
      <TableHeader headers={headers} />
      {buildRows('', homeData).map((row, index, arr) => (
        <TableRow key={row.label + index + Math.random()} {...row} isLast={index === arr.length - 1} />
      ))}
      <Text>{currentMatch?.away}</Text>
      {/* 客队数据 */}
      <TableHeader headers={headers} />
      {buildRows('', awayData).map((row, index, arr) => (
        <TableRow key={row.label + index + Math.random()} {...row} isLast={index === arr.length - 1} />
      ))}
    </View>
  );
};

export default LeagueTrendTable;
