import React from 'react';
import {useFucai3DStore} from '../store';
import CommonBetFooter from '../../shared/components/CommonBetFooter';

interface Fucai3DFooterProps {
  onNextStep: () => void;
  canProceed: boolean;
}

const Fucai3DFooter: React.FC<Fucai3DFooterProps> = ({
  onNextStep,
  canProceed,
}) => {
  const state = useFucai3DStore(s => s);

  // 计算注数和金额
  const betCount = state.getBetCount();
  const betAmount = state.getBetAmount();

  

  return (
    <CommonBetFooter
      summary=''
      betCount={betCount}
      betAmount={betAmount}
      canProceed={canProceed}
      onClear={state.clearSelection}
      onNextStep={onNextStep}
    />
  );
};

export default Fucai3DFooter;
