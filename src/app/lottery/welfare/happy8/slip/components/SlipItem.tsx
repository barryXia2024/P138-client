import React, {useMemo, useRef, useState} from 'react';
 
import RowSlipItem from './RowSlipItem';
import PositionSlipItem from './PositionSlipItem';
import { DigitalTicket, PositionTicket } from 'src/app/lottery/sport/digital/core';
 
 
const getItemType = (item: PositionTicket) => {
    
  return 'normal'
  
}
const SlipItem = ({
  item,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}: {
  item: DigitalTicket;
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
  
  return (
    <RowSlipItem
      item={item}
      ticketsMultiplier={ticketsMultiplier}
      setTicketsMultiplier={setTicketsMultiplier}
      removeTicket={removeTicket}
      setMultiplierModal={setMultiplierModal}
    />
  );
};

export default SlipItem;
