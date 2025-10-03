import React from 'react';
import {Text} from 'react-native';
import {useSevenStarStore} from '../../lotteryTypes';
import CommonBetFooter from '../common/CommonBetFooter';

interface SevenStarBetFooterProps {
  onNextStep: () => void;
  canProceed: boolean;
}

const SevenStarBetFooter: React.FC<SevenStarBetFooterProps> = ({
  onNextStep,
  canProceed,
}) => {
  const positions = useSevenStarStore(s => s.positions);
  const betCount = useSevenStarStore(s => s.getBetCount());
  const betAmount = useSevenStarStore(s => s.getBetAmount());
  const clearSelection = useSevenStarStore(s => s.clearSelection);

 

  return (
    <CommonBetFooter
      summary={null}
      betCount={betCount}
      betAmount={betAmount}
      canProceed={canProceed}
      onClear={clearSelection}
      onNextStep={onNextStep}
    />
  );
};

export default SevenStarBetFooter;


