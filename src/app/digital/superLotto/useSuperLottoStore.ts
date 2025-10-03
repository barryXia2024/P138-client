import {create} from 'zustand';
import { SuperLottoPlayEnum, SuperLottoSubPlayEnum } from '../types';
 

interface SuperLottoState {
  positions: string[][];
  betCount: number;
  playMode: SuperLottoPlayEnum;
  subPlayMode: SuperLottoSubPlayEnum;
  omissionList: string[];
  setPlayMode: (playMode: SuperLottoPlayEnum) => void;
  setSubPlayMode: (subPlayMode: SuperLottoSubPlayEnum) => void;
  setPositions: (positions: string[][]) => void;
  setBetCount: (betCount: number) => void;
  clearAll: () => void;
}

export const useSuperLottoStore = create<SuperLottoState>((set) => ({
  positions: [],
  betCount: 0,
  omissionList: [],
  playMode:SuperLottoPlayEnum.NORMAL,
  subPlayMode:SuperLottoSubPlayEnum.DIRECT_SELECTION,
  setPlayMode: (playMode: SuperLottoPlayEnum) => {
    set({playMode});
  },
  setSubPlayMode: (subPlayMode: SuperLottoSubPlayEnum) => {
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


// interface SuperLottoGameState {
//   // 核心状态
//   positions: number[][];
//   playMode: SuperLottoPlayEnum;
//   subPlayMode: SuperLottoSubPlayEnum;
//   showMissNumbers: boolean;
//   lotteryDrawData?: LotteryDataSource.CharityLotteryDataSource;

//   // 玩法操作
//   setPlayMode: (mode: SuperLottoPlayEnum) => void;

//   // 选号操作
//   toggleNumber: (positionIndex: number, number: number) => void;
//   clearSelection: () => void;
//   quickPick: () => void;

//   // 遗漏功能
//   onMiss: () => void;

//   // 验证和计算
//   validate: () => {valid: boolean; message?: string};
//   getBetCount: () => number;
//   getBetAmount: () => number;

//   // 票据构建
//   buildTicket: () => Promise<SuperLottoTicket | undefined>;

//   // UI 配置（保持向后兼容）
//   setLotteryData: (data: LotteryDataSource.CharityLotteryDataSource) => void;
//   getUIConfig: () => UIConfig;
//   getPositionRules: () => PositionRule[];
// }

// export const useSuperLottoStore = create<SuperLottoGameState>()(
//   persist(
//     (set, get) => ({
//       // 初始状态
//       positions: normalizeSLPositions(SuperLottoPlayEnum.NORMAL),
//       playMode: SuperLottoPlayEnum.NORMAL,
//       subPlayMode: SuperLottoSubPlayEnum.DEFAULT,
//       showMissNumbers: false,
//       lotteryDrawData: undefined,

//       // 玩法切换
//       setPlayMode: (mode: SuperLottoPlayEnum) => {
//         set({
//           playMode: mode,
//           positions: normalizeSLPositions(mode),
//           showMissNumbers: false,
//         });
//       },

//       // 选号操作
//       toggleNumber: (positionIndex: number, number: number) => {
//         const {positions, playMode} = get();
//         const newPositions = [...positions];
//         const currentSelection = newPositions[positionIndex] ?? [];
//         const rules = getSLRulesByPlayMode(playMode);
//         const rule = rules[positionIndex];

//         // 取消选择
//         if (currentSelection.includes(number)) {
//           newPositions[positionIndex] = currentSelection.filter(
//             n => n !== number,
//           );
//           set({positions: newPositions});
//           return;
//         }

//         // 检查最大数量限制
//         if (
//           rule &&
//           typeof rule.maxCount === 'number' &&
//           currentSelection.length >= rule.maxCount
//         ) {
//           Toast.show(`本区最多可选${rule.maxCount}个`);
//           return;
//         }

//         // 胆拖互斥：前胆<->前拖，后胆<->后拖
//         if (playMode === SuperLottoPlayEnum.DANTUO) {
//           let counterpartIndex = -1;
//           if (positionIndex === 0) counterpartIndex = 1;
//           if (positionIndex === 1) counterpartIndex = 0;
//           if (positionIndex === 2) counterpartIndex = 3;
//           if (positionIndex === 3) counterpartIndex = 2;
//           if (counterpartIndex >= 0) {
//             const counterpart = newPositions[counterpartIndex] ?? [];
//             if (counterpart.includes(number)) {
//               newPositions[counterpartIndex] = counterpart.filter(n => n !== number);
//             }
//           }
//         }

//         newPositions[positionIndex] = [...currentSelection, number];
//         set({positions: newPositions});
//       },

//       clearSelection: () => {
//         set({positions: normalizeSLPositions(get().playMode)});
//       },

//       // 机选
//       quickPick: () => {
//         const positions = slQuickPick(get().playMode);
//         set({positions});
//       },

//       setLotteryData: (lotteryData: LotteryDataSource.CharityLotteryDataSource) => {
//         set({lotteryDrawData: lotteryData});
//       },

//       // 遗漏功能
//       onMiss: () => {
//         set({showMissNumbers: !get().showMissNumbers});
//       },

//       // 验证
//       validate: () => {
//         const {positions, playMode} = get();
//         const msg = validateSLPositions(playMode, positions);
//         if (msg) return {valid: false, message: msg};
//         return {valid: true};
//       },

//       // 计算注数
//       getBetCount: () => {
//         const {positions, playMode, subPlayMode} = get();
//         const ticket: SuperLottoTicket = {
//           lotteryName: 'SuperLotto',
//           betId: 'temp',
//           betAmount: 0,
//           betCount: 0,
//           positions,
//           playMode,
//           subPlayMode,
//         };
//         return slComputeBetCount(ticket);
//       },

//       getBetAmount: () => {
//         return get().getBetCount() * 2;
//       },

//       // 票据构建
//       buildTicket: async () => {
//         const validation = get().validate();
//         if (!validation.valid) {
//           Toast.show(validation.message || '请完成选号');
//           return undefined;
//         }

//         const betId = await new DeviceIdGenerator().generateSnowflakeId();
//         const {positions, playMode, subPlayMode} = get();

//         return {
//           lotteryName: 'SuperLotto',
//           betId,
//           betAmount: get().getBetAmount(),
//           betCount: get().getBetCount(),
//           positions,
//           playMode,
//           subPlayMode,
//         };
//       },



//       getUIConfig: () => getSuperLottoUIConfig(get().playMode),

//       getPositionRules: () => getSLRulesByPlayMode(get().playMode),
//     }),
//     {
//       name: 'SuperLotto-Game-Store',
//     },
//   ),
// );

