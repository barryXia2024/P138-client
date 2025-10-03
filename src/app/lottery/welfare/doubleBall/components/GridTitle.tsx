import React, {ReactNode} from 'react';
import {View, Text} from 'react-native';

import {DoubleBallPlayEnum} from '../constants';

// const GridTitle: Record<DoubleBallPlayEnum, Record<string, ReactNode[]>> = {
//   // 直选
//   [DoubleBallPlayEnum.normal]: {
//     [DoubleBallPlayEnum.normal]: [
//       <Text key={DoubleBallPlayEnum.normal}>
//         <Text>
//           <Text>
//             至少选<Text className="text-red-500">5</Text>个红球
//           </Text>
//         </Text>
//       </Text>,
//       <Text key={DoubleBallPlayEnum.normal}>
//         <Text>
//           <Text>
//             至少选<Text className="text-red-500">1</Text>个蓝球
//           </Text>
//         </Text>
//       </Text>,
//     ],
//   },
//   [DoubleBallPlayEnum.dantuo]: {
//     [DoubleBallPlayEnum.normal]: [
//       <Text key={1}>
//         <Text>
//           <Text className="text-xl font-bold">前区胆码</Text>
//           <Text>
//             可选<Text className="text-red-500">1-4</Text>个或不选
//           </Text>
//         </Text>
//       </Text>,
//       <Text key={2}>
//         <Text>
//           <Text className="text-xl font-bold">前区拖码</Text>
//           <Text>
//             至少选<Text className="text-red-500">2</Text>个
//           </Text>
//         </Text>
//       </Text>,
//       <Text key={3}>
//         <Text>
//           <Text className="text-xl font-bold">后区胆码</Text>
//           <Text>
//             可选<Text className="text-red-500">1</Text>个或不选
//           </Text>
//         </Text>
//       </Text>,
//     ],
//   },
// };

const GridTitle: React.FC<{
  playMode: DoubleBallPlayEnum;
  playSubMode: DoubleBallPlayEnum;
  index: number;
}> = ({playMode, index}) => {
  if (playMode === DoubleBallPlayEnum.normal) {
    if (index === 0) {
      return (
        <Text>
          至少选<Text className="text-red-500">6</Text>个红球
        </Text>
      );
    }
    return null;
  }
  if (playMode === DoubleBallPlayEnum.dantuo) {
    if (index === 0) {
      return (
        <Text>
          <Text className="text-xl font-bold">红球胆码</Text>
          选<Text className="text-red-500">1-5</Text>个红球
        </Text>
      );
    }
    if (index === 1) {
      return (
        <Text>
          <Text className="text-xl font-bold">红球拖码</Text>
          至少选<Text className="text-red-500">2</Text>个号码
        </Text>
      );
    }
    if (index === 2) {
      return (
        <Text>
          <Text className="text-xl font-bold">蓝球</Text>
          至少选<Text className="text-red-500">1</Text>个蓝球
        </Text>
      );
    }
  }
  return null;
};

export default GridTitle;
