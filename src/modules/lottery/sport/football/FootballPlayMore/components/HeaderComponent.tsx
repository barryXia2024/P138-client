import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CompetitionTeamInfo from 'src/modules/lottery/components/TeamInfo';

interface HeaderComponentProps {
  competitionInfo: LotteryDataSource.MatchInfo;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({competitionInfo}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.deadlineBox}>
        <Text style={styles.deadlineText}>{competitionInfo.matchNum}</Text>
      </View>
      <CompetitionTeamInfo competition={competitionInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deadlineBox: {
    backgroundColor: '#fff9f9',
    borderRadius: 5,
    paddingVertical: 5,
    width: 70,
  },
  deadlineText: {
    color: '#f53b57',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HeaderComponent; 