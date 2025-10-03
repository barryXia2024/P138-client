import React from 'react';
import {FlatList} from '@/p138-react-common/components/FlatList';
import {SuperLottoTicket} from '../../../core/types';
import SuperLottoSlipItem from './SuperLottoSlipItem';
import {AppendFlagEnum} from '../../../shared/types';

interface TicketListProps {
  tickets: SuperLottoTicket[];
  append: AppendFlagEnum;
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (m: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: SuperLottoTicket;
  }) => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  append,
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}) => {
  return (
    <FlatList
      data={tickets}
      renderItem={({item}) => (
        <SuperLottoSlipItem
          item={item}
          append={append}
          ticketsMultiplier={ticketsMultiplier}
          setTicketsMultiplier={setTicketsMultiplier}
          removeTicket={removeTicket}
          setMultiplierModal={setMultiplierModal}
        />
      )}
    />
  );
};

export default TicketList;


