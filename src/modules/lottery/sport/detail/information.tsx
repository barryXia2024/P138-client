import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { getFootBallCompetitionSupportScale } from 'src/api/interface/competition-football';
import CircularProgress from 'src/app/personCenter/components/circularProgress';
import { useLiveStore } from 'src/store';

/**
 * 比赛情报组件
 * 显示支持比例和比赛情报信息
 */
const Information: React.FC<{ 
  competitionType: ServerCommonLive.CompetitionType;
  liveInfo?: ServerCommonLive.FootBallCompetition | ServerCommonLive.BasketBallCompetition;
}> = ({ competitionType, liveInfo }) => {
  const { currentMatch } = useLiveStore();
  const [supportScale, setSupportScale] = useState<ServerCommonLive.FootballSupportScale>();
  const [activeTeam, setActiveTeam] = useState<'home' | 'away'>('home');

  // 只获取支持比例数据（足球特有）
  useEffect(() => {
    if (competitionType !== 'LQ' && currentMatch) {
      getFootBallCompetitionSupportScale({
        competitionType: currentMatch.competitionType ?? 'JC',
        lotteryName: currentMatch.lotteryName ?? 'FootballLottery',
        awayId: currentMatch.awayId ?? 0,
        competitionID: currentMatch.competitionId ?? 0,
        homeId: currentMatch.homeId ?? 0,
        leagueId: currentMatch.leagueId ?? 0
      }).then(res => {
        setSupportScale(res.data);
      });
    }
  }, [competitionType, currentMatch]);

  const TeamSwitch = () => {
    return (
      <View style={styles.teamSwitchContainer}>
        <View style={styles.teamSwitch}>
          <Pressable
            style={[
              styles.teamSwitchItem,
              activeTeam === 'home' && styles.teamSwitchItemActive
            ]}
            onPress={() => setActiveTeam('home')}
          >
            <Text style={[
              styles.teamSwitchText,
              activeTeam === 'home' && styles.teamSwitchTextActive
            ]}>{currentMatch?.home}</Text>
          </Pressable>
          <Pressable
            style={[
              styles.teamSwitchItem,
              activeTeam === 'away' && styles.teamSwitchItemActive
            ]}
            onPress={() => setActiveTeam('away')}
          >
            <Text style={[
              styles.teamSwitchText,
              activeTeam === 'away' && styles.teamSwitchTextActive
            ]}>{currentMatch?.away}</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}>
      {/* 足球支持比例 */}
      {competitionType !== 'LQ' && (
        <>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>支持比例</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: 14, color: '#888', width: 10, textAlign: 'center' }}>胜负平</Text>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <CircularProgress
                size={80}
                strokeWidth={8}
                progress={Number(supportScale?.winPercent ?? 0) / 100}
                color="#FF4D4F"
                backgroundColor="#F5F5F5"
                text={`${supportScale?.winPercent ?? 0}%`}
                subText={''}
              />
              <Text style={{ color: '#888', marginTop: 2 }}>胜</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <CircularProgress
                size={80}
                strokeWidth={8}
                progress={Number(supportScale?.drawPercent ?? 0) / 100}
                color="#19b5fe"
                backgroundColor="#F5F5F5"
                text={`${supportScale?.drawPercent ?? 0}%`}
                subText={''}
              />
              <Text style={{ color: '#888', marginTop: 2 }}>负</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <CircularProgress
                size={80}
                strokeWidth={8}
                progress={Number(supportScale?.lostPercent ?? 0) / 100}
                color="#27ae60"
                backgroundColor="#F5F5F5"
                text={`${supportScale?.lostPercent ?? 0}%`}
                subText={''}
              />
              <Text style={{ color: '#888', marginTop: 2 }}>平</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: 14, color: '#888', width: 10, textAlign: 'center' }}>让球胜负平</Text>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <CircularProgress
                size={80}
                strokeWidth={8}
                progress={Number(supportScale?.asiaWinPercent ?? 0) / 100}
                color="#FF4D4F"
                backgroundColor="#F5F5F5"
                text={`${supportScale?.asiaWinPercent ?? 0}%`}
                subText={''}
              />
              <Text style={{ color: '#888', marginTop: 2 }}>胜</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <CircularProgress
                size={80}
                strokeWidth={8}
                progress={Number(supportScale?.drawPercent ?? 0) / 100}
                color="#19b5fe"
                backgroundColor="#F5F5F5"
                text={`${supportScale?.drawPercent ?? 0}%`}
                subText={''}
              />
              <Text style={{ color: '#888', marginTop: 2 }}>负</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <CircularProgress
                size={80}
                strokeWidth={8}
                progress={Number(supportScale?.asiaLostPercent ?? 0) / 100}
                color="#27ae60"
                backgroundColor="#F5F5F5"
                text={`${supportScale?.asiaLostPercent ?? 0}%`}
                subText={''}
              />
              <Text style={{ color: '#888', marginTop: 2 }}>平</Text>
            </View>
          </View>
        </>
      )}

      {/* 球队切换 */}
      <TeamSwitch />

      {/* 比赛情报 */}
      {activeTeam === 'home' ? (
        <>
          <Text className='font-bold text-red-500 text-[16px] border-l-[4px] border-red-500 pl-2 mb-2'>有利情报</Text>
          {liveInfo?.competitionIntelligenceDto?.home?.good?.map((item, index) => (
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }} key={index}>{item.content}</Text>
          ))}

          <Text className='font-bold text-blue-500 text-[16px] border-l-[4px] border-blue-500 pl-2 mb-2'>不利情报</Text>
          {liveInfo?.competitionIntelligenceDto?.home?.bad?.map((item, index) => (
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }} key={index}>{item.content}</Text>
          ))}
        </>
      ) : (
        <>
          <Text className='font-bold text-red-500 text-[16px] border-l-[4px] border-red-500 pl-2 mb-2'>有利情报</Text>
          {liveInfo?.competitionIntelligenceDto?.away?.good?.map((item, index) => (
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }} key={index}>{item.content}</Text>
          ))}

          <Text className='font-bold text-blue-500 text-[16px] border-l-[4px] border-blue-500 pl-2 mb-2'>不利情报</Text>
          {liveInfo?.competitionIntelligenceDto?.away?.bad?.map((item, index) => (
            <Text style={{ fontWeight: 'bold', marginBottom: 6 }} key={index}>{item.content}</Text>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  teamSwitchContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  teamSwitch: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  teamSwitchItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  teamSwitchItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamSwitchText: {
    fontSize: 14,
    color: '#666',
  },
  teamSwitchTextActive: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Information; 