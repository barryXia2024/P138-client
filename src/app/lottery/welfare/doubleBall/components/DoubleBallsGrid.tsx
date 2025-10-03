import React, {useCallback,  } from 'react';
import {View,  } from 'react-native';

import BallsGrid from './BallsGrid';
import {DoubleBallPlayEnum} from '../constants';
import {useDoubleBallStore} from '../store/useDoubleBallStore';
import GridTitle from './GridTitle';
import {UIUnit} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';

const DoubleBallsGrid: React.FC<{
  activeUI: UIUnit;
  onToggle: (index: number, n: number) => void;
}> = ({activeUI, onToggle}) => {
  const {playMode, subPlayMode, positions, quickPick} = useDoubleBallStore();

  console.log(positions, 'positions');

  const getNumbers = useCallback(
    (index: number) => {
      return activeUI?.labels[index]?.numbers;
    },
    [activeUI],
  );

  console.log(activeUI, 'positions');
  const onQuickPick = useCallback(() => {
    quickPick();
  }, [onToggle]);
  const onQuickPick5 = useCallback(() => {
    onToggle(0, 1);
    onToggle(1, 1);
  }, [onToggle]);
  const onMiss = useCallback(() => {
    onToggle(0, 1);
    onToggle(1, 1);
  }, [onToggle]);

  return (
    <View className="flex-1 bg-gray-100">
      <BallsGrid<DoubleBallPlayEnum, DoubleBallPlayEnum>
        activeUI={activeUI}
        playMode={playMode!}
        playSubMode={subPlayMode!}
        getNumbers={getNumbers}
        GridTitle={GridTitle}
        getSelected={i => positions[i] ?? []}
        onToggle={onToggle}
        onQuickPick={onQuickPick}
        onQuickPick5={onQuickPick5}
        onMiss={onMiss}
        showMissControl={false}
      />
    </View>
  );
};

export default DoubleBallsGrid;
