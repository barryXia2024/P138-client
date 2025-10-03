import React from 'react';
import {View, StyleSheet} from 'react-native';
import OddsCell, {OddsLabel} from '../../oddsCell';
import {HandicapRowProps} from '../types';
import RenderOddsCells from './RenderOddsCells';

const HandicapRow: React.FC<HandicapRowProps> = ({
  handicapDto,
  competition,
  oddsCellStyle,
  toggleSelection,
  selectedMatches,
}) => {
  return (
    <View style={styles.handicapRow} key={handicapDto.hanicap}>
      <OddsLabel value={handicapDto.hanicap || '0'} />
      <View style={styles.oddsContainer}>
        <RenderOddsCells
          handicapDto={handicapDto}
          competition={competition}
          oddsCellStyle={oddsCellStyle}
          toggleSelection={toggleSelection}
          selectedMatches={selectedMatches}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  handicapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  oddsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default React.memo(HandicapRow); 