import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {jumentSamePlayType} from '../utils/lottery';

export const useBetInfoStore = create<LotteryInfo.LotteryBetInfo>()(
  persist(
    (set, get) => ({
      betPlayActiveTab: 'default',
      selectedMatches: {},
      selectedPassTypes: [],
      multiplier: 1, // 倍数
      matchData: {}, // 比赛数据
 
  
      cache: {}, // 缓存
      isRequirePhoto: false, // 是否要求店主上传照片
      passTypeOptions: [], // 过关方式选项
      setBetPlayActiveTab:  (
        betPlayActiveTab: LotteryInfo.BetPlayActiveTab,
      ) => {
        console.log(betPlayActiveTab,'=====betPlayActiveTab=======')
        get().resetStore();
        set({betPlayActiveTab});
      },
      setPassTypeOptions: (passTypeOptions: string[]) => set({passTypeOptions}),
      setSelectedPassTypes: (selectedPassTypes: string[]) =>
        set({selectedPassTypes}),
      setIsRequirePhoto: (isRequirePhoto: boolean) => set({isRequirePhoto}),
      // 设置比赛数据
      setMatchData: (matchId, matchInfo) =>
        set(state => ({
          matchData: {
            ...state.matchData,
            [matchId]: matchInfo, // 存储比赛信息
          },
        })),
      
      // 批量设置比赛数据 - 性能优化
      setMatchDataBatch: (matchDataBatch: Record<string, LotteryDataSource.MatchInfo>) =>
        set(state => ({
          matchData: {
            ...state.matchData,
            ...matchDataBatch,
          },
        })),
 
        
      toggleSelection: (matchId, oddsCellKey, maxCount) => {
        const selectedMatches = get().selectedMatches; // 获取当前选中的比赛

        if (selectedMatches[matchId]?.includes(oddsCellKey)) {
          // 如果该 oddsCellKey 已经存在，移除它
          const updatedSelectedMatch = {...selectedMatches};
          updatedSelectedMatch[matchId] = updatedSelectedMatch[matchId].filter(
            key => key !== oddsCellKey,
          );

          // 如果该比赛没有任何选中的 oddsCellKey，则删除该比赛
          if (updatedSelectedMatch[matchId].length === 0) {
            delete updatedSelectedMatch[matchId];
          }

          set({selectedMatches: updatedSelectedMatch});
        } else {
          if (maxCount === 1) {
            //猜一场
            const selectedMatchesKeys = selectedMatches[matchId] ?? [];
            const samePlayType = jumentSamePlayType(
              oddsCellKey,
              selectedMatchesKeys,
            );
            console.log('samePlayType', samePlayType,maxCount);
            set({
              selectedMatches: {
                [matchId]: samePlayType
                  ? [oddsCellKey] // 相同玩法，只保留新的
                  : [...selectedMatchesKeys, oddsCellKey], // 不同玩法，保留原有的并添加新的
              },
            });
            return;
          }
          // 限制最大选择个数，允许同场比赛添加
          if (
            maxCount &&
            Object.keys(selectedMatches).length >= maxCount &&
            !selectedMatches[matchId]
          ) {
            // 使用可能存在的Toast组件
            Toast.show(`只能选择${maxCount}场比赛`);
            console.warn(`只能选择${maxCount}场比赛`);
            return;
          }
          set({
            selectedMatches: {
              ...selectedMatches,
              [matchId]: [...(selectedMatches[matchId] || []), oddsCellKey], // 添加新的 oddsCellKey
            },
          });
        }
      },

 

      // 设置选中的比赛
      setSelectedMatches: selectedMatches => set({selectedMatches}),

      // 设置倍数
      setMultiplier: multiplier => set({multiplier}),

      // 重置状态
      resetStore: () =>
        set({
          selectedMatches: {},
          multiplier: 1,
          betPlayActiveTab: 'default',
          isRequirePhoto: false, // 重置为false
        }),
    }),
    {
      name: 'betPlay',
    },
  ),
);
