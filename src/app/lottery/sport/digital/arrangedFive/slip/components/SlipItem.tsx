import React, {useMemo, useRef, useState} from 'react';
import {ArrangedFiveTicket, DigitalTicket} from '../../../core';
import RowSlipItem from './RowSlipItem';
import PositionSlipItem from './PositionSlipItem';
import {ArrangedFivePlayEnum, ArrangedFiveSubPlayEnum} from '../../constants';
const getItemType = (item: DigitalTicket) => {
  if (
    item.playMode === ArrangedFivePlayEnum.DirectPositioningDuplex &&
    item.subPlayMode === ArrangedFiveSubPlayEnum.PositioningDuplex
  ) {
    if (item.betCount > 1) {
      return 'position';
    } else {
      return 'normal';
    }
  } else {
    return 'normal';
  }
};
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
  const itemType = getItemType(item);
  console.log(item, '===========');

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
        item={item as ArrangedFiveTicket}
        ticketsMultiplier={ticketsMultiplier}
        setTicketsMultiplier={setTicketsMultiplier}
        removeTicket={removeTicket}
        setMultiplierModal={setMultiplierModal}
      />
    );
  }
};

export default SlipItem;
