import React from 'react';
import {View, Text} from 'react-native';
import {useSuperLottoStore} from '../store';
import {SuperLottoPlayEnum} from '../../shared/enums';
import BaseNumberGrid from '../../shared/components/BaseNumberGrid';
import BetControls from '../../shared/components/BetControls';
import GridTitle from './GridTitle';

interface SuperLottoGridProps {
  onQuickPick?: () => void;
  onQuickPick5?: () => void;
}

const SuperLottoGrid: React.FC<SuperLottoGridProps> = ({
  onQuickPick,
  onQuickPick5,
}) => {
  const {
    positions,
    getUIConfig,
    toggleNumber,
    showMissNumbers,
    onMiss,
    playMode,
    subPlayMode,
  } = useSuperLottoStore();

  const config = getUIConfig();

  return (
    <View className="flex-1">
      {config.labels.map((labelConfig, index) => (
        <View
          key={index}
          style={{width: '100%'}}
          className={`p-2 bg-white justify-between items-center w-full overflow-hidden mb-3 ${index === 0 ? 'rounded-b-lg' : 'rounded-lg'}`}>
          <View className="bg-white    flex-row justify-between items-center w-full">
            <GridTitle
              playMode={playMode}
              playSubMode={subPlayMode}
              index={index}
            />
            {/* 机选控制按钮 */}
            {index === 0 && playMode === SuperLottoPlayEnum.NORMAL && (
              <BetControls
                showQuickPick={true}
                showQuickFivePick={true}
                showMissControl={true}
                showMiss={showMissNumbers}
                onQuickPick={onQuickPick}
                onQuickPick5={onQuickPick5}
                onMiss={onMiss}
              />
            )}
          </View>

          <View className="flex-row justify-between items-center w-full mt-2">
            <View>
              <Text className="text-md font-500">{labelConfig.label}</Text>
            </View>
            <BaseNumberGrid
              numbers={labelConfig.numbers}
              selected={positions[index] || []}
              onToggle={number => toggleNumber(index, number)}
              color={labelConfig.color}
              size="large"
              needZero={labelConfig.needZero}
              showDissmiss={showMissNumbers}
              className="bg-white rounded-b-lg pt-0"
              // dismissArray={dismissArrayData?.[index]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default SuperLottoGrid;
