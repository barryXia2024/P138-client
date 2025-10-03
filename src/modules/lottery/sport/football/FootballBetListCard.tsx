import React  from 'react';
import {Text, View, StyleSheet} from 'react-native';

import PlayMoreButton from './PlayMoreButton';
import AnalysisDetails from './AnalysisDetails';
import  OddsRow from './OddsRow';

import CompetitionTeamInfo from '../../components/TeamInfo';
import DeadlineBox from './DeadlineBox';

const FootballBetListCard: React.FC<CompetitionProps.MatchCardProps> = ({
  competition,
  isLastItem = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        !isLastItem && styles.containerWithBorder,
        style,
      ]}>
      <View style={styles.headerRow}>
        <Text style={styles.leagueName}>{competition.leagueName}</Text>
        <CompetitionTeamInfo competition={competition} />
      </View>

      <View style={styles.contentRow}>
        <DeadlineBox competition={competition} />
        <View style={styles.oddsContainer}>
          <OddsRow competition={competition} />
          <PlayMoreButton competition={competition} />
        </View>
      </View>

      <AnalysisDetails competition={competition} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 8,
  },
  containerWithBorder: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueName: {
    textAlign: 'center',
    fontSize: 14,
    width: 80,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  oddsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height:'100%'
  },
});

export default React.memo(FootballBetListCard);
