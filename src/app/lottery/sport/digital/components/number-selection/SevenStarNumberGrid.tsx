import React from 'react';
import {useSevenStarStore} from '../../lotteryTypes';
import BaseNumberGrid from '../common/BaseNumberGrid';

interface Props {
  positionIndex: number; // 0-6
}

const SevenStarNumberGrid: React.FC<Props> = ({positionIndex}) => {
  const positions = useSevenStarStore(s => s.positions);
  const toggleNumber = useSevenStarStore(s => s.toggleNumber);

  const selected = positions[positionIndex] ?? [];
  const numbers = Array.from({length: positionIndex === 6 ? 15 : 10}, (_, i) => i);

  return (
    <BaseNumberGrid
      numbers={numbers}
      selected={selected}
      onToggle={n => toggleNumber(positionIndex, n)}
      color="red"
      size="large"
      needZero
    />
  );
};

export default SevenStarNumberGrid;


