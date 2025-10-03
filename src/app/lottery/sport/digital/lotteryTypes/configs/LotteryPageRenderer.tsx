import React, {useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {router} from 'expo-router';
import LotteryPageTemplate from '../../components/common/LotteryPageTemplate';
import {
  SuperLottoNormalGrid,
  SuperLottoDanTuoGrid,
  SevenStarGrid,
} from '../../components/common/LotteryGrids';

import {useBetlistStore} from '../../betSlip';
import {DigitalLotteryNames, getLotteryConfig} from './lotteryConfigs';
import {
  createDigitalLotteryStore,
  createPositionLotteryStore,
} from '../common/storeFactory';

import {createLotteryAdapter} from '../common/LotteryAdapterFactory';
import {ILotteryAdapter} from '../common/LotteryAdapter';

// 基于配置的彩票页面渲染器
interface LotteryPageRendererProps {
  lotteryName: DigitalLotteryNames;
  currentPeriod?: string;
  deadline?: string;
}

const LotteryPageRenderer: React.FC<LotteryPageRendererProps> = ({
  lotteryName,
  currentPeriod,
  deadline,
}) => {
  const config = getLotteryConfig(lotteryName);
  const {addTicket, clearAll, setLotteryData} = useBetlistStore();

  // 创建store实例
  const store = React.useMemo(() => {
    if (lotteryName === 'SuperLotto') {
      return createDigitalLotteryStore(lotteryName, {
        redRange: {min: 1, max: config.rules.maxRed || 35},
        blueRange: {min: 1, max: config.rules.maxBlue || 12},
        price: config.price,
      });
    } else {
      return createPositionLotteryStore(lotteryName, {
        positions: config.rules.positions || 7,
        positionRules: config.rules.positionRules || [],
        price: config.price,
      });
    }
  }, [lotteryName, config]);

  // 创建适配器
  const adapter: ILotteryAdapter = React.useMemo(() => {
    return createLotteryAdapter(lotteryName, store);
  }, [lotteryName, store]);

  const [activeTab, setActiveTab] = useState<'normal' | 'dantuo'>('normal');

  // 处理标签页切换
  const handleTabChange = useCallback(
    (tab: 'normal' | 'dantuo') => {
      setActiveTab(tab);
      if (adapter.setMode) {
        adapter.setMode(tab);
      }
    },
    [adapter],
  );

  // 处理下一步
  const handleNextStep = useCallback(async () => {
    if (adapter.betCount <= 0) {
      // Toast.show('请按规则完成选号');
      return;
    }

    const ticket = await adapter.buildTicket();
    if (!ticket) return;

    addTicket(ticket);
    adapter.clearSelection();
    router.push({pathname: '/lottery/sport/digital/betlist'});
  }, [adapter, addTicket]);

  // 渲染选号区域
  const renderSelectionArea = () => {
    if (lotteryName === 'SuperLotto') {
      // 大乐透特殊处理
      return (
        <View>
          {activeTab === 'normal' ? (
            <>
              <SuperLottoNormalGrid
                onToggleRed={adapter.toggleRed!.bind(adapter)}
                onToggleBlue={adapter.toggleBlue!.bind(adapter)}
                selectedRed={adapter.red}
                selectedBlue={adapter.blue}
              />
            </>
          ) : (
            <>
              <SuperLottoDanTuoGrid
                onToggleRedDan={adapter.toggleRedDan!.bind(adapter)}
                onToggleRedTuo={adapter.toggleRedTuo!.bind(adapter)}
                onToggleBlueDan={adapter.toggleBlueDan!.bind(adapter)}
                onToggleBlueTuo={adapter.toggleBlueTuo!.bind(adapter)}
                selectedRedDan={adapter.redDan}
                selectedRedTuo={adapter.redTuo}
                selectedBlueDan={adapter.blueDan}
                selectedBlueTuo={adapter.blueTuo}
              />
            </>
          )}
        </View>
      );
    } else {
      return (
        <SevenStarGrid
          getNumbers={i => {
            const rule = config.rules.positionRules?.[i];
            return Array.from({length: rule?.numberRange || 10}, (_, n) => n);
          }}
          getSelected={i => adapter.getPosition!(i)}
          onToggle={(i, n) => adapter.toggleNumber!(i, n)}
        />
      );
    }
  };

  // 确定标签页
  const tabs =
    lotteryName === 'SuperLotto'
      ? [
          {key: 'normal' as const, label: '单式'},
          {key: 'dantuo' as const, label: '胆拖'},
        ]
      : undefined;

  // 渲染Footer摘要
  const renderFooterSummary = () => {
    if (lotteryName === 'SuperLotto') {
      const mode = adapter.mode;
      if (mode === 'normal') {
        return (
          <Text className="text-center text-md py-4 text-lg">
            已选红 <Text className="text-red-500">{adapter.red.length}</Text>
            个， 蓝球{' '}
            <Text className="text-blue-500">{adapter.blue.length}</Text>个
          </Text>
        );
      } else {
        return (
          <Text className="text-center text-md py-4 text-lg">
            已选前区胆码
            <Text className="text-red-500">{adapter.redDan.length}</Text>
            个， 前区拖码
            <Text className="text-red-500">{adapter.redTuo.length}</Text>
            个， 后区胆码
            <Text className="text-blue-500">{adapter.blueDan.length}</Text>
            个， 后区拖码
            <Text className="text-blue-500">{adapter.blueTuo.length}</Text>个
          </Text>
        );
      }
    } else {
      // 位置式彩票显示每位选号状态
      const positions = Array.from(
        {length: config.rules.positions || 7},
        (_, i) => adapter.getPosition!(i),
      );
      return (
        <Text className="text-center text-md py-4 text-lg">
          {positions.map((p, i) => (
            <Text key={i}>
              第{i + 1}位已选<Text className="text-red-500">{p.length}</Text>
              个{' '}
            </Text>
          ))}
        </Text>
      );
    }
  };

  return (
    <LotteryPageTemplate
      lotteryName={lotteryName}
      title={config.chineseName}
      currentPeriod={currentPeriod}
      deadline={deadline}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      footerProps={{
        summary: renderFooterSummary(),
        betCount: adapter.betCount,
        betAmount: adapter.betAmount,
        canProceed: adapter.betCount > 0,
        onNextStep: handleNextStep,
      }}>
      {renderSelectionArea()}
    </LotteryPageTemplate>
  );
};

export default LotteryPageRenderer;
