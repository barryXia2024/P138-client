import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import {Image} from 'expo-image';
import {router} from 'expo-router';

import commonStyles from 'p138-react-common/utils/styles';
import {
  betPlayColorBlue,
  betPlayColorBrown,
} from 'p138-react-common/utils/styles/color';
import {useLiveStore} from 'src/store';
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import {isNaNofString} from 'src/utils';

const LiveItem = ({
  item,
  competitionType,
}: {
  item:
    | ServerCommonLive.FootBallCompetition
    | ServerCommonLive.BasketBallCompetition;
  competitionType: ServerCommonLive.CompetitionType;
}) => {
  const {selectedFilterIndex, selectedTabIndex, setCurrentMatch} =
    useLiveStore();

  const navigateToDetail = () => {
    setCurrentMatch(item);
    router.push(
      `/lottery/sport/detail?competitionId=${item.competitionId}&competitionType=${competitionType}`,
    );
  };

  const renderMiddleSection = () => {
    if (!item.matchScore) {
      return (
        <View style={styles.centerOverlay}>
          <Text style={styles.vs}>VS</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerOverlay}>
        <View style={styles.scoreBox}>
          <Text style={[styles.vs, styles.scoreText]}>{item.matchScore}</Text>
        </View>
        {selectedTabIndex === 0 && (
          <Text style={styles.subScoreText}>上半场 {item.halfMatchScore}</Text>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.listItem}
      onPress={navigateToDetail}>
      {/* 顶部信息 */}
      <View style={[commonStyles.row, commonStyles.between]}>
        <View style={[commonStyles.row, commonStyles.gap4]}>
          <Text style={commonStyles.fontSize10}>
            {item[['matchNum', 'bdNum', 'sfcNum'][selectedFilterIndex]]}
          </Text>
          <Text
            style={[
              commonStyles.fontSize10,
              commonStyles.fontColorFFF,
              commonStyles.paddingHorizontal4,
              styles.leagueTag,
              {backgroundColor: item.leagueColor},
            ]}>
            {item.leagueName}
          </Text>
          <Text style={commonStyles.fontSize10}>
            {dayjs(
              isNaNofString(item.matchTime)
                ? item.competitionTime
                : item.matchTime,
            ).format('MM-DD HH:mm')}
          </Text>
        </View>
        <Text
          style={[
            commonStyles.fontSize10,
            commonStyles.fontColorFFF,
            commonStyles.paddingHorizontal4,
            styles.statusTag,
          ]}>
          {['未开赛', '未开赛', '进行中', '已结束'][item.competitionStatus]}
        </Text>
      </View>

      {/* 队伍信息 */}
      <View
        style={[
          commonStyles.row,
          commonStyles.between,
          commonStyles.alignCenter,
        ]}>
        <View style={styles.teamInfo}>
          {/* 主队 */}
          <View style={[commonStyles.row, commonStyles.alignCenter]}>
            <Text style={styles.homeLabel}>主</Text>
            {item.homeLeagueSort > 0 && (
              <Text style={styles.teamIndex}>[{item.homeLeagueSort}]</Text>
            )}
            <Text style={styles.teamName}>{item.home}</Text>
            <OSSImage source={{uri: item.homeLogo}} style={styles.teamLogo} />
          </View>

          {/* 中间比分或 VS */}
          {renderMiddleSection()}

          {/* 客队 */}
          <View
            style={[
              commonStyles.row,
              commonStyles.alignCenter,
              styles.awayTeamRow,
            ]}>
            <OSSImage source={{uri: item.awayLogo}} style={styles.teamLogo} />
            <Text style={styles.teamName}>{item.away}</Text>
            {item.awayLeagueSort > 0 && (
              <Text style={styles.teamIndex}>[{item.awayLeagueSort}]</Text>
            )}
            <Text style={styles.awayLabel}>客</Text>
          </View>
        </View>
      </View>

      {/* 赔率信息 */}
      {selectedFilterIndex === 0 && (
        <View style={[commonStyles.row, commonStyles.between]}>
          <Text style={[commonStyles.fontColor999, commonStyles.fontSize10]}>
            竞彩sp {item.oddsDTOList?.[0]?.europeHomeWin},
            {item.oddsDTOList?.[0]?.europeDraw},
            {item.oddsDTOList?.[0]?.europeHomeLost}
          </Text>
          <Text style={[commonStyles.fontColor999, commonStyles.fontSize10]}>
            主({item.oddsDTOList?.[0]?.asiaHandicap}){' '}
            {item.oddsDTOList?.[0]?.asiaHomeWin},
            {item.oddsDTOList?.[0]?.asiaDraw},
            {item.oddsDTOList?.[0]?.asiaHomeLost}
          </Text>
        </View>
      )}

      {selectedFilterIndex === 1 && (
        <View style={[commonStyles.row, commonStyles.between]}>
          <Text style={[commonStyles.fontColor999, commonStyles.fontSize10]}>
            胜平负 主({item.jcHandicap})
          </Text>
          <Text style={[commonStyles.fontColor999, commonStyles.fontSize10]}>
            胜负过关 主({item.asiaHandicap})
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default LiveItem;

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginTop: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    position: 'relative',
  },
  teamName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  teamLogo: {
    width: 20,
    height: 20,
  },
  vs: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  scoreText: {
    color: 'white',
  },
  homeLabel: {
    fontSize: 8,
    backgroundColor: betPlayColorBrown,
    color: 'white',
    padding: 2,
    borderRadius: 2,
  },
  awayLabel: {
    fontSize: 8,
    backgroundColor: betPlayColorBlue,
    color: 'white',
    padding: 2,
    borderRadius: 2,
  },
  teamIndex: {
    fontSize: 8,
    color: '#333',
  },
  centerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBox: {
    borderRadius: 10,
    backgroundColor: 'red',
    paddingHorizontal: 10,
  },
  subScoreText: {
    fontSize: 10,
    marginTop: 2,
  },
  awayTeamRow: {
    justifyContent: 'flex-end',
  },
  leagueTag: {
    borderRadius: 4,
  },
  statusTag: {
    borderRadius: 4,
    backgroundColor: betPlayColorBlue,
  },
});
