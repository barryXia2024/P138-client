import {PositionTicket} from '../../types';

export const sevenStarBetItem = (ticket: PositionTicket) =>
  ticket.positions.map(pos => pos.join('|')).join('#');

export const sevenStarBetPlay=(ticket: PositionTicket) =>
    ticket.betCount>1?'单式':'复式';
