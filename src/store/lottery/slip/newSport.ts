/**
 * 体育彩票投注单状态管理
 *
 * 管理体育彩票的投注单、球类型、投注倍数等
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 球类型枚举
 */
export type BallType =
  | 'red' // 红球
  | 'blue' // 蓝球
  | 'redDan' // 红球胆码
  | 'blueDan' // 蓝球胆码
  | 'redTuo' // 红球拖码
  | 'blueTuo'; // 蓝球拖码

/**
 * 投注类型枚举
 */
export type BetType =
  | 'single' // 单式
  | 'multiple' // 复式
  | 'danTuo'; // 胆拖

/**
 * 投注记录结构
 */
export interface BetRecord {
  /** 投注类型：单式、复式、胆拖 */
  type: BetType;
  /** 保存球的选择 */
  balls: Record<BallType, number[]>;
  /** 倍数 */
  multiplier: number;
  /** 总注数 */
  betCount: number;
}

/**
 * 投注类型中文字典
 */
export const BetTypeDict = {
  single: '单式',
  multiple: '复式',
  danTuo: '胆拖',
};

/**
 * 投注单列表状态存储
 */
interface BetSlipState {
  /** 保存所有投注 */
  bets: BetRecord[];
  /** 可选的过关方式数组 */
  passTypeOptions: string[];
  /** 选中的过关方式 */
  selectedPassTypes: string[];

  /** 批量添加投注 */
  addBets: (newBets: BetRecord[]) => void;
  /** 删除指定投注 */
  removeBet: (index: number) => void;
  /** 更新倍数 */
  updateMultiplier: (index: number, multiplier: number) => void;
  /** 设置选中的过关方式 */
  setSelectedPassTypes: (selectedPassTypes: string[]) => void;
  /** 设置可用的过关方式选项 */
  setPassTypeOptions: (passTypeOptions: string[]) => void;
  /** 清空所有投注 */
  clearBets: () => void;
}

/**
 * 体育彩票投注单状态管理Hook
 */
export const useBetSlipStore = create<BetSlipState>()(
  persist(
    set => ({
      // 投注列表
      bets: [],
      // 过关方式选项
      passTypeOptions: [],
      // 已选择的过关方式
      selectedPassTypes: [],

      // 批量添加投注
      addBets: newBets =>
        set(state => ({
          bets: [...state.bets, ...newBets], // 合并新投注到现有状态
        })),

      // 删除指定投注
      removeBet: index =>
        set(state => ({
          bets: state.bets.filter((_, i) => i !== index),
        })),

      // 更新倍数
      updateMultiplier: (index, multiplier) =>
        set(state => ({
          bets: state.bets.map((bet, i) => (i === index ? { ...bet, multiplier } : bet)),
        })),

      // 设置选中的过关方式
      setSelectedPassTypes: selectedPassTypes => set({ selectedPassTypes }),

      // 设置过关方式选项
      setPassTypeOptions: passTypeOptions => set({ passTypeOptions }),

      // 清空所有投注
      clearBets: () => set({ bets: [] }),
    }),
    {
      name: 'betSlipStore',
    }
  )
);
