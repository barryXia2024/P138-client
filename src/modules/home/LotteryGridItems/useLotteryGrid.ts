import {useCallback, useEffect, useState} from 'react';
import {router} from 'expo-router';
import {useLotteryInfoStore} from 'src/modules/lottery/store/lotteryInfo';

import {SportLotteryTypeEnum} from 'src/modules/lottery/constants/lotteryEnmu';
import {LotteryModel} from 'src/app/home/models';
import {useUserStore} from 'src/store';
import {listCustomLotteryApi} from 'src/api/interface/lottery-lottery-type';

export const useLotteryGrid = () => {
  const {setLotteryInfo} = useLotteryInfoStore();
  const {loginInfo} = useUserStore();
  const [loading, setLoading] = useState(false);
  const [lotteryData, setLotteryData] = useState<{
    category1: ServerCoreLottery.ListCustomLotteryResult[];
    category2: ServerCoreLottery.ListCustomLotteryResult[];
  }>();

  useEffect(() => {
    setLoading(true);
    if (loginInfo?.shopCode) {
      listCustomLotteryApi({
        shopCode: loginInfo.shopCode,
      }).then(res => {
              setLotteryData({
          category1: res.data?.filter(item => item.lotteryCategory === 1).sort((a, b) => (a.lotterySort || 0) - (b.lotterySort || 0)) || [],
          category2: res.data?.filter(item => item.lotteryCategory === 2).sort((a, b) => (b.lotterySort || 0) - (a.lotterySort || 0)) || [],
        });
        setLoading(false);
      });
    }
  }, [loginInfo?.shopCode]);


  // 处理彩票点击
  const handleLotteryPress = useCallback(
    (lottery: ServerCoreLottery.ListCustomLotteryResult) => {
      try {
        console.log('lottery',lottery);
        // 设置彩票信息到 store
        setLotteryInfo(lottery);
        // 根据彩票类型进行不同处理
        if (lottery.lotteryType === SportLotteryTypeEnum.Sport) {
          // 竞技彩
          router.push({
            pathname: '/lottery/sport/competitive',
            params: {
              id: lottery.id,
              lotteryName: lottery.lotteryName,
            },
          });
        } else if (lottery.lotteryType === SportLotteryTypeEnum.Traditional) {
          // 传统足彩
          router.push({
            pathname: '/lottery/sport/traditional',
            params: {
              id: lottery.id,
              lotteryName: lottery.lotteryName,
            },
          });
        } else {
          router.push({
            pathname: '/lottery/sport/digital',
            params: {
              id: lottery.id,
              lotteryName: lottery.lotteryName,
            },
          });
          // 其他类型
          console.warn('该功能暂未开放:', lottery.lotteryName);
          // 这里可以显示 Toast 提示
        }
      } catch (error) {
        console.error('处理彩票点击失败:', error);
      }
    },
    [setLotteryInfo],
  );

  // 获取处理后的彩票数据
  const getProcessedLotteryData = useCallback(() => {
    if (loading) {
      return {category1: [], category2: []};
    }


    const saleableCategory1 = lotteryData?.category1.filter(lottery =>
      LotteryModel.isSaleable(lottery),
    );

    // 只显示竞技彩（category2），过滤掉不可销售的
    const saleableCategory2 = lotteryData?.category2.filter(lottery =>
      LotteryModel.isSaleable(lottery),
    );

    return {
      category1: LotteryModel.sortLotteries(saleableCategory1 || []),
      category2: LotteryModel.sortLotteries(saleableCategory2 || []),
    };
  }, [lotteryData, loading]);

  // 检查是否有可显示的彩票
  const hasLotteries = useCallback(() => {
    const processed = getProcessedLotteryData();
    return processed.category1.length > 0 || processed.category2.length > 0;
  }, [getProcessedLotteryData]);

  // 获取彩票显示信息
  const getLotteryDisplayInfo = useCallback(
    (lottery: ServerCoreLottery.ListCustomLotteryResult) => {
      return {
        name: lottery.lotteryChineseName || lottery.lotteryName,
        iconUrl: lottery.lotteryIcon.replace('https://', 'http://'),
        description: lottery.lotteryDesc || '',
        isSaleable: lottery.saleSwitch === 1,
      };
    },
    [],
  );

  console.log(lotteryData);
  return {
    lotteryData,
    processedLotteryData: getProcessedLotteryData(),
    hasLotteries: hasLotteries(),

    // 方法
    handleLotteryPress,
    getLotteryDisplayInfo,
  };
};
