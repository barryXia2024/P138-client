import React, {useEffect, useCallback} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import AppHeader from '@/p138-react-common/components/AppHeader';
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {ROUTE_PATHS} from 'src/modules/lottery/constants';
import {CompetitionHeaderRight} from 'src/modules/lottery/components';
 
import {TabSwitcher} from '@/p138-react-common/components';
import {useBetlistStore} from '../../betSlip';
import CommonBetFooter from './CommonBetFooter';
import { DigitalLotteryNames } from '../../lotteryTypes/configs/lotteryConfigs';
import { HistoryPeriodSelector } from '../shared/history-period/HistoryPeriodSelector';

// 彩票页面模板Props
export interface LotteryPageTemplateProps {
  lotteryName: DigitalLotteryNames;
  title: string;
  currentPeriod?: string;
  deadline?: string;
  tabs?: Array<{key: 'normal' | 'dantuo'; label: string}>;
  children: React.ReactNode;
  footerProps?: {
    betCount: number;
    betAmount: number;
    canProceed: boolean;
    onNextStep: () => void;
    summary?: React.ReactNode;
  };
  onTabChange?: (tab: 'normal' | 'dantuo') => void;
  activeTab?: 'normal' | 'dantuo';
}

// 通用彩票页面模板
const LotteryPageTemplate: React.FC<LotteryPageTemplateProps> = ({
  lotteryName,
  title,
  currentPeriod,
  deadline,
  tabs,
  children,
  footerProps,
  onTabChange,
  activeTab = 'normal',
}) => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const {clearAll, setLotteryData} = useBetlistStore();

  // 初始化页面数据
  useEffect(() => {
    clearAll();
    // 这里可以根据lotteryType加载不同的mock数据
    // setLotteryData(mockData);
  }, [lotteryName]);

  // 处理标签页切换
  const handleTabPress = useCallback((key: 'normal' | 'dantuo') => {
    if (onTabChange) {
      onTabChange(key);
    }
  }, [onTabChange]);

  return (
    <View className="flex-1 bg-[#f0f0f0]">
      {/* 头部导航 */}
      <AppHeader
        title={title}
        rightComponent={<CompetitionHeaderRight />}
        
      />

      {/* 主要内容区域 */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 历史期数选择器 */}
        <HistoryPeriodSelector
          currentPeriod={currentPeriod}
          onPeriodChange={() => { } } historyData={[]}        />

        {/* 标签页切换（如果有） */}
        {tabs && tabs.length > 1 && (
          <View className="mt-4">
            <TabSwitcher
              tabs={tabs}
              activeTab={activeTab}
              onTabPress={handleTabPress}
            />
          </View>
        )}

        {/* 选号区域 */}
        <View className="mt-4">
          {children}
        </View>
      </ScrollView>

      {/* 底部投注栏 */}
      {footerProps && (
        <CommonBetFooter
          summary={footerProps.summary}
          betCount={footerProps.betCount}
          betAmount={footerProps.betAmount}
          canProceed={footerProps.canProceed}
          onClear={() => {}}
          onNextStep={footerProps.onNextStep}
        />
      )}
    </View>
  );
};

export default LotteryPageTemplate;
