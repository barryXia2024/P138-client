import {FONT_SIZES} from 'p138-react-common/utils/styles/theme';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useBetInfoStore} from 'src/modules/lottery/store';
import Footer from './Footer';
import {parseOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {BETTING_MESSAGES} from 'src/modules/lottery/constants';

// 渲染单个比赛卡片
const RenderMatchItem: React.FC<{
  item: LotteryDataSource.MatchInfo & {};
  selectKeys: string[];
}> = ({item, selectKeys}) => {
  const getHandicapDtos = (handicapDtos: LotteryDataSource.HandicapDto[]) => {
    const filteredHandicapDtos = handicapDtos?.filter(handicap =>
      selectKeys.some(key => {
        const {playChineseName} = parseOddsCellKey(key);
        return handicap.playChineseName === playChineseName;
      }),
    );
    return filteredHandicapDtos;
  };
  const {setSelectedMatches, selectedMatches} = useBetInfoStore();

  return (
    <View style={styles.matchItem}>
      <TouchableOpacity
        style={styles.closeButton}
        activeOpacity={1}
        onPress={() => {
          console.log('item', item);
          const newSelectedMatches = {...selectedMatches};
          delete newSelectedMatches[item.competitionId];

          const keys = Object.keys(selectedMatches);
          if (keys.length === 1) {
            Toast.show(BETTING_MESSAGES.MINIMUM_SELECTION);
            return;
          }
          setSelectedMatches(newSelectedMatches);
        }}>
        <Image
          source={require('src/assets/imgs/home/close.png')}
          style={styles.closeIcon}
        />
      </TouchableOpacity>
      {/* 第一排: 左边编号和赛事，右边战队名字 */}
      <View style={styles.matchHeader}>
        <Text style={styles.matchNum}>{item?.matchNum}</Text>
        <View style={styles.teamContainer}>
          <View style={styles.teamName}>
            <Text style={styles.teamText}>
              {item?.home}
            </Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.teamName}>
            <Text style={styles.teamText}>
              {item?.away}
            </Text>
          </View>
        </View>
      </View>
      {getHandicapDtos(item?.handicapDtos!)?.map(handicapItem => (
        <View style={styles.handicapRow} key={handicapItem.playEnglishName}>
          <View style={styles.handicapLabel}>
            <Text style={styles.handicapText}>
              {handicapItem.playChineseName === '让球胜平负'
                ? '让球' + handicapItem.hanicap
                : handicapItem.playChineseName}
            </Text>
          </View>
          <View style={styles.handicapContent}>
            {selectKeys
              .filter(key => {
                const {playChineseName} = parseOddsCellKey(key);
                return playChineseName === handicapItem.playChineseName;
              })
              .map((competitionOddsDto, idx) => {
                const {betItem, odds} = parseOddsCellKey(competitionOddsDto);
                return (
                  <Text key={idx} style={styles.oddsText}>{`${betItem}(${odds}) ${
                    selectKeys.filter(key => {
                      const {playChineseName} = parseOddsCellKey(key);
                      return playChineseName === handicapItem.playChineseName;
                    }).length -
                      1 !==
                    idx
                      ? ','
                      : ''
                  }`}</Text>
                );
              })}
          </View>
        </View>
      ))}
    </View>
  );
};

const SportBetList = () => {
  // Zustand 状态管理
  const {selectedMatches, matchData} = useBetInfoStore();

  return (
    <FlatList
      data={Object.keys(selectedMatches)} // FlatList 自动推断 data 类型
      renderItem={({item}) => {
        return (
          <RenderMatchItem
            item={matchData[item]}
            selectKeys={selectedMatches[item]}
          />
        );
      }}
      keyExtractor={key => key.toString()} // 确保每个列表项有唯一 key
      contentContainerStyle={styles.matchList}
      ListFooterComponent={<Footer />}
    />
  );
};

const styles = StyleSheet.create({
  matchList: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 30,
  },
  matchItem: {
    backgroundColor: '#fff',
    marginTop: 24,
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  matchHeader: {
    flexDirection: 'row',
  },
  matchNum: {
    fontSize: FONT_SIZES.small,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  teamName: {
    flexDirection: 'row',
  },
  teamText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  vsText: {
    fontSize: FONT_SIZES.medium,
    color: 'red',
  },
  handicapRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  handicapLabel: {
    backgroundColor: '#ef4444',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  handicapText: {
    fontSize: 12,
    color: '#fff',
    padding: 8,
  },
  handicapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    flex: 1,
    paddingLeft: 8,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  oddsText: {
    fontSize: 12,
  },
});

export default SportBetList;
