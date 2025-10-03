import {createPositionStore} from '../positionStoreFactory';
export type {PositionState} from '../positionStoreFactory';

// 七星彩store
export const useSevenStarStore = createPositionStore('SevenStar');
