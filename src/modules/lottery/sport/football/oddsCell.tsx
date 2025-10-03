import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';

/**
 * 赔率标签
 * @param value 赔率值
 * @param className 样式类名
 * @param style 样式
 * @returns 赔率标签
 */
export const OddsLabel = ({
  value,
  className,
  style,
  showHandicap,
}: {
  value: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
  showHandicap: boolean;
}) => {
  const number = parseFloat(value);
  const color = number > 0 ? '#afd586' : '#7ea5da';
  if (!showHandicap) return null;
  return (
    <View
      className={className}
      style={[
        styles.oddsLabel,
        number !== 0 && {backgroundColor: color},
        style,
      ]}>
      <Text style={[{textAlign: 'center'}, number !== 0 && {color: '#fff'}]}>
        {value}
      </Text>
    </View>
  );
};

/**
 * 赔率单元格
 * @param competitionOddsDtos 赔率信息
 * @param handicapDtos 让球信息
 * @param isLast 是否是最后一个单元格
 * @param style 样式
 * @param textStyle 文本样式
 * @param toggleSelection 点击事件
 * @param isSelected 是否选中
 * @param className 样式类名
 * @returns 赔率单元格
 */
const OddsCell: React.FC<CompetitionProps.OddsCellProps> = ({
  competitionOddsDtos,
  handicapDtos,
  isLast = false,
  style,
  textStyle,
  toggleSelection,
  isSelected,
}) => {
  const {playChineseName, single} = handicapDtos;
  const {betPlayActiveTab} = useBetInfoStore();
  const {lotteryInfo} = useLotteryInfoStore();
  let isSiger = false;
  if (playChineseName === '让球胜平负' || playChineseName === '胜平负') {
    isSiger = single === '1';
  } else {
    isSiger = true;
  }

  // if(betPlayActiveTab!=='default'){
  //   // console.log(activePlayType);
  //   isSiger = true;
  // }
  if (
    lotteryInfo?.lotteryName === 'BeijingSingleMatch' ||
    betPlayActiveTab === 'C1C'
  ) {
    isSiger = true;
  }
  const isOdds = competitionOddsDtos.odds && competitionOddsDtos.odds > 0;
  const selectedStyle = isSelected
    ? {backgroundColor: themeRedColor, color: '#fff'}
    : {};
  const singleBetStyle = isSiger
    ? {borderColor: themeRedColor, borderWidth: 0.5}
    : {};
  const winColor = {
    '-1': 'green',
    '0': 'gray',
    '1': '#f53b57',
  };
  const winText = {
    '-1': '↓',
    '0': '',
    '1': '↑',
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={toggleSelection}
      style={[
        styles.oddsCell,
        isLast && styles.oddsCellLast,
        selectedStyle,
        singleBetStyle,
        style,
      ]}
      disabled={!isOdds}>
      <Text style={[styles.oddsText, selectedStyle, textStyle]}>
        {competitionOddsDtos.betItem}
      </Text>
      <Text
        style={[
          styles.oddsText,
          selectedStyle,
          {
            color: isSelected
              ? '#fff'
              : winColor[competitionOddsDtos.winColor as keyof typeof winColor],
          },
        ]}>
        {competitionOddsDtos.odds ?? '-'}{' '}
        {winText[competitionOddsDtos.winColor as keyof typeof winText]}
      </Text>
    </TouchableOpacity>
  );
};

export default OddsCell;

const styles = StyleSheet.create({
  oddsLabel: {
    borderWidth: 1,
    borderColor: '#ddd',
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
  },
  oddsCell: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    // paddingVertical:5,
  },
  oddsCellLast: {
    borderRightWidth: 0,
  },
  oddsText: {
    fontSize: 15,
    lineHeight: 20,
  },
});
