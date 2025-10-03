import React from 'react';
 
import RowSlipItem from './RowSlipItem';
import PositionSlipItem from './PositionSlipItem';
import { SuperLottoPlayEnum, SuperLottoSubPlayEnum } from '../../constants/index';
import { DigitalLotteryNames } from '../../../lotteryTypes/configs/lotteryConfigs';
export interface SuperLottoTicket  {
  lotteryName: DigitalLotteryNames;
  betId: string;
  betAmount: number;
  betCount: number;
 
  positions: number[][]; // 每个位置的选号数组
  mode: 'normal' | 'dantuo';
  append: '1' | '2';
  playMode: SuperLottoPlayEnum;
  subPlayMode: SuperLottoSubPlayEnum;
}

const getItemType = (item: SuperLottoTicket) => {
  return 'normal';
};
const SlipItem = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}: {
  item: SuperLottoTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: any;
  }) => void;
}) => {
  const itemType = getItemType(item);

  if (itemType === 'normal') {
    return (
      <RowSlipItem
        item={item}
        ticketsMultiplier={ticketsMultiplier}
        setTicketsMultiplier={setTicketsMultiplier}
        removeTicket={removeTicket}
        setMultiplierModal={setMultiplierModal}
      />
    );
  } else {
    return (
      <PositionSlipItem
        item={item}
        ticketsMultiplier={ticketsMultiplier}
        setTicketsMultiplier={setTicketsMultiplier}
        removeTicket={removeTicket}
        setMultiplierModal={setMultiplierModal}
      />
    );
  }
};

export default SlipItem;
