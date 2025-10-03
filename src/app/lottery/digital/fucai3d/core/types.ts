import {Fucai3DPlayEnum, Fucai3DSubPlayEnum} from '../shared/enums';
import {PositionTicket} from '../../core/types';

export interface Fucai3DTicket extends PositionTicket {
  lotteryName: 'Fucai3D';
  playMode: Fucai3DPlayEnum;
  subPlayMode: Fucai3DSubPlayEnum;
}
