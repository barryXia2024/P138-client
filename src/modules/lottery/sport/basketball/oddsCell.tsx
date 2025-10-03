
import { themeRedColor } from 'p138-react-common/utils/styles/color';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useLotteryInfoStore } from 'src/modules/lottery/store';

/**
 * 竞彩篮球赔率标签
 * @param value 赔率值
 * @param style 样式
 * @param textStyle 文本样式
 * @returns 竞彩篮球赔率标签
*/
export const OddsLabel = ({
  value,
  style,
  textStyle,
}: LotteryComponents.OddsLabelProps) => {
  const number = parseFloat(value);
  const color = number > 0 ? '#afd586' : '#7ea5da';
  const label = value === '让分胜负' ? '让分' : value
  return (
    <View
      style={[
        { borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
        number !== 0 && { backgroundColor: color }, // Only modify background color
        style,
      ]}>
      <Text
        className={`text-center ${number !== 0 && 'text-white'}`}
        style={[textStyle]}>
        {label ?? '-'}
      </Text>
    </View>
  );
};

/**
 * 竞彩篮球赔率单元格
 * @param competitionOddsDtos 赔率信息
 * @param handicapDtos 让球信息
 * @param isLast 是否是最后一个单元格
 * @param style 样式
 * @param textStyle 文本样式
 * @param value 值
 * @param toggleSelection 点击事件
 * @param isSelected 是否选中
 * @returns 竞彩篮球赔率单元格
*/
const OddsCell: React.FC<LotteryComponents.OddsCellProps> = React.memo(
  ({
    competitionOddsDtos,
    handicapDtos,
    isLast = false,
    style,
    textStyle,
    value,
    toggleSelection,
    isSelected,
  }) => {
    let isSingleBet =
      handicapDtos.playChineseName === '胜负差' || handicapDtos.single === '1';
    const isBettingDisabled = competitionOddsDtos.odds === 0;
    const { lotteryInfo } = useLotteryInfoStore()
    if (
      lotteryInfo?.lotteryName ===
      'BeijingSingleMatch'
    ) {
      isSingleBet = true;
    }
    
    return (
      <TouchableOpacity
        className="items-center"
        style={[
          { borderWidth: 1, borderColor: '#ccc' },
          isLast && { borderRightWidth: 0 },
          isSelected && { backgroundColor: themeRedColor },
          isSingleBet && { borderColor: themeRedColor, borderWidth: 0.5 },
          style,
        ]}
        disabled={isBettingDisabled}
        onPress={toggleSelection}>
        <Text
          style={[{ fontSize: 16 }, isSelected && { color: '#fff' }, textStyle]}>
          {value ??
            `${competitionOddsDtos.betItem === '大'
              ? '大于'
              : handicapDtos.playChineseName === '胜负差'
                ? competitionOddsDtos.betName
                : competitionOddsDtos.betItem
            }`}
          {handicapDtos.playChineseName==='大小分'&&<Text style={isSelected ? { color: '#fff' } : { color: '#999' }}>
            {handicapDtos.hanicap ?? '-'}
          </Text>}
        </Text>

        <Text
          style={[
            isSelected ? { color: '#fff' } : { color: '#999' },
            { fontSize: 16 },
          ]}>
          {isBettingDisabled ? '-' : competitionOddsDtos.odds ?? '-'}
        </Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isSelected === nextProps.isSelected; // 仅当 isSelect 改变时才重新渲染
  },
);

export default OddsCell;
