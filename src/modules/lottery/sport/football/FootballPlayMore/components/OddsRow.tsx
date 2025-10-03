import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import OddsCell, {OddsLabel} from '../../oddsCell';
import {createOddsCell} from '../utils/oddsUtils';

interface OddsRowProps {
  handicapDto: LotteryDataSource.HandicapDto;
  competitionId: string;
  isSelected: (key: string) => boolean;
  onToggle: (key: string) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const OddsRow: React.FC<OddsRowProps> = ({
  handicapDto,
  competitionId,
  isSelected,
  onToggle,
  style,
  textStyle,
}) => {
  if (!handicapDto?.competitionOddsDtos) return null;

  return (
    <View style={styles.oddsRow}>
      <OddsLabel value={handicapDto.hanicap ?? ''} showHandicap />
      {handicapDto.competitionOddsDtos.map(competitionOddsDto => {
        const oddsCellData = createOddsCell(
          Number(competitionId),
          handicapDto,
          competitionOddsDto,
          false,
          onToggle,
          style,
          textStyle,
        );

        const isSelectedState = isSelected(oddsCellData.oddsCellKey);
        oddsCellData.props.isSelected = isSelectedState;

        return <OddsCell key={oddsCellData.key} {...oddsCellData.props} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  oddsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default OddsRow;
