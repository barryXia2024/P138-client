import React from 'react';
import {FlatList} from '@/p138-react-common/components/FlatList';
 
 
 
import { Fucai3DTicket } from '../../core/types';
import Fucai3DSlipItem from './Fucai3DSlipItem';
 

interface TicketListProps {
  tickets: Fucai3DTicket[];
 
  ticketsMultiplier: Record<string, number>;
  setTicketsMultiplier: (m: Record<string, number>) => void;
  removeTicket: (betId: string) => void;
  setMultiplierModal: (modal: {
    isVisiable: boolean;
    value: number;
    type: 'multiplier' | 'betTimes';
    ticket?: Fucai3DTicket;
  }) => void;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
 
  ticketsMultiplier,
  setTicketsMultiplier,
  removeTicket,
  setMultiplierModal,
}) => {
  return (
    <FlatList
      data={tickets}
      renderItem={({item}) => (
        <Fucai3DSlipItem
          item={item}
       
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


