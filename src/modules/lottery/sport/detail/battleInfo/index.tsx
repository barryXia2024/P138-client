import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLiveStore } from 'src/store';

import OSSImage from '@/p138-react-common/components/Upload/OSSImage';


import { getFootballCrownOdds, getFootballRecordStatistic } from 'src/api/interface/competition-football';


import { Image } from 'expo-image';

import PickBox from './pickBox';
import ActiveTab from 'src/modules/live/components/activeTab';

import OddsInfo from './oddsInfo';
import RecordBox from './recordBox';
import { OFFENSE_DEFENSE_TYPE, StatisticType, VS_TYPE } from 'src/modules/lottery/constants/competitionDetail';
import StatistiCsView from './StatistiCs';
import BattleStatsSection from './battleStatsSection';
import OffenseDefense from './offenseDefense';
import LeagueTrendTable from './leagueTrendTable';
import FutureMatchTable from './future';
import { getBasketballRecord } from 'src/api/interface/competition-basketball';


export enum CollapsedType {
  NEARLY_STATS = 'nearlyStats',
  BEFORE_ODDS = 'beforeOdds',
  EUROPE_ODDS = 'europeOdds',

  HISTORY_RECORD = 'historyRecord',
  PICK_BOX = 'pickBox',
  OFFENSE_DEFENSE = 'offenseDefense',
  LEAGUE_TREND = 'leagueTrend',
  FUTURE_MATCH = 'futureMatch',
  BATTLE_STATS = 'battleStats'
}


// getFootballRecord
const BattleInfo: React.FC<{ competitionType: ServerCommonLive.CompetitionType }> = ({ competitionType }) => {
  const {
    currentMatch
  } = useLiveStore();
  const [vsType, setVsType] = useState<{
    home: VS_TYPE,
    away: VS_TYPE,
    homeAway: VS_TYPE
  }>({
    home: VS_TYPE.ALL,
    away: VS_TYPE.ALL,
    homeAway: VS_TYPE.ALL
  });
  const [leagueId, setLeagueId] = useState<{
    home: number,
    away: number,
    homeAway: number
  }>({
    home: -1,
    away: -1,
    homeAway: -1
  });



  const [crownOdds, setCrownOdds] = useState<ServerCommonLive.FootBallCompetitionCrownOdds>();
  const [homeStatics, setHomeStatics] = useState<ServerCommonLive.CompetitionRecordList>();
  const [awayStatics, setAwayStatics] = useState<ServerCommonLive.CompetitionRecordList>();
  const [homeAwayStatics, setHomeAwayStatics] = useState<ServerCommonLive.CompetitionRecordList>();
  const [recordStatistic, setRecordStatistic] = useState<ServerCommonLive.FootBallCompetitionRecordStatistic | ServerCommonLive.BasketBallCompetitionRecordList>();
  const [statisticTen, setStatisticTen] = useState<OFFENSE_DEFENSE_TYPE>(OFFENSE_DEFENSE_TYPE.TEN);

  const [collapsed, setCollapsed] = useState<{
    [key in CollapsedType]: boolean
  }>({
    [CollapsedType.NEARLY_STATS]: false,
    [CollapsedType.BEFORE_ODDS]: false,
    [CollapsedType.EUROPE_ODDS]: false,
    [CollapsedType.HISTORY_RECORD]: false,
    [CollapsedType.PICK_BOX]: false,
    [CollapsedType.OFFENSE_DEFENSE]: false,
    [CollapsedType.LEAGUE_TREND]: false,
    [CollapsedType.FUTURE_MATCH]: false,
    [CollapsedType.BATTLE_STATS]: false
  });
  const isBasketball = competitionType === 'LQ';



  useEffect(() => {
    const Statisticdict: ServerCommonLive.GetFootBallCompetitionRecordStatisticCommandQuery = {
      competitionID: currentMatch?.competitionId ?? 0,
      competitionType: competitionType ?? 'JC',
      lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
      awayId: currentMatch?.awayId ?? 0,
      homeId: currentMatch?.homeId ?? 0,
      leagueId: currentMatch?.leagueId ?? 0
    }
    if (isBasketball) {
      getBasketballRecord(Statisticdict).then((res) => {
        setRecordStatistic(res.data);
      })
    } else {
      getFootballRecordStatistic(Statisticdict).then((res) => {
        setRecordStatistic(res.data);
      })
    }

    const dict: ServerCommonLive.GetFootBallCompetitionCrownOddsCommandQuery = {
      competitionID: currentMatch?.competitionId ?? 0,
      competitionType: currentMatch?.competitionType ?? 'JC',
      lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',

    }
    getFootballCrownOdds(dict).then((res) => {
      setCrownOdds(res.data);
    })


  }, []);
  const BeforeRows = [
    {
      title: '欧赔',
      cells: [
        crownOdds?.crownEuropeWinOdds,
        crownOdds?.crownEuropeDrawOdds,
        crownOdds?.crownEuropeLostOdds
      ]
    },
    {
      title: '亚盘',
      cells: [
        crownOdds?.crownAsiaHandicap,
        crownOdds?.crownAsiaWinOdds,
        crownOdds?.crownAsiaLostOdds
      ]
    },
    {
      title: '大小',
      cells: [
        crownOdds?.crownBigSmallHandicap,
        crownOdds?.crownBigOdds,
        crownOdds?.crownSmallOdds
      ]
    }
  ];

  const EuropeRows = [
    {
      title: '皇冠',
      cells: [
        crownOdds?.crownEuropeWinOdds,
        crownOdds?.crownEuropeDrawOdds,
        crownOdds?.crownEuropeLostOdds
      ]
    },
    {
      title: 'BET365',
      cells: [
        crownOdds?.bet365EuropeWinOdds,
        crownOdds?.bet365EuropeDrawOdds,
        crownOdds?.bet365EuropeLostOdds
      ]
    },
    {
      title: '竞彩官方',
      cells: [
        crownOdds?.jcEuropeWinOdds,
        crownOdds?.jcEuropeDrawOdds,
        crownOdds?.jcEuropeLostOdds
      ]
    }
  ];
  const getStats = (statics?: { competitionList: ServerCommonLive.CompetitionRecord[] | null }) => {
    const list = statics?.competitionList ?? [];
    const total = list.length;

    const winCount = list.filter((row) => row.result === '胜').length;
    const drawCount = list.filter((row) => row.result === '平').length;
    const loseCount = list.filter((row) => row.result === '负').length;
    const winPlateCount = list.filter((row) => row.asiaHandicapResult === '赢').length;

    const winRate = total ? ((winCount / total) * 100).toFixed(1) : '0.0';
    const winPlateRate = total ? ((winPlateCount / total) * 100).toFixed(1) : '0.0';

    return { winCount, drawCount, loseCount, winRate, winPlateRate };
  };

  const home = homeStatics ? getStats(homeStatics) : { winCount: 0, drawCount: 0, loseCount: 0, winRate: '0.0', winPlateRate: '0.0' };
  const away = awayStatics ? getStats(awayStatics) : { winCount: 0, drawCount: 0, loseCount: 0, winRate: '0.0', winPlateRate: '0.0' };
  const homeAway = homeAwayStatics ? getStats(homeAwayStatics) : { winCount: 0, drawCount: 0, loseCount: 0, winRate: '0.0', winPlateRate: '0.0' };

  return (
    <View style={{ height: '90%' }}>
      <ScrollView style={{ height: '90%', backgroundColor: '#fff', padding: 12 }}>
        <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setCollapsed({ ...collapsed, [CollapsedType.NEARLY_STATS]: !collapsed[CollapsedType.NEARLY_STATS] })}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>近期战绩</Text>
          <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>

        <View style={{ display: collapsed[CollapsedType.NEARLY_STATS] ? 'none' : 'flex' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* 主队数据 */}
            <View>
              <Text className='text-gray-500'>胜 {home.winRate}% ，赢盘 {home.winPlateRate}%</Text>
              <Text className='text-gray-500'>{home.winCount}胜 {home.drawCount}平 {home.loseCount}负</Text>
            </View>

            {/* 中间标题 */}
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>战绩</Text>

            {/* 客队数据 */}
            <View>
              <Text className='text-gray-500'>胜 {away.winRate}% ，赢盘 {away.winPlateRate}%</Text>
              <Text className='text-gray-500 align-right  '>{away.winCount}胜 {away.drawCount}平 {away.loseCount}负</Text>
            </View>
          </View>
          <PickBox isHiddenGreen />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <OSSImage source={{ uri: currentMatch?.homeLogo ?? '' }} style={{ width: 20, height: 20 }} />
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>{currentMatch?.home}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 12
          }}>
            <ActiveTab
              activeList={[{ name: '所有赛事', value: -1 }, { name: '相同赛事', value: currentMatch?.leagueId ?? -1 }]}
              value={leagueId.home}
              onChange={(value) => {
                setLeagueId({ ...leagueId, home: value });

              }}
              height={40}
            />
            <ActiveTab
              activeList={[{ name: '全部对阵', value: VS_TYPE.ALL }, { name: '主队主场', value: VS_TYPE.HOME }]}
              value={vsType.home}
              onChange={(value) => {
                setVsType({ ...vsType, home: value });

              }}
              height={40}
            />
          </View>

          <StatistiCsView leagueId={leagueId.home} vsType={vsType.home} statisticType={StatisticType.HOME} onChange={setHomeStatics} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25 }}>
            <OSSImage source={{ uri: currentMatch?.awayLogo ?? '' }} style={{ width: 20, height: 20 }} />
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>{currentMatch?.away}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 12
          }}>
            <ActiveTab
              activeList={[{ name: '所有赛事', value: -1 }, { name: '相同赛事', value: currentMatch?.leagueId ?? -1 }]}
              value={leagueId.away}
              onChange={(value) => {
                setLeagueId({ ...leagueId, away: value });

              }}
              height={40}
            />
            <ActiveTab
              activeList={[{ name: '全部对阵', value: VS_TYPE.ALL }, { name: '客队客场', value: VS_TYPE.AWAY }]}
              value={vsType.away}
              onChange={(value) => {
                setVsType({ ...vsType, away: value });

              }}
              height={40}
            />
          </View>
          <StatistiCsView leagueId={leagueId.away} vsType={vsType.away} statisticType={StatisticType.AWAY} onChange={setAwayStatics} />
        </View>

        {!isBasketball && <View>
          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setCollapsed({ ...collapsed, [CollapsedType.BEFORE_ODDS]: !collapsed[CollapsedType.BEFORE_ODDS] })}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>皇冠赛前赔率</Text>
            <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
          <View style={{ display: collapsed[CollapsedType.BEFORE_ODDS] ? 'none' : 'flex' }}>
            <OddsInfo rows={BeforeRows} />
          </View>
        </View>}
        {!isBasketball && <View>
          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setCollapsed({ ...collapsed, [CollapsedType.EUROPE_ODDS]: !collapsed[CollapsedType.EUROPE_ODDS] })}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>欧赔比较</Text>
            <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
          <View style={{ display: collapsed[CollapsedType.EUROPE_ODDS] ? 'none' : 'flex' }}>
            <OddsInfo rows={EuropeRows} />
          </View>
        </View>}

        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>历史交锋</Text>
          <RecordBox homeWin={homeAway.winCount} draw={homeAway.drawCount} awayWin={homeAway.loseCount} />
          <PickBox />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ActiveTab
              activeList={[{ name: '所有赛事', value: -1 }, { name: '相同赛事', value: currentMatch?.leagueId ?? -1 }]}
              value={leagueId.homeAway}
              onChange={(value) => {
                setLeagueId({ ...leagueId, homeAway: value });

              }}
              height={40}
            />
            <ActiveTab
              activeList={[{ name: '全部对阵', value: VS_TYPE.ALL }, { name: '主客相同', value: VS_TYPE.HOME_AWAY }]}
              value={vsType.homeAway}
              onChange={(value) => {
                setVsType({ ...vsType, homeAway: value });
              }}
              height={40}
            />
          </View>
          <StatistiCsView leagueId={leagueId.homeAway} vsType={vsType.homeAway} statisticType={StatisticType.HOME_AWAY} onChange={setHomeAwayStatics} />

        </View>

        {!isBasketball && <View>
          <BattleStatsSection collapsed={collapsed[CollapsedType.BATTLE_STATS]} setCollapsed={(collapsed) => setCollapsed({ ...collapsed, [CollapsedType.BATTLE_STATS]: collapsed })} recordStatistic={recordStatistic} statisticTen={statisticTen} setStatisticTen={setStatisticTen} />
        </View>}
        {!isBasketball && <View>
          <OffenseDefense collapsed={collapsed[CollapsedType.OFFENSE_DEFENSE]} setCollapsed={(collapsed) => setCollapsed({ ...collapsed, [CollapsedType.OFFENSE_DEFENSE]: collapsed })} />
        </View>}
        {!isBasketball && <View>
          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setCollapsed({ ...collapsed, [CollapsedType.LEAGUE_TREND]: !collapsed[CollapsedType.LEAGUE_TREND] })}>

            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>联赛盘路走势</Text>
            <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />

          </TouchableOpacity>
          <View style={{ display: collapsed[CollapsedType.LEAGUE_TREND] ? 'none' : 'flex' }}>
            <LeagueTrendTable />
          </View>
        </View>}
        <View>
          <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setCollapsed({ ...collapsed, [CollapsedType.FUTURE_MATCH]: !collapsed[CollapsedType.FUTURE_MATCH] })}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>未来赛事</Text>
            <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
          <View style={{ display: collapsed[CollapsedType.FUTURE_MATCH] ? 'none' : 'flex' }}>
            <FutureMatchTable title='未来赛程' isHome />
            <FutureMatchTable title='未来赛程' />
          </View>
        </View>



      </ScrollView>
    </View>

  )
};

export default BattleInfo; 