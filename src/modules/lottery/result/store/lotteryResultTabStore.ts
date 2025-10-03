

import { LotteryName } from '@/p138-react-common/constants/LotteryCommon';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';


export const useLotteryResultPageStore  =
  create<LotteryStore.LotteryResultPageState>()(
    persist(
      set => ({
        selectedLotteryType: LotteryName.FootballLottery,
        setSelectedLotteryType: tabIndex =>
          set({selectedLotteryType: tabIndex}),
      }),
      {
        name: 'lotteryResultPage',
      },
    ),
  );

export default useLotteryResultPageStore ;
