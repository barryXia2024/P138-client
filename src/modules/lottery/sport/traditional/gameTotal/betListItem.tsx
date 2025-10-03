import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  Image,
} from "react-native";



import { generateOddsCellKey } from "src/modules/lottery/utils/lottery";
import { formattedDate } from "p138-react-common/utils/fuc";


import { useBetInfoStore, useLotteryInfoStore } from "src/modules/lottery/store";

import OddsCell from "./oddsCell";

// MatchCardProps 类型定义
export type MatchCardProps = {
  match: LotteryDataSource.MatchInfo;
  isMatchBetList?: boolean;
  style?: StyleProp<ViewStyle>;
  showMore: () => void;
};

// TeamInfo 组件：显示球队信息
const TeamInfo: React.FC<{ match: LotteryDataSource.MatchInfo }> = ({
  match,
}) => {
  return (
    <View style={styles.teamInfo}>
      <View className="flex-row items-center">
        <Text style={styles.teamName}>{match.home}</Text>
        {match.homeLogo && (
          <Image
            source={{ uri: match.homeLogo }}
            style={{ width: 20, height: 20 }}
            resizeMode="stretch"
          />
        )}
      </View>
      <Text style={styles.vs}>VS</Text>
      <View className="flex-row items-center">
        {match.awayLogo && (
          <Image
            source={{ uri: match.awayLogo }}
            style={{ width: 20, height: 20 }}
            resizeMode="stretch"
          />
        )}
        <Text style={styles.teamName}>{match.away}</Text>
      </View>
    </View>
  );
};

// DeadlineBox 组件：显示比赛截止时间和分析按钮
const DeadlineBox: React.FC<{
  match: LotteryDataSource.MatchInfo;
  setShowAnalysisDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showAnalysisDetails: boolean;
}> = ({ match }) => {
  return (
    <TouchableWithoutFeedback>
      <View style={styles.deadlineBox}>
        {/* <Text style={styles.deadlineText}>
          {formattedWeek(match.competitionTime)}
        </Text> */}
        <Text style={styles.deadlineTime}>
          {formattedDate(match.competitionTime, "HH:mm")} 截止
        </Text>
        <Text style={[styles.deadlineText, styles.analysisButton]}>分析</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

// 主要比赛卡片组件
const WinLossBetListItem: React.FC<CompetitionProps.MatchCardProps> = ({
  match,
  isMatchBetList = false,

}) => {
  const [showAnalysisDetails, setShowAnalysisDetails] = useState(false);
  const { selectedMatches, toggleSelection } = useBetInfoStore();
  const { lotteryInfo } = useLotteryInfoStore();
  const styleArray: Record<number, StyleProp<ViewStyle>> = {
    0: { flex: 1 },
    1: { flex: 1 },
    2: { flex: 1 },
    3: { width: "30%" },
  };
  const maxMatchCount =
  lotteryInfo?.lotteryName === "WinLossLottery" ? 14 : 9;
  const renderOddsCells = (handicapIndex: number) => {
    const handicap = match.handicapDtos![handicapIndex];
    return (
      <View className="flex-row flex-wrap flex-1 h-full">
        {handicap.competitionOddsDtos?.map((competitionOddsDtos) => {
          const oddsCellKey = generateOddsCellKey(
            match.competitionId,
            handicap,
            competitionOddsDtos
          );
          const isSelected =
            selectedMatches[match.competitionId]?.includes(oddsCellKey);
          return (
            <OddsCell
              key={oddsCellKey}
              isSelected={isSelected}
              toggleSelection={() =>
                toggleSelection(
                  match.competitionId.toString(),
                  oddsCellKey,
                  maxMatchCount
                )
              }
              style={styleArray[handicapIndex]}
              handicapDtos={handicap}
              competitionOddsDtos={competitionOddsDtos}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View className="bg-white p-2">
      <View className="flex-row justify-between items-center">
        <Text style={[styles.league, { width: 80 }]}>
          {match.matchNum}.{match.leagueName}
        </Text>
        <TeamInfo match={match} />
      </View>

      <View className="flex-row justify-between items-center ">
        {!isMatchBetList && (
          <DeadlineBox
            match={match}
            setShowAnalysisDetails={setShowAnalysisDetails}
            showAnalysisDetails={showAnalysisDetails}
          />
        )}

        <View className="flex-row flex-1 h-full">{renderOddsCells(0)}</View>
      </View>
    </View>
  );
};

export default React.memo(WinLossBetListItem);

// 样式
const styles = StyleSheet.create({

  league: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    width: 70,
  },
  teamInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  vs: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },


  deadlineBox: {
    borderRadius: 5,
    paddingVertical: 5,
    width: 70,
    alignItems: "center",
    backgroundColor: "#fef9f9",
  },
  deadlineText: {
    fontSize: 12,
    color: "#f53b57",
  },
  deadlineTime: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  analysisButton: {
    color: "#f53b57",
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 14,
  },
  

});
