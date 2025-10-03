import React from 'react';
import {Text, View} from 'react-native';

import {
  Happy8PlayEnum,
  QuickPickButtonEnum,
  quickPickButtonsMap,
} from '../constants';


const GridTitle: React.FC<{
  playMode: Happy8PlayEnum;
  playSubMode: QuickPickButtonEnum;
  index: number;
}> = ({playMode, playSubMode, index}) => {
 
  const amount: Record<QuickPickButtonEnum, string> = {
    [QuickPickButtonEnum.pick1]: '4.6',
    [QuickPickButtonEnum.pick2]: '19',
    [QuickPickButtonEnum.pick3]: '53',
    [QuickPickButtonEnum.pick4]: '100',
    [QuickPickButtonEnum.pick5]: '1000',
    [QuickPickButtonEnum.pick6]: '3000',
    [QuickPickButtonEnum.pick7]: '10000',
    [QuickPickButtonEnum.pick8]: '50000',
    [QuickPickButtonEnum.pick9]: '3000000',
    [QuickPickButtonEnum.pick10]: '500万',
  };
  if (playMode === Happy8PlayEnum.normal) {
    if (index === 0) {
      return (
        <View>
          <Text>
            至少选择
            <Text className="text-red-500">
              {quickPickButtonsMap[playSubMode]}
            </Text>
            个号码
          </Text>
          <Text>
            单注最高可中
            <Text className="text-red-500">{amount[playSubMode]}</Text>元
          </Text>
        </View>
      );
    }
    return null;
  }
  if (playMode === Happy8PlayEnum.dantuo) {
    if (index === 0) {
      if (playSubMode === QuickPickButtonEnum.pick2) {
        return <Text>胆码区（选择{quickPickButtonsMap[playSubMode]-1}个）</Text>;
      } else {
        return <Text>胆码区（选择1~{quickPickButtonsMap[playSubMode]-1}个）</Text>;
      }
    }
    if (index === 1) {
      return <Text>拖码选择区</Text>;
    }
  }
  return null;
};

export default GridTitle;
