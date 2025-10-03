import React  from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';


import {IMAGE_SIZE} from '@/p138-react-common/utils/styles/theme';
// import OSSImage from '@/p138-react-common/components/Upload/OSSImage';


const LeagueSort: React.FC<{leagueSort: number | null | undefined}> = ({
  leagueSort,
}) => {
  if (Number(leagueSort) === 0) return null;

  return <Text style={styles.leagueSortText}>[{leagueSort}]</Text>;
};

const CompetitionTeamInfo: React.FC<{competition?: LotteryDataSource.MatchInfo|null}> = ({
  competition,
}) => {
  if (!competition) return null;
  return (
    <View style={styles.teamInfoContainer}>
      <View style={styles.homeTeamContainer}>
        <Text style={styles.homeTeamLabel}>
          主
        </Text>
        <LeagueSort leagueSort={competition.homeLeagueSort} />
        <Text style={styles.teamName}>
          {competition.home}
        </Text>
        <Image
          source={{uri: competition.homeLogo||''}}
          style={IMAGE_SIZE.IMAGE_SIZE16}
          resizeMode="stretch"
        />
      </View>
      <Text style={styles.vsText}>VS</Text>
      <View style={styles.awayTeamContainer}>
        <Image
          source={{uri: competition.awayLogo||''}}
          style={IMAGE_SIZE.IMAGE_SIZE14}
          resizeMode="stretch"
        />

        <Text style={styles.teamName}>
          {competition.away}
        </Text>
        <LeagueSort leagueSort={competition.awayLeagueSort} />
        <Text style={styles.awayTeamLabel}>
          客
        </Text>
      </View>
    </View>
  );
};

export default CompetitionTeamInfo;


const styles = StyleSheet.create({
    leagueSortText: {
      fontSize: 12,
      color: '#333',
    },
    teamInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    homeTeamContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    awayTeamContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    homeTeamLabel: {
      fontSize: 12,
      paddingVertical: 4,
      color: 'white',
      backgroundColor: '#f5ad54',
      paddingHorizontal: 4,
      borderRadius: 2,
    },
    awayTeamLabel: {
      fontSize: 12,
      color: 'white',
      backgroundColor: '#3594ec',
      padding: 2,
      borderRadius: 2,
    },
    teamName: {
      fontSize: 14,
      color: 'black',
      fontWeight: 'bold',
    },
    vsText: {
      color: '#ef4444',
      fontSize: 18,
      fontWeight: 'bold',
    },
    
  });