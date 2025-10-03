import {createPositionStore} from '../positionStoreFactory';
export type {PositionState} from '../positionStoreFactory';

// 排列五store
export const useArrangedFiveStore = createPositionStore('ArrangedFive');
