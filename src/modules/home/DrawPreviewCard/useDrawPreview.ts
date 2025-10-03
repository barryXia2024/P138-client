import { useCallback, useEffect, useState } from "react";
import { DrawModel } from "./DrawModel";
import useLotteryResultStore from "src/store/lottery/result";
import { router } from "expo-router";

export const useDrawPreview = () => {
  const {setActiveTab} = useLotteryResultStore();
  const [drawData, setDrawData] = useState<
    Record<
      Extract<
        CoreCommonEnum.LotteryName,
        'FootballLottery' | 'BasketballLottery' | 'BeijingSingleMatch'
      >,
      LotteryDrawAnnoumcememt.SportsDrawAnnouncement[] | null
    >
  >({
    FootballLottery: null,
    BasketballLottery: null,
    BeijingSingleMatch: null,
  });
  useEffect(() => {
    DrawModel.getAllDrawData().then(setDrawData);
  }, []);

  // 处理足球开奖点击
  const handleFootballDrawPress = useCallback(() => {
    try {
      setActiveTab('FootballLottery');
      router.push('/lottery/result/list?activity=1');
    } catch (error) {
      console.error('处理足球开奖点击失败:', error);
    }
  }, [setActiveTab]);

  // 处理篮球开奖点击
  const handleBasketballDrawPress = useCallback(() => {
    try {
      setActiveTab('BasketballLottery');
      router.push('/lottery/result/list?activity=2');
    } catch (error) {
      console.error('处理篮球开奖点击失败:', error);
    }
  }, [setActiveTab]);
  // 处理北京单场开奖点击
  const handleBeijingSingleMatchDrawPress = useCallback(() => {
    try {
      setActiveTab('BeijingSingleMatch');
      router.push('/lottery/result/list?activity=3');
    } catch (error) {
      console.error('处理北京单场开奖点击失败:', error);
    }
  }, [setActiveTab]);

  return {
    drawData,
    handleFootballDrawPress,
    handleBasketballDrawPress,
    handleBeijingSingleMatchDrawPress,
  };
};
