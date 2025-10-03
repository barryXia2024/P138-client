import {createPositionStore} from '../positionStoreFactory';
export type {PositionState} from '../positionStoreFactory';

// 排列三store
export const useArrangedThreeStore = createPositionStore('ArrangedThree');
