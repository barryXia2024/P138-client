import React from 'react';
import BasketballBetListItem from './basketball/betListItem';
import FootballBetListItem from './football/FootballBetListCard';
import BeijingBetListItem from './bj/BJBetListCard';
import WinLossBetListItem from './traditional/winLoss/betListItem';
import GameTotalGoalsItem from './traditional/gameTotal/gameTotalGoalsItem';
import { useLotteryInfoStore } from '../store';
// 竞彩玩法列表Item
const lotteryCompititionMap: Partial<
  Record<
    | 'FootballLottery'
    | 'BasketballLottery'
    | 'BeijingSingleMatch'
    | 'WinLossLottery'
    | 'ChooseNine'
    | 'DoubleBall'
    | 'ArrangedFive'
    | 'ArrangedThree'
    | 'SuperLotto'
    | 'SevenHappy'
    | 'Happy8'
    | 'Fucai3D'
    | 'HalfTimeFullTimeBet6'
    | 'GameTotalGoalsBet4'
    | 'SevenStar'
    | 'Winner'
    | 'WinnerRunnerUp',
    React.ComponentType<CompetitionProps.MatchCardProps>
  >
> = {
  FootballLottery: FootballBetListItem,
  BasketballLottery: BasketballBetListItem,
  BeijingSingleMatch: BeijingBetListItem,
  WinLossLottery: WinLossBetListItem,
  ChooseNine: WinLossBetListItem,
  HalfTimeFullTimeBet6: GameTotalGoalsItem,
  GameTotalGoalsBet4: GameTotalGoalsItem,
};

const CompetitionCardAdapter = (
  CompetitionCardAdapterProps: CompetitionProps.CompetitionCardAdapterProps,
) => {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);
  const LotteryCompititionCard =
    lotteryCompititionMap[lotteryInfo?.lotteryName||'FootballLottery'];
  if (!LotteryCompititionCard) return null;
  return <LotteryCompititionCard competition={CompetitionCardAdapterProps.competition} />;
};

export default CompetitionCardAdapter;
