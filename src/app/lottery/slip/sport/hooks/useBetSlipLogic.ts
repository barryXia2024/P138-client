import {useEffect, useState} from 'react';
import {router} from 'expo-router';
import {
  calculateTotalBets,
  game4HalfTimeFullTimeCalculateTotalBets,
  generatePassTypes,
  jumentSingle,
} from 'p138-react-common/utils/fuc/lottery/bet';
import {calculatePrize} from 'src/modules/lottery/utils/prizeCalculator';
import {useBetInfoStore, useLotteryInfoStore} from 'src/modules/lottery/store';
import {
  SportLotteryType,
  SportLotteryTypeEnum,
} from 'src/modules/lottery/constants';
import {useSlipStore} from '../../store/slipStore';
import {bonusOptimization} from 'src/api/interface/orders-bet';
import {parseOddsCellKey} from 'src/modules/lottery/utils/lottery';

export const useBetSlipLogic = () => {
  const {lotteryInfo} = useLotteryInfoStore();
  const [loading, setLoading] = useState(false);
  const {
    selectedMatches,
    matchData,
    resetStore,
    setSelectedPassTypes,
    setPassTypeOptions,
  } = useBetInfoStore();
 
  const {setBetInfo, betInfo} = useSlipStore();
  const {selectedPassTypes,multiplier} = useBetInfoStore();

  // 计算投注信息
  const calculateBetInfo = (passTypes: string[]) => {
    if (
      ['GameTotalGoalsBet4', 'HalfTimeFullTimeBet6'].includes(
        lotteryInfo?.lotteryName as string,
      )
    ) {
      return game4HalfTimeFullTimeCalculateTotalBets(selectedMatches);
    }
    return calculateTotalBets(passTypes, selectedMatches);
  };

  // 初始化投注信息
  const initBetInfo = async () => {
    const matchCount = Object.keys(selectedMatches).length;

    if (matchCount === 1) {
      const isSingle = jumentSingle(selectedMatches);
      if (isSingle) {
        setPassTypeOptions(['单关']);
        setSelectedPassTypes(['单关']);
      }

      const betCount = calculateTotalBets(['单关'], selectedMatches);
      setBetInfo({
        betsCount: betCount.betsCount,
        maxPayout: betCount.maxPayout,
        minPayout: betCount.minPayout,
        betsAmount: betCount.betsCount * 2,
      });
    } else {
      const passTypes = generatePassTypes(matchCount);
      if (lotteryInfo?.lotteryName === 'BeijingSingleMatch') {
        passTypes.unshift('单关');
      }

      setPassTypeOptions(passTypes);
      const defaultPassType = [passTypes[passTypes.length - 1]];
      setSelectedPassTypes(defaultPassType);

      if (
        SportLotteryType[lotteryInfo?.lotteryName || 'FootballLottery'] ===
        SportLotteryTypeEnum.Sport
      ) {
        setLoading(true);
        calculatePrize(
          defaultPassType.join('#'),
          selectedMatches,
          matchData,
          lotteryInfo,
        )
          .then(result => {
            setLoading(false);
            if (result) {
              setBetInfo({
                betsCount: result.data?.number,
                maxPayout: result.data.maxWinAmount,
                minPayout: result.data.minWinAmount,
                betsAmount: result.data.betAmount,
              });
            } else {
              const betInfo = calculateBetInfo(defaultPassType);
              setBetInfo({
                betsCount: betInfo.betsCount,
                maxPayout: betInfo.maxPayout,
                minPayout: betInfo.minPayout,
                betsAmount: betInfo.betsCount * 2,
              });
            }
          }).catch(error=>{
            console.log('error=====', error);
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        const betInfo = calculateBetInfo(defaultPassType);
        setBetInfo({
          betsCount: betInfo.betsCount,
          maxPayout: betInfo.maxPayout,
          minPayout: betInfo.minPayout,
          betsAmount: betInfo.betsCount * 2,
        });
      }
    }
  };

  // 获取截止时间
  const getDeadline = () => {
    const firstMatchKey = Object.keys(selectedMatches)[0];
    return matchData[firstMatchKey]?.buyEndTime;
  };

  // 清空投注
  const clearBets = () => {
    resetStore();
    setPassTypeOptions([]);
    setSelectedPassTypes([]);
    router.back();
  };

  const getOpimization = (betAmount:string) => {
     
  const betItem =   Object.keys(selectedMatches).map(matchId => {
      const match = matchData[matchId];
     return selectedMatches[matchId].map(oddsCellKey => {
        const odds = parseOddsCellKey(oddsCellKey);

        const matchBetItem =
          match.matchNum +
          ' ' +
          match.home +
          '=' +
          odds.betItem +
          '@' +
          odds.odds;

        return matchBetItem;
      }).join('-')
    }).join('#')
    if(betInfo.betsAmount*multiplier<20){
      Toast.show('最少投注金额为20元')
      return
    }
    // router.push({
    //   pathname:'/lottery/slip/sport/optimization',
     
    // })
    bonusOptimization({
      betItem,
      betFreePass: selectedPassTypes.join('#'),
      betAmount,
      // betAmount:(betInfo.betsAmount*multiplier).toString(),
    }).then(res=>{
        if(res.data){
          router.push({
            pathname:'/lottery/slip/sport/optimization',
            params:{
              data:JSON.stringify(res.data),
              betAmount,
              // betAmount:(betInfo.betsAmount*multiplier).toString(),
            }
          })
        }
    })
  };

  useEffect(() => {
    if (Object.keys(selectedMatches).length > 0) {
      initBetInfo();
    }
  }, [selectedMatches]);

  return {
    lotteryInfo,
    getDeadline,
    clearBets,
    loading,
    getOpimization,
  };
};
