import React from 'react';
import {Text} from 'react-native';

import {resolveSuperLottoStrategy} from '../utils';

import CommonBetFooter from '../../components/common/CommonBetFooter';
import {useSuperLottoStore} from '../store/useSuperLottoStore';
import {SuperLottoPlayEnum} from '../../types';

// 通用数字彩票Footer组件
interface DigitalBetFooterProps {
  onNextStep: () => void;
  canProceed: boolean;
}

const SuperLottoFooter: React.FC<DigitalBetFooterProps> = ({
  onNextStep,
  canProceed,
}) => {
  const state = useSuperLottoStore(s => s);

  const getBetCount = resolveSuperLottoStrategy(state.activeRules ?? [], {
    play: state.playMode,
    subPlay: state.subPlayMode,
  });
  console.log('state.positions', state.playMode);

  const summary =
    state.playMode === SuperLottoPlayEnum.NORMAL ? (
      <Text className="text-center text-md py-4 text-lg">
        已选红{' '}
        <Text className="text-red-500">{state.positions[0]?.length}</Text>
        个，蓝球
        <Text className="text-blue-500">{state.positions[1]?.length}</Text>个
      </Text>
    ) : (
      <Text className="text-center text-md py-4 text-lg">
        已选前区胆码
        <Text className="text-red-500">{state.positions[1]?.length}</Text>
        个，前区拖码
        <Text className="text-red-500">{state.positions[1]?.length}</Text>
        个，后区胆码
        <Text className="text-blue-500">{state.positions[2]?.length}</Text>
        个，后区拖码
        <Text className="text-blue-500">{state.positions[3]?.length}</Text>个
      </Text>
    );

  return (
    <CommonBetFooter
      summary={summary}
      betCount={getBetCount.getBetCount(state.positions)}
      betAmount={getBetCount.getBetCount(state.positions) * 2}
      canProceed={canProceed}
      onClear={state.clearSelection}
      onNextStep={onNextStep}
    />
  );
};

export default SuperLottoFooter;
