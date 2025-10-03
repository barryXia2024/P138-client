import { router } from "expo-router";
import {
  listSportsDrawAnnouncement,
  listSportsStatistics,
} from "src/api/interface/lottery-lottery-type-draw";


import { FONT_SIZES } from "p138-react-common/utils/styles/theme";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {  themeRedColor } from "p138-react-common/utils/styles/color";


import dayjs from "dayjs";
import useLotteryResultPageStore from "./store/lotteryResultTabStore";
import { lotteryNameMap } from "@/p138-react-common/constants/LotteryCommon";
import { LotteryIconMap } from "../constants/LotteryCommon";

export const LatestLotteryResult = () => {
  const { selectedLotteryType, setSelectedLotteryType } = useLotteryResultPageStore();

  const [flotteryResult, setFLotteryResult] =
    useState<LotteryDrawAnnouncement.SportsDrawAnnouncement[]>();
  const [blotteryResult, setBLotteryResult] =
    useState<LotteryDrawAnnouncement.SportsDrawAnnouncement[]>();
  // 获取折叠数据（初始加载）
  useEffect(() => {
    listSportsStatistics({
      lotteryName: "FootballLottery",
    }).then((res) => {
      if (res.success) {
        const statisticsVos = res.data || [];
        // 默认展开第一个分组
        if (statisticsVos && statisticsVos.length > 0) {
          const firstTitle = statisticsVos[0].processDate;

          // 加载第一个分组的数据
          listSportsDrawAnnouncement({
            lotteryName: "FootballLottery",
      
            processDate: dayjs(firstTitle).format('YYYY-MM-DD'),
          }).then((f) => {
            if (f.success) {
              setFLotteryResult(f.data);
            }
          });
        }
      }
    });
    listSportsStatistics({
      lotteryName: "BasketballLottery",
    }).then((res) => {
      if (res.success) {
        const statisticsVos = res.data || [];
        // 默认展开第一个分组
        if (statisticsVos && statisticsVos.length > 0) {
          const firstTitle = statisticsVos[0].processDate;

          // 加载第一个分组的数据
          listSportsDrawAnnouncement({
            lotteryName: "BasketballLottery",
            processDate: dayjs(firstTitle).format('YYYY-MM-DD'),
          }).then((b) => {
            if (b.success) {
              setBLotteryResult(b.data);
            }
          });
        }
      }
    });
  }, [selectedLotteryType]);
  const matchResult = (
    lotteryResult: LotteryDrawAnnouncement.SportsDrawAnnouncement[],
    onPress: () => void
  ) => {
    const resultInfo = lotteryResult[0];
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        className="border border-gray-300 bg-white mx-5 my-2 rounded-md p-2 elevation-1 gap-1"
      
      >
        <View
          className="flex-row items-center gap-2"
        >
          <Image
            source={LotteryIconMap[resultInfo.lotteryName]}
            style={{width: 20, height: 20}}
            resizeMode="stretch"
          />
          <Text style={{fontSize: FONT_SIZES.small}}>
            {lotteryNameMap[resultInfo.lotteryName]}
          </Text>
          <Text style={{fontSize: FONT_SIZES.small, color: "#999"}}>
            {resultInfo.termNo}
          </Text>
        </View>
        <View
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-2">
            <Text style={{fontSize: FONT_SIZES.small}}>{resultInfo.matchNum}</Text>
            <Text
              className="text-white px-2 py-1 rounded-md"
              style={[
                { backgroundColor: resultInfo.leagueColor,fontSize: FONT_SIZES.xsmall },
          
              ]}
            >
              {resultInfo.leagueName}
            </Text>
          </View>
          <View
           className="flex-row items-center gap-2 justify-between"
          >
            <Text style={{fontSize: FONT_SIZES.small}}>{resultInfo.home}</Text>
            <Text style={{fontSize: FONT_SIZES.small,color:themeRedColor}}>
              {resultInfo.matchScore}
            </Text>
            <Text style={{fontSize: FONT_SIZES.small}}>{resultInfo.away}</Text>
          </View>
        </View>
        
      </TouchableOpacity>
    );
  };

  return (
    <View className="bg-white">
      <View
        className="flex-row items-center gap-2"
      >
        <Image
          source={require("src/assets/imgs/home/icon_award.png")}
          style={{width: 20, height: 20}}
        />
        <Text style={{fontSize: FONT_SIZES.medium}}>开奖公告</Text>
      </View>
      {flotteryResult &&
        matchResult(flotteryResult, () => {
          setSelectedLotteryType("FootballLottery");
          router.push("/lottery/result/list");
        })}
      {blotteryResult &&
        matchResult(blotteryResult, () => {
          setSelectedLotteryType("BasketballLottery");
          router.push("/lottery/result/list");
        })}
    </View>
  );
};
