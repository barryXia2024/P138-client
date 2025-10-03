import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';

import {
  betPlayColorBlue,
  betPlayColorBrown,
  betPlayColorGreen,
  betPlayColorPurple,
} from 'p138-react-common/utils/styles/color';
import {formattedDate} from 'p138-react-common/utils/fuc';
import {useBetInfoStore} from 'src/modules/lottery/store';
import OddsCell, {OddsLabel} from './oddsCell';
import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {useLotteryEventStore} from 'src/modules/lottery/store/event';
import CompetitionTeamInfo from '../../components/TeamInfo';


/**
 * 竞彩篮球渲染赔率单元格
 * @param handicapIndex 让球索引
 * @param betColor 赔率颜色
 * @param match 赛事信息
 * @param activePlayType 玩法类型
 * @param selectedMatches 选中的赛事
 * @param toggleSelection 点击事件
 * @returns 渲染赔率单元格
 */
const RenderOddsCells: React.FC<{
  handicapIndex: number;
  betColor: string;
  competition: LotteryDataSource.MatchInfo;
  activePlayType: number;
  selectedMatches: Record<string, string[]>;
  toggleSelection: (
    competitionId: string,
    oddsCellKey: string,
    handicapIndex: number,
  ) => void;
}> = ({
  handicapIndex,
  betColor,
  competition,
  activePlayType,
  selectedMatches,
  toggleSelection,
}) => {
  const handicap = competition.handicapDtos![handicapIndex];
  const styleArray: Record<number, StyleProp<ViewStyle>> = {
    0: {flex: 1},
    1: {flex: 1},
    2: {flex: 1},
    3: {width: '30%'},
  };

  return (
    <View
      className={`flex-row flex-wrap ${activePlayType === 3 ? 'flex-1' : ''}`}>
      {handicapIndex !== 3 && activePlayType !== 3 && (
        <OddsLabel
          value={handicap.playChineseName!}
          style={[styles.w40, {backgroundColor: betColor}]}
          textStyle={{fontSize: 12}}
        />
      )}
      {handicap.competitionOddsDtos?.map(competitionOddsDtos => {
        const competitionOddsDtosNew = {
          ...competitionOddsDtos,
          // betItem:competitionOddsDtos.betItem+`${competitionOddsDtos.betName}`
        };
        //胜负差需要组合
        if (handicap.playEnglishName === 'S_FC$PLAY') {
          competitionOddsDtosNew.betItem =
            competitionOddsDtos.betItem + `${competitionOddsDtos.betName}`;
        }
        const oddsCellKey = generateOddsCellKey(
          competition.competitionId,
          handicap,
          competitionOddsDtosNew,
        );
        const isSelected =
          selectedMatches[competition.competitionId]?.includes(oddsCellKey);
        return (
          <OddsCell
            key={oddsCellKey}
            isSelected={isSelected}
            toggleSelection={() =>
              toggleSelection(competition.competitionId.toString(), oddsCellKey, 8)
            }
            textStyle={{fontSize: 15}}
            style={styleArray[handicapIndex]}
            handicapDtos={handicap}
            competitionOddsDtos={competitionOddsDtos}
          />
        );
      })}
    </View>
  );
};

/**
 * 竞彩篮球赛事卡片
 * @param props 赛事卡片属性
 * @returns 竞彩篮球赛事卡片
 */
const BasketballBetListItem: React.FC<CompetitionProps.MatchCardProps> = ({
  competition,
  isLast = false,
  isMatchBetList = false,
  style,
}) => {
  const {selectedMatches, betPlayActiveTab, toggleSelection} =
    useBetInfoStore();
  const [showFx, setShowFx] = useState(false);
  const {setBasketballPlayMore} = useLotteryEventStore();
  const index: Record<LotteryCommon.BasketballLotteryBettingType, number> = {
    HHTZ: 0,
    'SP/RF': 1,
    DXF: 2,
    SFC: 3,
  };

  if (!competition.handicapDtos?.[3]?.playChineseName) {
    console.log('match', competition);
  }

  return (
    <View style={[styles.matchCard, !isLast && styles.cardBorder, style]}>
      <View className="flex-row items-center">
        <Text className="text-center text-sm w-20">{competition.leagueName}</Text>
        <CompetitionTeamInfo competition={competition} />
      </View>

      {/* 第二排: 截止时间和下注表格 */}
      <View style={styles.matchBody}>
        {!isMatchBetList && (
          <TouchableOpacity
            activeOpacity={1}
            disabled
            style={styles.deadlineBox}
            onPress={() => setShowFx(!showFx)}>
            <Text style={styles.deadlineText}>{competition.matchNum}</Text>
            <Text style={{fontSize: 12, textAlign: 'center'}}>
              {formattedDate(competition.competitionTime, 'HH:mm')} 截止
            </Text>
            <Text style={styles.deadlineText}>分析</Text>
          </TouchableOpacity>
        )}
        <View className="flex-row flex-1">
          <View className="flex-1">
            {/* 混合 */}
            {['HHTZ', 'SP/RF'].includes(betPlayActiveTab) && (
              <RenderOddsCells
                handicapIndex={0}
                betColor={betPlayColorBlue}
                competition={competition}
                activePlayType={
                  index[
                    betPlayActiveTab as LotteryCommon.BasketballLotteryBettingType
                  ]
                }
                selectedMatches={selectedMatches}
                toggleSelection={toggleSelection}
              />
            )}

            {['HHTZ', 'SP/RF'].includes(betPlayActiveTab) && (
              <RenderOddsCells
                handicapIndex={1}
                betColor={betPlayColorGreen}
                competition={competition}
                activePlayType={
                  index[
                    betPlayActiveTab as LotteryCommon.BasketballLotteryBettingType
                  ]
                }
                selectedMatches={selectedMatches}
                toggleSelection={toggleSelection}
              />
            )}

            {/* 大小分 */}
            {['HHTZ', 'DXF'].includes(betPlayActiveTab) && (
              <RenderOddsCells
                handicapIndex={2}
                betColor={betPlayColorPurple}
                competition={competition}
                activePlayType={
                  index[
                    betPlayActiveTab as LotteryCommon.BasketballLotteryBettingType
                  ]
                }
                selectedMatches={selectedMatches}
                toggleSelection={toggleSelection}
              />
            )}

            {/* 胜负差 */}
            {betPlayActiveTab === 'SFC' &&
              competition.handicapDtos &&
              competition.handicapDtos[3] && (
                <View style={styles.oddsRow}>
                  <View>
                    <OddsLabel value="客胜" style={{height: 86}} />
                    <OddsLabel
                      value="主胜"
                      style={{height: 86, backgroundColor: betPlayColorGreen}}
                    />
                  </View>
                  <RenderOddsCells
                    handicapIndex={
                      index[
                        betPlayActiveTab as LotteryCommon.BasketballLotteryBettingType
                      ]
                    }
                    betColor={betPlayColorBlue}
                    competition={competition}
                    activePlayType={
                      index[
                        betPlayActiveTab as LotteryCommon.BasketballLotteryBettingType
                      ]
                    }
                    selectedMatches={selectedMatches}
                    toggleSelection={toggleSelection}
                  />
                </View>
              )}

            {/* 如果 activeBallPay === 0 时显示展开按钮 */}
            {betPlayActiveTab === 'HHTZ' && (
              <View style={styles.oddsRow}>
                <OddsLabel
                  value={competition.handicapDtos![3].playChineseName!}
                  style={[styles.w40, {backgroundColor: betPlayColorBrown}]}
                  textStyle={{fontSize: 12}}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setBasketballPlayMore({
                      isVisible: true,
                      competitionInfo: competition,
                    });
                  }}
                  className="flex-1 p-2 border border-gray-300  ">
                  <Text style={{textAlign: 'center'}}>展开胜负差玩法</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default BasketballBetListItem;

const styles = StyleSheet.create({
  matchCard: {
    backgroundColor: '#fff',
    padding: 10,
  },
  cardBorder: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  w40: {
    width: 40,
  },

  matchBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  deadlineBox: {
    backgroundColor: '#fff9f9',
    borderRadius: 5,
    paddingVertical: 5,
    width: 70,
  },
  deadlineText: {
    color: '#f53b57',
    fontSize: 12,
    textAlign: 'center',
  },

  oddsRow: {
    flexDirection: 'row',
  },
});
