/**
 * 关注系统状态管理
 *
 * 管理用户关注的专家、列表及筛选状态
 */

import {create} from 'zustand';
import {persist} from 'zustand/middleware';

/**
 * 专家项目类型
 */
export interface ExpertItem {
  shopId: number,
  orderId: number,
  orderNo: string,
  userId: number,
  nickName: string,
  imgUrl: string,
  declaration: string,
  orderType: number,
  amount: number,
  shopLotteryID: number,
  lotteryName: string,
  passType: string,
  buyEndTime: number,
  followNum: number,
  returnMultiple: number,
  latestHit: boolean[],
  winStreak: number,
  loseStreak: number | null,
  hitRate: number,
  profitability: number,
  levelId: number,
  followWin: number,
  followAmount: number,
}

/**
 * 关注系统状态
 */
interface FollowState {
  /** 专家列表数据 */
  expertList: ExpertItem[];
  /** 当前选中的标签索引 */
  selectedTabIndex: number;
  /** 当前选中的筛选项索引 */
  selectedFilterIndex: number;
  /** 已关注的专家ID列表 */
  followedExpertIds: string[];

  /** 设置专家列表数据 */
  setExpertList: (data: ExpertItem[]) => void;
  /** 设置当前标签索引 */
  setSelectedTabIndex: (index: number) => void;
  /** 设置当前筛选项索引 */
  setSelectedFilterIndex: (index: number) => void;
  /** 添加关注专家 */
  followExpert: (id: string) => void;
  /** 取消关注专家 */
  unfollowExpert: (id: string) => void;
}

/**
 * 关注系统状态管理Hook
 */
export const useFollowStore = create<FollowState>()(
  persist(
    set => ({
      // 专家列表数据
      expertList: [],
      // 当前选中的标签索引
      selectedTabIndex: 0,
      // 当前选中的筛选项索引
      selectedFilterIndex: 0,
      // 已关注的专家ID列表
      followedExpertIds: [],

      // 设置专家列表数据
      setExpertList: expertList => set({expertList}),

      // 设置当前标签索引
      setSelectedTabIndex: index => set({selectedTabIndex: index}),

      // 设置当前筛选项索引
      setSelectedFilterIndex: index => set({selectedFilterIndex: index}),

      // 添加关注专家
      followExpert: id =>
        set(state => ({
          followedExpertIds: [...state.followedExpertIds, id],
        })),

      // 取消关注专家
      unfollowExpert: id =>
        set(state => ({
          followedExpertIds: state.followedExpertIds.filter(
            expertId => expertId !== id,
          ),
        })),
    }),
    {
      name: 'followStore',
    },
  ),
);

/**
 * 关注系统状态
 */
interface LiveState {
  // 当前选中的标签索引
  selectedTabIndex: number;
  // 当前选中的筛选项索引
  selectedFilterIndex: number;
  currentMatch?: ServerCommonLive.FootBallCompetition | ServerCommonLive.BasketBallCompetition;
  setCurrentMatch: (match: ServerCommonLive.FootBallCompetition | ServerCommonLive.BasketBallCompetition) => void;
  /** 设置当前标签索引 */
  setSelectedTabIndex: (index: number) => void;
  /** 设置当前筛选项索引 */
  setSelectedFilterIndex: (index: number) => void;
}

/**
 * 关注系统状态管理Hook
 */
export const useLiveStore = create<LiveState>()(
  persist(
    set => ({
      // 当前选中的标签索引
      selectedTabIndex: 0,
      // 当前选中的筛选项索引
      selectedFilterIndex: 0,
      currentMatch: undefined,

      // 设置当前标签索引
      setSelectedTabIndex: index => set({selectedTabIndex: index}),

      // 设置当前筛选项索引
      setSelectedFilterIndex: index => set({selectedFilterIndex: index}),
      setCurrentMatch: match => set({currentMatch: match}),
    }),
    {
      name: 'liveStore',
    },
  ),
);
