import { themeRedColor } from 'p138-react-common/utils/styles/color';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';


type OddsCellProps = {
  competitionOddsDtos:  LotteryDataSource.CompetitionOddsDto;
  handicapDtos: LotteryDataSource.HandicapDto;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isConfirmed?: boolean; // 是否可取消
  toggleSelection: () => void;
  isSelected: boolean;
};

export const OddsLabel = (props: {value: string}) => {
  const number = parseFloat(props.value);
  const color = number > 0 ? '#afd586' : '#7ea5da';
  return (
    <View style={[styles.oddsLabel, number !== 0 && {backgroundColor: color}]}>
      <Text
        style={[
          {textAlign: 'center'},
          number !== 0 && {color: '#fff'},
        ]}>
        {`${props.value}`}
      </Text>
    </View>
  );
};

const OddsCell: React.FC<OddsCellProps> = React.memo(
  ({
    competitionOddsDtos,
    isLast = false,
    style,
    textStyle,
    toggleSelection,
    isSelected,
  }) => {
    const map: Record<string, number> = {
      胜: 3,
      平: 1,
      负: 0,
    };
    return (
      <TouchableOpacity
        style={[
          {justifyContent: 'center',alignItems: 'center'},
          {borderWidth: 1, borderColor: '#ccc'},
          isLast && styles.oddsCellLast, // Last cell style
          isSelected && {backgroundColor: themeRedColor}, // Selected state
          style,
        ]}
        activeOpacity={1}
        disabled={!competitionOddsDtos.odds}
        onPress={toggleSelection}>
        <Text
          style={[
            {fontSize: 14},
            isSelected && {color: '#fff'}, // Change text color when selected
            textStyle && textStyle,
          ]}>
          {map[competitionOddsDtos.betItem]}({competitionOddsDtos.betItem})
        </Text>

        <Text
          style={[
            isSelected ? {color: '#fff'} : {color: '#999'},
            {fontSize: 14},
          ]}>
          {competitionOddsDtos.odds??'-'}
        </Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isSelected === nextProps.isSelected; // 仅当 isSelect 改变时才重新渲染
  },
);

export default OddsCell;

const styles = StyleSheet.create({
  oddsLabel: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oddsCellLast: {
    borderRightWidth: 0,
  },
});
