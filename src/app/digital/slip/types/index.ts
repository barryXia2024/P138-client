import { PositionTicket } from "../../types";

export interface SlipItemProps  {
    ticket: PositionTicket;
    ticketsMultiplier: Record<string, number>;
    setTicketsMultiplier: (multiplier: Record<string, number>) => void;
    removeTicket: (betId: string) => void;
    setMultiplierModal: (modal: {
      isVisiable: boolean;
      value: number;
      type: 'multiplier' | 'betTimes';
      ticket?: PositionTicket;
    }) => void;
    append: string;
  }
  