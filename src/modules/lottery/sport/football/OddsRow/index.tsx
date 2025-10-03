import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import OddsCell, {OddsLabel} from '../oddsCell';
import {useBetInfoStore} from 'src/modules/lottery/store';
import {useLotteryEventStore} from 'src/modules/lottery/store/event';
import {themeRedColor} from 'p138-react-common/utils/styles/color';
import {useOddsRow} from './hooks/useOddsRow';
import {OddsRowProps} from './types';
import RenderOddsCells from './components/RenderOddsCells';
import SingleTip from './components/SingleTip';

/**
 * 足球赔率行组件
 * 根据投注类型渲染不同的赔率显示方式
 */
const OddsRow: React.FC<OddsRowProps> = React.memo(({competition}) => {
  const {selectedMatches, toggleSelection} = useBetInfoStore();
  const {setFootballPlayMore} = useLotteryEventStore();

  const {
    handicapDtos,
    oddsCellStyle,
    selectedText,
    hasSelectedItems,

    currentBettingConfig,
  } = useOddsRow(competition);

  /** 投注按钮点击 */
  const handleScorePress = () => {
    setFootballPlayMore({
      isVisible: true,
      isScoreDialogVisible: true,
      competitionInfo: competition,
    });
  };

  // 使用配置判断是否为特殊按钮
  if (currentBettingConfig.isSpecialButton) {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleScorePress}
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
          {hasSelectedItems ? selectedText : '点击选择 比分投注'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {handicapDtos.map(handicapDto => (
        <View
          key={handicapDto?.playEnglishName ?? '-'}
          style={styles.handicapRow}>
          <OddsLabel
            value={handicapDto?.hanicap || '0'}
            showHandicap={currentBettingConfig.showHandicap}
          />
          <View style={styles.oddsWrapper}>
            <RenderOddsCells
              handicapDto={handicapDto}
              competition={competition}
              oddsCellStyle={oddsCellStyle}
              toggleSelection={toggleSelection}
              selectedMatches={selectedMatches}
            />
          </View>
          <SingleTip
            handicapDto={handicapDto}
            showSingleTip={currentBettingConfig.showSingleTip}
          />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
 
  },
  handicapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
      // height:'100%'
  },
  oddsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    // height:'100%'
  },
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

OddsRow.displayName = 'OddsRow';

export default OddsRow;
