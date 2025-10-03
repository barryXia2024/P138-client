import React from 'react';
 
import {useSuperLottoStore} from '../../lotteryTypes';
import BaseNumberGrid from '../common/BaseNumberGrid';

interface DanTuoGridProps {
  role?: 'dan' | 'tuo';
  maxNumber: number;
  color: 'red' | 'blue';
  minNumber: number;
  needZero?: boolean;
}

export const NumberSelectionGrid: React.FC<DanTuoGridProps> = ({
  maxNumber,
  color,
  role,
  minNumber=0,
  needZero = false,
}) => {
  const mode = useSuperLottoStore(s => s.mode);
  const selectedRed = useSuperLottoStore(s => s.red);
  const selectedBlue = useSuperLottoStore(s => s.blue);
  const redDan = useSuperLottoStore(s => s.redDan);
  const redTuo = useSuperLottoStore(s => s.redTuo);
  const blueDan = useSuperLottoStore(s => s.blueDan);
  const blueTuo = useSuperLottoStore(s => s.blueTuo);

  const toggleRed = useSuperLottoStore(s => s.toggleRed);
  const toggleBlue = useSuperLottoStore(s => s.toggleBlue);
  const toggleRedDan = useSuperLottoStore(s => s.toggleRedDan);
  const toggleRedTuo = useSuperLottoStore(s => s.toggleRedTuo);
  const toggleBlueDan = useSuperLottoStore(s => s.toggleBlueDan);
  const toggleBlueTuo = useSuperLottoStore(s => s.toggleBlueTuo);

  const numbers = Array.from({length: maxNumber+(1-minNumber)}, (_, i) => i + minNumber);
  const isDanTuo = mode === 'dantuo' && role;

  const getSelectedList = () => {
    if (!isDanTuo) return color === 'red' ? selectedRed : selectedBlue;
    if (color === 'red') return role === 'dan' ? redDan : redTuo;
    return role === 'dan' ? blueDan : blueTuo;
  };

  const isSelected = (n: number) => getSelectedList().includes(n);

  const handlePress = (n: number) => {
    if (!isDanTuo) {
      if (color === 'red') toggleRed(n);
      else toggleBlue(n);
      return;
    }
    if (role === 'dan') {
      if (color === 'red' && !redDan.includes(n) && redDan.length >= 4) {
        Toast.show('红球胆码最多选4个');
        return;
      }
      if (color === 'blue' && !blueDan.includes(n) && blueDan.length >= 1) {
        Toast.show('蓝球胆码最多选1个');
        return;
      }
      if (color === 'red') toggleRedDan(n);
      else toggleBlueDan(n);
    } else {
      if (color === 'red') toggleRedTuo(n);
      else toggleBlueTuo(n);
    }
  };

  return (
    <BaseNumberGrid
      numbers={numbers}
      selected={numbers.filter(n => isSelected(n))}
      onToggle={handlePress}
      needZero={needZero}
      color={color}
      size="large"
    />
  );
};
