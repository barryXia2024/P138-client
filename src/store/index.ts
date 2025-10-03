/**
 * 状态管理模块导出
 * 
 * 统一导出所有状态管理Hook和辅助函数
 */

// 用户相关状态
export * from './user';

// 彩票相关状态

export { 
  default as useBetSlipStore, 
  type BetSlipState,
  type BetRecord,
  type BetType,
  type BallType,
  BetTypeDict,
} from './lottery/slip/betSlip';

// 关注系统状态
export * from './follow';

/**
 * 应用状态类型
 */
export enum AppStatus {
  /** 活跃状态 */
  ACTIVE = 'active',
  /** 非活跃状态 */
  INACTIVE = 'inactive',
  /** 后台状态 */
  BACKGROUND = 'background'
}

/**
 * 工具函数：格式化金额
 */
export const formatAmount = (amount: number): string => {
  return `¥${amount.toFixed(2)}`;
};

/**
 * 工具函数：格式化时间
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
}; 

import {create} from 'zustand';
/**
 * flatlist Debug
 */
export const useSystemSettingStore = create<{
  isOpenDebug: boolean; // 是否是开发环境
  setIsOpenDebug: (isOpenDebug: boolean) => void;
}>(set => ({
  isOpenDebug: false,
  setIsOpenDebug: (isOpenDebug) => set({ isOpenDebug }),
}));

 