import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getCharityLotteryData} from 'src/api/interface/lottery-lottery-type-data';
 
import {useLotteryInfoStore} from 'src/modules/lottery/store';
import {useDigitalBetStore} from '../store/useDigitalBet';

 
const useDigitalBase = () => {
  const {lotteryInfo} = useLotteryInfoStore();
  const {lotteryData, setLotteryData} = useDigitalBetStore();
  const [positionList] = useState<string[][]>([]);
  const [showDigitalMiss, setShowDigitalMiss] = useState(false);

  useEffect(() => {
    if (lotteryInfo?.lotteryName) {
      getCharityLotteryData({lotteryName: lotteryInfo?.lotteryName}).then(
        res => {
          if (res.success && res.data) {
            setLotteryData(res.data);
          }
        },
      );
    }
  }, [lotteryInfo?.lotteryName, setLotteryData]);

  const onClickDigitalMiss = useCallback((show:boolean) => {
    setShowDigitalMiss(show);
  }, []);
  const onPeriodChange = useCallback(
    (lotteryData: LotteryDataSource.CharityLotteryDataSource) => {
      setLotteryData(lotteryData);
    },
    [setLotteryData],
  );
 
 

 

  return {
    positionList,
    showDigitalMiss,
    onClickDigitalMiss,
    lotteryData,
    onPeriodChange,
 
  };
};

export default useDigitalBase;
