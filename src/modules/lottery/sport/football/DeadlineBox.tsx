import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';

import {formattedDate} from 'p138-react-common/utils/fuc';

import {useLotteryEventStore} from 'src/modules/lottery/store/event';

const DeadlineBox: React.FC<{competition: LotteryDataSource.MatchInfo}> = ({
  competition,
}) => {
  const {showAnalysisDetails, setShowAnalysisDetails} = useLotteryEventStore();
  const rotation = showAnalysisDetails ? '180deg' : '0deg';
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        setShowAnalysisDetails({
          [competition.competitionId]: {
            isVisible:
              !showAnalysisDetails[competition.competitionId]?.isVisible,
            competitionInfo: competition,
          },
        })
      }>
      <View style={styles.deadlineBox}>
        <Text style={styles.matchNumText}>{competition.matchNum}</Text>
        <Text style={styles.deadlineText}>
          {formattedDate(competition.buyEndTime, 'HH:mm')} 截止
        </Text>
        <Text style={styles.analysisText}>
          分析
          <Image
            style={[styles.analysisIcon, {transform: [{rotate: rotation}]}]}
            source={require('src/assets/imgs/home/icon_home_help_down.png')}
          />
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  deadlineBox: {
    width: 80,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#fef9f9',
    paddingVertical: 4,
  },
  matchNumText: {
    color: '#f53b57',
    fontSize: 14,
  },
  deadlineText: {
    fontSize: 14,
  },
  analysisText: {
    color: '#f53b57',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  analysisIcon: {
    width: 6,
    height: 6,
  },
});

export default DeadlineBox;
