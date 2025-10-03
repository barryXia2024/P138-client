import React from 'react';
import {
  Text,
  TouchableOpacity,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {useBetInfoStore} from 'src/modules/lottery/store';
import {useLotteryEventStore} from 'src/modules/lottery/store/event';

/**
 * 足球竞彩更多玩法按钮
 * @param competition 比赛信息
 * @returns 更多玩法按钮
 */
 const PlayMoreButton: React.FC<CompetitionProps.MatchCardProps> = ({
  competition,
}) => {
  const {selectedMatches, betPlayActiveTab} = useBetInfoStore();
  const {setFootballPlayMore} = useLotteryEventStore();
  const selectedOddsCount =
    selectedMatches[competition.competitionId]?.length ?? 0;

  const buttonTextStyles: StyleProp<TextStyle> = {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    color: selectedOddsCount > 0 ? '#fff' : '#333',
  };

  const buttonStyles: StyleProp<ViewStyle> = {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginLeft: -6,
    maxHeight: 84,
    backgroundColor: selectedOddsCount > 0 ? '#f04b49' : '#fff',
    borderWidth: selectedOddsCount === 0 ? 1 : 0,
    borderColor: selectedOddsCount === 0 ? '#ccc' : 'transparent',
  };

  if (betPlayActiveTab !== 'HHTZ') return null;

  return (
    <TouchableOpacity
      onPress={() => {
        setFootballPlayMore({
          isVisible: true,
          isScoreDialogVisible: false,
          competitionInfo: competition,
        });
      }}
      style={buttonStyles}>
      <Text style={buttonTextStyles}>
        {selectedOddsCount > 0 ? '已选' : '更多'}
      </Text>
      <Text style={buttonTextStyles}>
        {selectedOddsCount > 0 ? `${selectedOddsCount}项` : '玩法'}
      </Text>
    </TouchableOpacity>
  );
};
export default React.memo(PlayMoreButton);