import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  Image,
} from 'react-native';
import {formattedDate} from 'p138-react-common/utils/fuc';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import OddsCell, {OddsLabel} from './oddsCell';
import { betPlayColorGreen } from 'p138-react-common/utils/styles/color';
import { generateOddsCellKey } from 'src/modules/lottery/utils/lottery';


enum LotteryName {
   GameTotalGoalsBet4 = 'GameTotalGoalsBet4',
   HalfTimeFullTimeBet6 = 'HalfTimeFullTimeBet6',
}


// TeamInfo 组件：显示球队信息
const TeamInfo: React.FC<{competition: LotteryDataSource.MatchInfo}> = ({competition}) => {
  return (
    <View style={styles.teamInfo}>
      <View className="flex-row items-center">
        <Text style={styles.teamName}>{competition.home}</Text>
        {competition.homeLogo && (
          <Image
            source={{uri: competition.homeLogo}}
            style={{width: 20, height: 20}}
            resizeMode="stretch"
          />
        )}
      </View>
      <Text style={styles.vs}>VS</Text>
      <View className="flex-row items-center">
        {competition.awayLogo && (
          <Image
            source={{uri: competition.awayLogo}}
            style={{width: 20, height: 20}}
            resizeMode="stretch"
          />
        )}
        <Text style={styles.teamName}>{competition.away}</Text>
      </View>
    </View>
  );
};

// DeadlineBox 组件：显示比赛截止时间和分析按钮
const DeadlineBox: React.FC<{
  competition: LotteryDataSource.MatchInfo;
  setShowAnalysisDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showAnalysisDetails: boolean;
}> = ({competition}) => {
  return (
    <TouchableWithoutFeedback>
      <View style={styles.deadlineBox}>
        {/* <Text style={styles.deadlineText}>
          {formattedWeek(match.competitionTime)}
        </Text> */}
        <Text style={styles.deadlineTime}>
          {formattedDate(competition.competitionTime, 'HH:mm')} 截止
        </Text>
        <Text style={[styles.deadlineText, styles.analysisButton]}>分析</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};


// 主要比赛卡片组件
const GameTotalGoalsItem: React.FC<CompetitionProps.MatchCardProps> = ({
  competition,
  isLastItem = false,
  isMatchBetList = false,
  style,
}) => {
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);
  const {selectedMatches, toggleSelection} = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();

  const dict ={
    'GameTotalGoalsBet4':{
      Odds:['0', '1', '2', '3+'],
      MaxMatchCount:4,
    },
    'HalfTimeFullTimeBet6':{
      Odds:['3','1','0'],
      MaxMatchCount:6,
    },
  }

  const maxMatchCount = dict[lotteryInfo?.lotteryName as LotteryName].MaxMatchCount;
  const odds = dict[lotteryInfo?.lotteryName as LotteryName].Odds;

  return (
    <View
      style={[
        {backgroundColor: '#fff', padding: 10,width:'100%'},
        !isLastItem && styles.cardBorder,
        style,
      ]}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <Text style={[styles.league, {width: 80}]}>
          {competition.matchNum}.{competition.leagueName}
        </Text>
        <TeamInfo competition={competition} />
      </View>

      <View
        style={[
          {
            width:'100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        {!isMatchBetList && (
          <DeadlineBox
            competition={competition}
            setShowAnalysisDetails={setShowAnalysisDetails}
            showAnalysisDetails={showAnalysisDetails}
          />
        )}

        <View className="flex-1">
          <View className="flex-row ">
            <OddsLabel value={'主'} />
            <View className="flex-row flex-1 flex-wrap">
              {odds.map(item => {
                const competitionOddsDtos = {
                  betName: '',
                  betItem: item,
                  odds: null,
                  winColor: '',
                  status: '',
                  rate: null,
                };
                const handicapDto = {
                  hanicap: '',
                  playChineseName: '主',
                  playEnglishName: 'home',
                  single: '0',
                  competitionOddsDtos: null,
                };
                const oddsCellKey = generateOddsCellKey(
                  competition.competitionId,
                  handicapDto,
                  competitionOddsDtos,
                );
                const isSelected =
                selectedMatches[competition.competitionId]?.includes(oddsCellKey);
                return (
                  <OddsCell
                    key={item}
                    style={{ flex:1, height: 40}}
                    competitionOddsDtos={competitionOddsDtos}
                    handicapDtos={handicapDto}
                    toggleSelection={() =>
                      toggleSelection(
                        competition.competitionId.toString(),
                        oddsCellKey,
                        maxMatchCount,
                      )
                    }
                    isSelected={isSelected}
                  />
                );
              })}
            </View>
          </View>
          <View className="flex-row w-full">
            <OddsLabel value={'客'} style={{backgroundColor:betPlayColorGreen}}/>
            <View className="flex-row flex-1">
              {odds.map(item => {
                const competitionOddsDtos = {
                  betName: '',
                  betItem: item,
                  odds: null,
                  winColor: '',
                  status: '',
                  rate: null,
                };
                const handicapDto = {
                  hanicap: '',
                  playChineseName: '客',
                  playEnglishName: 'away',
                  single: '0',
                  competitionOddsDtos: null,
                };
                const oddsCellKey = generateOddsCellKey(
                  competition.competitionId,
                  handicapDto,
                  competitionOddsDtos,
                );
                const isSelected =
                selectedMatches[competition.competitionId]?.includes(oddsCellKey);
                return (
                  <OddsCell
                    key={item}
                    style={{flex: 1, height: 40}}
                    competitionOddsDtos={competitionOddsDtos}
                    handicapDtos={handicapDto}
                    toggleSelection={() =>
                      toggleSelection(
                        competition.competitionId.toString(),
                        oddsCellKey,
                        maxMatchCount,
                      )
                    }
                    isSelected={isSelected}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(GameTotalGoalsItem);

// 样式
const styles = StyleSheet.create({
  cardBorder: {
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  league: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    width: 70,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  homeLabel: {
    fontSize: 8,
    color: 'white',
    padding: 2,
    borderRadius: 2,
  },
  teamIndex: {
    fontSize: 8,
    color: '#333',
  },
  deadlineBox: {
    borderRadius: 5,
    paddingVertical: 5,
    width: 70,
    alignItems: 'center',
    backgroundColor: '#fef9f9',
  },
  deadlineText: {
    fontSize: 12,
    color: '#f53b57',
  },
  deadlineTime: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  analysisButton: {
    color: '#f53b57',
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontSize: 14,
  },
  oddsContainer: {
    flex: 1,
    marginLeft: 10,
  },

  matchCard: {
    backgroundColor: '#fff',
    padding: 10,
  },




 
});
