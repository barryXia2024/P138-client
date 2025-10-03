import {create} from 'zustand';
import {SevenStarPlayEnum, SevenStarSubPlayEnum} from '../types';

interface SevenStarState {
  positions: string[][];
  betCount: number;
  playMode?: SevenStarPlayEnum;
  subPlayMode?: SevenStarSubPlayEnum;
  omissionList: string[];
  setPlayMode: (playMode: SevenStarPlayEnum) => void;
  setSubPlayMode: (subPlayMode: SevenStarSubPlayEnum) => void;
  setPositions: (positions: string[][]) => void;
  setBetCount: (betCount: number) => void;
  clearAll: () => void;
}

export const useSevenStarStore = create<SevenStarState>((set) => ({
  positions: [],
  betCount: 0,
  omissionList: [],
  setPlayMode: (playMode: SevenStarPlayEnum) => {
    set({playMode});
  },
  setSubPlayMode: (subPlayMode: SevenStarSubPlayEnum) => {
    set({subPlayMode});
  },
  setPositions: (positions: string[][]) => {
    set({positions});
  },
  setBetCount: (betCount: number) => {
    set({betCount});
  },
  clearAll: () => {
    set({positions: [], betCount: 0});
  },
}));
