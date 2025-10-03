import React from 'react';
import {Text} from 'react-native';
import {useSuperLottoStore} from '../store';
import CommonBetFooter from '../../shared/components/CommonBetFooter';
import { SuperLottoPlayEnum } from '../../shared/enums';

interface SuperLottoFooterProps {
  onNextStep: () => void;
  canProceed: boolean;
}

const SuperLottoFooter: React.FC<SuperLottoFooterProps> = ({
  onNextStep,
  canProceed,
}) => {
  const state = useSuperLottoStore(s => s);

  // 计算注数和金额
  const betCount = state.getBetCount();
  const betAmount = state.getBetAmount();

  // 选号摘要
  const summary =
    state.playMode === SuperLottoPlayEnum.NORMAL ? (
      <Text className="text-center text-md py-3 text-md">
        已选红{' '}
        <Text className="text-red-500">{state.positions[0]?.length||0}</Text>
        个，蓝球
        <Text className="text-blue-500">{state.positions[1]?.length||0}</Text>个
      </Text>
    ) : (
      <Text className="text-center text-md py-3 text-md">
        已选前区胆码
        <Text className="text-red-500">{state.positions[0]?.length||0}</Text>
        个，前区拖码
        <Text className="text-red-500">{state.positions[1]?.length||0}</Text>
        个，后区胆码
        <Text className="text-blue-500">{state.positions[2]?.length||0}</Text>
        个，后区拖码
        <Text className="text-blue-500">{state.positions[3]?.length||0}</Text>个
      </Text>
    );

  return (
    <CommonBetFooter
      summary={summary}
      betCount={betCount}
      betAmount={betAmount}
      canProceed={canProceed}
      onClear={state.clearSelection}
      onNextStep={onNextStep}
    />
  );
};

export default SuperLottoFooter;