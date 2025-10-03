import React, {useCallback} from 'react';
import {View} from 'react-native';

import BallsGrid from './BallsGrid';
import {Happy8PlayEnum, QuickPickButtonEnum} from '../constants';
import {useHappy8Store} from '../store/useHappy8Store';
import GridTitle from './GridTitle';
import {UIUnit} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';

const Happy8Grid: React.FC<{
  activeUI: UIUnit;
  onToggle: (index: number, n: number) => void;
}> = ({activeUI, onToggle}) => {
  const {
    playMode,
    subPlayMode,
    positions,
    quickPick,
    selectedPickN,
    fullTuo,
    showDissMiss,
    setShowDissMiss,
    lotteryData,
  } = useHappy8Store();

  const getNumbers = useCallback(
    (index: number) => {
      return activeUI?.labels[index]?.numbers;
    },
    [activeUI],
  );

  const onMiss = useCallback(() => {
    setShowDissMiss(!showDissMiss);
  }, [showDissMiss]);

  return (
    <View className="flex-1 bg-gray-100">
      <BallsGrid<Happy8PlayEnum, QuickPickButtonEnum>
        activeUI={activeUI}
        playMode={playMode!}
        playSubMode={subPlayMode!}
        getNumbers={getNumbers}
        GridTitle={GridTitle}
        getSelected={i => positions[i] ?? []}
        onToggle={onToggle}
        onQuickPick={() => {
          quickPick(selectedPickN);
        }}
        onFullTuo={() => {
          fullTuo();
        }}
        onMiss={onMiss}
        showMiss={showDissMiss}
        showMissControl
        lotteryData={lotteryData}
      />
    </View>
  );
};

export default Happy8Grid;
