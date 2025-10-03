import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import {ScoreButtonProps} from '../types';

const ScoreButton: React.FC<ScoreButtonProps> = ({
  competition,
  selectedMatches,
  onPress,
}) => {
  const hasSelectedItems = (selectedMatches[competition.competitionId]?.length || 0) > 0;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        styles.scoreButton,
        {
          backgroundColor: hasSelectedItems ? themeRedColor : 'white',
        },
      ]}>
      <Text
        style={[
          styles.scoreButtonText,
          {
            color: hasSelectedItems ? 'white' : 'black',
          },
        ]}>
        点击选择 比分投注
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scoreButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 16,
  },
  scoreButtonText: {
    fontSize: 18,
  },
});

export default React.memo(ScoreButton); 