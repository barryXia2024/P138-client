import React from 'react';
import {View, StyleSheet} from 'react-native';
import OddsCell from '../../oddsCell';
import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {isAfterWinOther} from '../utils/oddsUtils';
import LeftComponent from './LeftComponent';
import {OddsSelectionProps} from '../types';

const OddsRowRenderer: React.FC<OddsSelectionProps> = ({
  handicapDto,
  competitionId,
  lotteryName,
  currentConfig,
  isOddsSelected,
  toggleOddsSelection,
}) => {
  if (!handicapDto?.competitionOddsDtos || !currentConfig) return null;

  return (
    <View style={styles.oddsRow}>
      <LeftComponent handicapDto={handicapDto} lotteryName={lotteryName} />
      <View style={styles.oddsCellsWrapper}>
        {handicapDto.competitionOddsDtos.map(competitionOddsDto => {
          const oddsCellKey = generateOddsCellKey(
            Number(competitionId),
            handicapDto,
            competitionOddsDto,
          );
          const isSelected = isOddsSelected(oddsCellKey);

          const shouldAddEmptyCells = isAfterWinOther(
            competitionOddsDto,
            handicapDto,
            lotteryName,
          );

          return (
            <React.Fragment key={oddsCellKey}>
              <View style={styles.oddsCellWrapper}>
                <OddsCell
                  toggleSelection={() => toggleOddsSelection(oddsCellKey)}
                  isSelected={isSelected}
                  isConfirmed={false}
                  textStyle={styles.oddsCellText}
                  handicapDtos={handicapDto}
                  competitionOddsDtos={competitionOddsDto}
                  style={styles.oddsCell}
                />
              </View>
              {shouldAddEmptyCells &&
                Array.from({
                  length: currentConfig.emptyCellsAfterWinOther,
                }).map((_, index) => (
                  <View key={`empty-${index}`} style={styles.emptyCell} />
                ))}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  oddsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  oddsCellsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  oddsCell: {
    marginLeft: -0.5,
    marginTop: -0.5,
    
  },
  oddsCellWrapper: {
    width: '20%',
  },
  oddsCellText: {
    fontSize: 15,
  },
  emptyCell: {
    width: '20%',
  },
});

export default OddsRowRenderer; 