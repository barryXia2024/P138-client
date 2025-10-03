import React from 'react';
import {View} from 'react-native';
import Button from '@/p138-react-common/components/Button';
import {useSuperLottoStore} from '../../lotteryTypes/superLotto';
import {useSevenStarStore} from '../../lotteryTypes/sevenStar';
import {useArrangedThreeStore} from '../../lotteryTypes/arrangedThree';
import {useArrangedFiveStore} from '../../lotteryTypes/arrangedFive';
import {useBetlistStore} from '../../betSlip/betlist/betlistStore';
import {
  buildSuperLottoTicket,
  buildSevenStarTicket,
} from '../../betSlip/betlist/ticketFactory';
import {router} from 'expo-router';
import {DeviceIdGenerator} from 'src/utils/device';
import {DigitalLotteryNames} from '../../lotteryTypes/configs/lotteryConfigs';
import {NativeCheckbox} from '@/p138-react-common/components/checkBox';
import {SuperLottoPlayEnum} from '../../types';

const BetControls: React.FC<{
  type?: DigitalLotteryNames;
   
}> = ({
  type = 'SuperLotto',
 
}) => {
  const quickPick = useSuperLottoStore(s => s.quickPick);
  const sevenQuickPick = useSevenStarStore(s => s.quickPick);
  const arrangedThreeQuickPick = useArrangedThreeStore(s => s.quickPick);
  const arrangedFiveQuickPick = useArrangedFiveStore(s => s.quickPick);
  const superLottoSetShowDissmiss = useSuperLottoStore(s => s.setShowDissmiss);
  const sevenStarSetShowDissmiss = useSevenStarStore(s => s.setShowDissmiss);
  const superLottoShowDissmiss = useSuperLottoStore(s => s.showDissmiss);
  const sevenStarShowDissmiss = useSevenStarStore(s => s.showDissmiss);
  const {addTicket} = useBetlistStore();

  

  const handleQuickPick5 = async () => {
    try {
      if (type === 'SuperLotto') {
        // 大乐透机选5注单式
        const generator = new DeviceIdGenerator();
        const store = useSuperLottoStore.getState();

        // 确保是单式模式
        store.setMode?.(SuperLottoPlayEnum.NORMAL);

        for (let i = 0; i < 5; i++) {
          // 清空上一注的选号
          store.clearSelection();

          // 机选一注单式（5个红球+2个蓝球）
          store.quickPick();
          console.log(type, 'type');
          // 构建票据
          const ticket = await buildSuperLottoTicket();
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

        // 清空选号状态
        store.clearSelection();
      } else if (type === 'SevenStar') {
        // 七星彩机选5注单式
        const generator = new DeviceIdGenerator();
        const store = useSevenStarStore.getState();

        for (let i = 0; i < 5; i++) {
          // 清空上一注的选号
          store.clearSelection();

          // 机选一注单式
          store.quickPick();

          // 构建票据
          const ticket = await buildSevenStarTicket();
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

        // 清空选号状态
        store.clearSelection();
      }

      // 跳转到投注单页面
      router.push({
        pathname: '/lottery/sport/digital/betlist',
      });

      Toast.show('已添加机选5注单式');
    } catch (error) {
      Toast.show('机选失败');
    }
  };
  const showDissmiss = () => {
    if (type === 'SuperLotto') return superLottoShowDissmiss;
    if (type === 'SevenStar') return sevenStarShowDissmiss;
    return false;
  };

  return (
    <View className="flex-row justify-between  gap-2">
      {type === 'SuperLotto' && (
        <Button
          title="机选5注"
          type="primary"
          className="rounded-full"
          onPress={handleQuickPick5}
          style={{ padding:0,height:26,width:70}}
          textStyle={{fontSize: 12}}
          size="small"
        />
      )}

      <Button
        title="机选"
        type="primary"
        className="rounded-full"
        onPress={() => {
          if (type === 'SevenStar') return sevenQuickPick();
          if (type === 'ArrangedThree') return arrangedThreeQuickPick();
          if (type === 'ArrangedFive') return arrangedFiveQuickPick();
          const s = useSuperLottoStore.getState();
          // 按当前页面模式机选
          s.quickPick();
        }}
        style={{ padding:0,height:26,width:50}}
        textStyle={{fontSize: 12}}
        size="small"
      />
      <NativeCheckbox
        checked={showDissmiss()}
        label="遗漏"
        checkboxStyle={{padding:0,height:16,width:16}}
        labelStyle={{fontSize: 12}}
        onCheckedChange={() => {
          if (type === 'SuperLotto') return superLottoSetShowDissmiss();
          if (type === 'SevenStar') return sevenStarSetShowDissmiss();
        }}
      />
    </View>
  );
};

export default BetControls;
