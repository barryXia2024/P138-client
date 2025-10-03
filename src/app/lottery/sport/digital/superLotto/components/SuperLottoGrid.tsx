import React, {useCallback} from 'react';
import {View} from 'react-native';

import {useSuperLottoStore} from '../store/useSuperLottoStore';
import BallsGrid from './BallsGrid';
import GridTitle from './GridTitle';
import {superLottoPlayAllDissmiss} from '../../lotteryTypes/utils/combination';
import {DeviceIdGenerator} from 'src/utils/device';
import {useBetlistStore} from '../../betSlip';
import {router} from 'expo-router';
import { SuperLottoPlayEnum, SuperLottoSubPlayEnum, UIUnit } from '../../types';
 

const SuperLottoGrid: React.FC<{
  activeUI: UIUnit;
  onToggle: (index: number, n: number) => void;
}> = ({activeUI, onToggle}) => {
  const {
    playMode,
    subPlayMode,
    positions,
    lotteryData,
    quickPick,
    onMiss,
    showMiss,
    buildTicket,
    clearSelection,
  } = useSuperLottoStore();
  const {addTicket} = useBetlistStore();

  const getNumbers = useCallback(
    (index: number) => {
      return activeUI?.labels[index]?.numbers;
    },
    [activeUI],
  );

  const dismissArrayData = useCallback(() => {
    return superLottoPlayAllDissmiss(playMode, lotteryData?.omissionList || []);
  }, [playMode, lotteryData?.omissionList]);

  console.log(activeUI, 'positions');
  const onQuickPick = useCallback(() => {
    quickPick();
  }, [onToggle]);
  const onQuickPick5 = useCallback(async () => {
    // 大乐透机选5注单式
    const generator = new DeviceIdGenerator();

    // 确保是单式模式

    for (let i = 0; i < 5; i++) {
      clearSelection();

      // 机选一注单式（5个红球+2个蓝球）
      quickPick();

      // 构建票据
      const ticket = await buildTicket();
      console.log(ticket);
      if (ticket) {
        // 生成新的betId避免重复
        const betId = await generator.generateSnowflakeId();
        const newTicket = {
          ...ticket,
          betId,
        };
        addTicket(newTicket);
      }
    }

    router.push({
      pathname: '/lottery/sport/digital/betlist',
    });
  }, [onToggle]);

  return (
    <View className="flex-1 bg-gray-100">
      <BallsGrid<SuperLottoPlayEnum, SuperLottoSubPlayEnum>
        activeUI={activeUI!}
        playMode={playMode!}
        playSubMode={subPlayMode!}
        getNumbers={getNumbers}
        GridTitle={GridTitle}
        getSelected={i => positions[i] ?? []}
        onToggle={onToggle}
        onQuickPick={onQuickPick}
        onQuickPick5={onQuickPick5}
        onMiss={onMiss}
        showMissControl
        showDissmiss={showMiss}
        dismissArray={dismissArrayData()}
      />
    </View>
  );
};

export default SuperLottoGrid;
