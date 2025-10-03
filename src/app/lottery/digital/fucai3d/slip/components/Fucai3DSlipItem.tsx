import React, {useMemo, useRef, useState} from 'react';
import {Fucai3DTicket} from '../../core/types';
import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../../shared/enums';
import PositionSlipItem from './PositionSlipItem';
import RowSlipItem from './RowSlipItem';

const getItemType = (item: Fucai3DTicket) => {
  if (
    item.playMode === Fucai3DPlayEnum.DirectSelection &&
    item.subPlayMode === Fucai3DSubPlayEnum.PositioningDuplex
  ) {
    if (item.betCount > 1) {
      return 'position';
    } else {
      return 'normal';
    }
  } else if (
    (item.playMode === Fucai3DPlayEnum.TwoD &&
      item.subPlayMode === Fucai3DSubPlayEnum.TwoD) ||
    (item.playMode === Fucai3DPlayEnum.OneD &&
      item.subPlayMode === Fucai3DSubPlayEnum.OneD)
  ) {
    return 'position';
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
  item: Fucai3DTicket;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (multiplier: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: Fucai3DTicket;
  }) => void;
}) => {
  const itemType = getItemType(item);
  console.log('itemType', itemType);

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
