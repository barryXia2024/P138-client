import React, {useCallback,  } from 'react';
import {View,  } from 'react-native';

import BallsGrid from './BallsGrid';
import {SevenHappyPlayEnum} from '../constants';
import {useSevenHappyStore} from '../store/useSevenHappyStore';
import GridTitle from './GridTitle';
import {UIUnit} from 'src/app/lottery/sport/digital/lotteryTypes/configs/lotteryConfigs';

const SevenHappyGrid: React.FC<{
  activeUI: UIUnit;
  onToggle: (index: number, n: number) => void;
}> = ({activeUI, onToggle}) => {
  const {playMode, subPlayMode, positions,quickPick} = useSevenHappyStore();

  console.log(positions, 'positions');

  const getNumbers = useCallback(
    (index: number) => {
      return activeUI?.labels[index]?.numbers;
    },
    [activeUI],
  );

  console.log(activeUI, 'positions');
 
  const onMiss = useCallback(() => {
    onToggle(0, 1);
    onToggle(1, 1);
  }, [onToggle]);

  return (
    <View className="flex-1 bg-gray-100">
      <BallsGrid<SevenHappyPlayEnum, SevenHappyPlayEnum>
        activeUI={activeUI}
        playMode={playMode!}
        playSubMode={subPlayMode!}
        getNumbers={getNumbers}
        GridTitle={GridTitle}
        getSelected={i => positions[i] ?? []}
        onToggle={onToggle}
        onQuickPick={()=>{
         
          quickPick();
        }}
        onMiss={onMiss}
        showMissControl={false}
      />
    </View>
  );
};

export default SevenHappyGrid;
