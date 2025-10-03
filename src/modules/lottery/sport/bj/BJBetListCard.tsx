import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {formattedDate} from 'p138-react-common/utils/fuc';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import OddsCell, {OddsLabel} from '../football/oddsCell';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {
  generateOddsCellKey,
  parseOddsCellKey,
} from 'src/modules/lottery/utils/lottery';
import {LotteryHandicapDtosNameArray} from 'src/modules/lottery/constants';

import {useLotteryEventStore} from 'src/modules/lottery/store/event';
import CompetitionTeamInfo from '../../components/TeamInfo';

/**
 * 渲染赔率单元格
 * @param handicapIndex 让球索引
 * @param match 赛事信息
 * @param selectedMatches 选中的赛事
 * @param toggleSelection 点击事件
 * @param width 宽度
 * @param lotteryName 彩票名称
 * @returns 渲染赔率单元格
 */
const RenderOddsCells: React.FC<{
  handicapIndex: number;
  competition: LotteryDataSource.MatchInfo;
  selectedMatches: Record<string, any>;
  toggleSelection: any;
  width: string;
  lotteryName: CoreCommonEnum.LotteryName;
}> = ({
  handicapIndex,
  competition,
  selectedMatches,
  toggleSelection,
  width,
  lotteryName,
}) => {
  const playArray = LotteryHandicapDtosNameArray[lotteryName];
  if (!competition.handicapDtos) {
    return null;
  }

  const handicapArray = competition.handicapDtos.filter(
    competition => competition.playEnglishName === playArray[handicapIndex],
  );
  const handicap = handicapArray[0] ?? [];

  return (
    <View className="flex-wrap flex-row">
      <OddsLabel
        showHandicap={handicapIndex === 0}
        value={handicap.hanicap ?? ''}
        className="h-[50px]"
        style={{height: 50, marginTop: -1}}
      />
      {handicap.competitionOddsDtos?.map(competitionOddsDtos => {
        const oddsCellKey = generateOddsCellKey(
          competition.competitionId,
          handicap,
          competitionOddsDtos,
        );
        const isSelected =
          selectedMatches[competition.competitionId]?.includes(oddsCellKey);
        return (
          <OddsCell
            key={oddsCellKey}
            isSelected={isSelected}
            toggleSelection={() =>
              toggleSelection(
                competition.competitionId.toString(),
                oddsCellKey,
                14,
              )
            }
            style={[
              {height: 50, width, marginLeft: -1, marginTop: -1},
              handicapIndex === 0 && {flex: 1},
            ]}
            handicapDtos={handicap}
            competitionOddsDtos={competitionOddsDtos}
          />
        );
      })}
    </View>
  );
};

/**
 * 渲染让球赔率
 * @param handicapIndex 让球索引
 * @param width 宽度
 * @param activePlayType 玩法类型
 * @param openScore 打开比分弹窗
 * @param selectedMatches 选中的赛事
 * @param match 赛事信息
 * @param toggleSelection 点击事件
 * @param lotteryInfo 彩票信息
 * @returns 渲染让球赔率
 */
const RenderHandicapOdds: React.FC<{
  handicapIndex: number;
  width: string;
  activePlayType: number;
  openScore?: () => void;
  selectedMatches: Record<string, string[]>;
  competition: LotteryDataSource.MatchInfo;
  toggleSelection: any;
  lotteryInfo: ServerCoreLottery.ListCustomLotteryResult;
}> = ({
  handicapIndex,
  width,
  activePlayType,
  openScore,
  selectedMatches,
  competition,
  toggleSelection,
  lotteryInfo,
}) => {
  const infos = (oddsCellKey: string) => {
    const info = parseOddsCellKey(oddsCellKey);
    return info.betItem;
  };

  if (activePlayType === 1) {
    const isSelected = selectedMatches[competition.competitionId]?.length > 0;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={openScore}
        className="flex-1 items-center justify-center border border-gray-300 rounded-md py-4"
        style={{
          backgroundColor: isSelected ? themeRedColor : 'white',
        }}>
        {isSelected ? (
          <Text
            className="text-lg"
            style={{
              color: isSelected ? 'white' : 'black',
            }}>
            {selectedMatches[competition.competitionId]
              ?.map(item => infos(item))
              .join(' ')}
          </Text>
        ) : (
          <Text className="text-lg">点击选择 比分投注</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <RenderOddsCells
      handicapIndex={handicapIndex}
      competition={competition}
      selectedMatches={selectedMatches}
      toggleSelection={toggleSelection}
      width={width}
      lotteryName={lotteryInfo?.lotteryName}
    />
  );
};

/**
 * 北京单场赛事卡片
 * @param props 赛事卡片属性
 * @returns 北京单场赛事卡片
 */
const BJBetListCard: React.FC<CompetitionProps.MatchCardProps> = ({
  competition,
  isLastItem = false,
  isMatchBetList = false,
  style,
}) => {
  const {selectedMatches, betPlayActiveTab, toggleSelection} =
    useBetInfoStore();
  const {setFootballPlayMore} = useLotteryEventStore();
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const index: Record<LotteryCommon.BeijingSingleMatchBettingType, number> = {
    SPF: 0,
    CBF: 1,
    ZJQ: 2,
    BQC: 3,
    SXDS: 4,
    SFGG: 5,
  };

  return (
    <View
      className={`bg-white p-2 ${!isLastItem && styles.cardBorder} mb-2`}
      style={[style]}>
      <View className="flex-row items-center">
        <Text className="text-center text-sm w-20">
          {competition.leagueName}
        </Text>
        <CompetitionTeamInfo competition={competition} />
      </View>

      <View className="flex-row justify-between items-center">
        {!isMatchBetList && (
          <TouchableOpacity activeOpacity={1} style={styles.deadlineBox}>
            <Text style={styles.deadlineText}>{competition.matchNum}</Text>
            <Text style={styles.deadlineTime}>
              {formattedDate(competition.competitionTime, 'HH:mm')} 截止
            </Text>
            <Text style={[styles.deadlineText, styles.analysisButton]}>
              分析
            </Text>
          </TouchableOpacity>
        )}

        <View className="  flex-1">
          <RenderHandicapOdds
            handicapIndex={
              index[
                betPlayActiveTab as LotteryCommon.BeijingSingleMatchBettingType
              ]
            }
            width={
              ['80', '25%', '25%', '20%', '25%', '50%'][
                index[
                  betPlayActiveTab as LotteryCommon.BeijingSingleMatchBettingType
                ]
              ]
            }
            activePlayType={
              index[
                betPlayActiveTab as LotteryCommon.BeijingSingleMatchBettingType
              ]
            }
            openScore={() => {
              setFootballPlayMore({
                isVisible: true,
                isScoreDialogVisible: true,
                competitionInfo: competition,
              });
            }}
            selectedMatches={selectedMatches}
            competition={competition}
            toggleSelection={toggleSelection}
            lotteryInfo={lotteryInfo as ServerCoreLottery.ListCustomLotteryResult}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(BJBetListCard);

const styles = StyleSheet.create({
  cardBorder: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  deadlineBox: {
    borderRadius: 5,
    paddingVertical: 5,
    width: 70,
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 14,
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
    marginTop: 5,
  },
});
