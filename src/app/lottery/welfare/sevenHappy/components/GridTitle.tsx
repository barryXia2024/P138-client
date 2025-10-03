import React, {ReactNode} from 'react';
import {View, Text} from 'react-native';

import {SevenHappyPlayEnum} from '../constants';

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
  playMode: SevenHappyPlayEnum;
  playSubMode: SevenHappyPlayEnum;
  index: number;
}> = ({playMode, index}) => {
  if (playMode === SevenHappyPlayEnum.normal) {
    if (index === 0) {
      return (
        <Text>
          选择<Text className="text-red-500">7-15</Text>个号码
        </Text>
      );
    }
    return null;
  }
    if (playMode === SevenHappyPlayEnum.dantuo) {
    if (index === 0) {
      return (
        <Text>
          <Text className="text-xl font-bold">胆码</Text>
          至少选择<Text className="text-red-500">1</Text>个，最多选择<Text className="text-red-500">6</Text>个
        </Text>
      );
    }
    if (index === 1) {
      return (
        <Text>
          <Text className="text-xl font-bold">拖码</Text>
          至少选择<Text className="text-red-500">2</Text>个，最多选择<Text className="text-red-500">20</Text>个
        </Text>
      );
    }
     
  }
  return null;
};

export default GridTitle;
