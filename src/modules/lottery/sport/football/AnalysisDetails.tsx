import React from 'react';
import {Text, View} from 'react-native';
import ProgressBar from './ProgressBar';
import {useLotteryEventStore} from 'src/modules/lottery/store/event';


/**
 * 投注比例
 * @param competition 比赛信息
 * @returns 投注比例
 */
const AnalysisDetails = (props: {competition: LotteryDataSource.MatchInfo}) => {
  const {competition} = props;
  const {showAnalysisDetails} = useLotteryEventStore();
  return showAnalysisDetails[competition.competitionId]?.isVisible ? (
    <View className="mt-4 flex-row">
      <View className="items-center bg-f0f0f0 px-2 py-1.5 ml-1">
        <Text className="text-[#333] text-sm">投注比例</Text>
      </View>
      <View className="flex-1 flex-row flex-wrap">
        {competition.handicapDtos
          ?.slice(0, 2)
          ?.flatMap(item => item.competitionOddsDtos)
          .map((competitionOddsDto, index) => (
            <ProgressBar
              key={index}
              value={competitionOddsDto?.rate ?? 0}
              color="#f04b49"
              leftOrRight='right'
              label={competitionOddsDto?.betItem ?? ''}
            />
          ))}
      </View>
    </View>
  ) : null;
};

export default AnalysisDetails;
