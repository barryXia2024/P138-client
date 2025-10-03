import play_basketball_1 from 'src/assets/imgs/lottery_info/play_basketball_1.webp';
import play_basketball_2 from 'src/assets/imgs/lottery_info/play_basketball_2.webp';
import play_basketball_3 from 'src/assets/imgs/lottery_info/play_basketball_3.webp';
import play_basketball_4 from 'src/assets/imgs/lottery_info/play_basketball_4.webp';
import play_football_1 from 'src/assets/imgs/lottery_info/play_football_1.webp';
import play_football_2 from 'src/assets/imgs/lottery_info/play_football_2.webp';
import play_football_3 from 'src/assets/imgs/lottery_info/play_football_3.webp';
import play_football_4 from 'src/assets/imgs/lottery_info/play_football_4.webp';
import play_football_5 from 'src/assets/imgs/lottery_info/play_football_5.webp';
import play_single_1 from 'src/assets/imgs/lottery_info/play_single_1.webp';
import play_single_2 from 'src/assets/imgs/lottery_info/play_single_2.webp';
import play_single_3 from 'src/assets/imgs/lottery_info/play_single_3.webp';
import play_single_4 from 'src/assets/imgs/lottery_info/play_single_4.webp';
import play_single_5 from 'src/assets/imgs/lottery_info/play_single_5.webp';
import play_single_6 from 'src/assets/imgs/lottery_info/play_single_6.webp';
import play_arranged_three_3 from 'src/assets/imgs/lottery_info/play_rank_3.webp';
import play_arranged_three_5 from 'src/assets/imgs/lottery_info/play_rank_5.webp';
import play_daletou  from 'src/assets/imgs/lottery_info/play_daletou.webp'
import play_seven_star from 'src/assets/imgs/lottery_info/play_seven_star.webp'
import play_double_ball from 'src/assets/imgs/lottery_info/play_double_ball.webp'
import play_fucai_3d from 'src/assets/imgs/lottery_info/play_fucai_3d.webp'
import play_six_half from 'src/assets/imgs/lottery_info/play_six_half.webp'
import play_goal_four from 'src/assets/imgs/lottery_info/play_goal_four.webp'
import play_winner from 'src/assets/imgs/lottery_info/play_winner.webp'
import play_winner_runner_up from 'src/assets/imgs/lottery_info/play_winner_runner_up.webp'
import play_qilecai from 'src/assets/imgs/lottery_info/play_qilecai.webp'
import play_happy_8 from 'src/assets/imgs/lottery_info/play_happy_8.webp'
import play_win_lose from 'src/assets/imgs/lottery_info/play_win_lose.webp'



export const bjSingerRullerImages = [
  'play_single_1',
  'play_single_2',
  'play_single_3',
  'play_single_4',
  'play_single_5',
  'play_single_6',
];
export const basketballRullerImages = [
  'play_basketball_1',
  'play_basketball_2',
  'play_basketball_3',
  'play_basketball_4',
];
export const footballRullerImages = [
  'play_football_1',
  'play_football_2',
  'play_football_3',
  'play_football_4',
  'play_football_5',
];

export const arrangedThreeRullerImages = [
  'play_arranged_three_3',
];
export const arrangedFiveRullerImages = [
  'play_arranged_three_5',
];
export const SevenStarRullerImages = [
  'play_seven_star',
];
export const SuperLottoRullerImages = [
  'play_daletou',
];
export const Happy8RullerImages = [
  'play_happy_8',
];
export const Fucai3DRullerImages = [
  'play_fucai_3d',
];
export const SevenHappyRullerImages = [
  'play_qilecai',
];
export const play_double_ballImages= [
  'play_double_ball',
]
export const HalfTimeFullTimeBet6RullerImages = [
  'play_six_half',
];
export const GameTotalGoalsBet4RullerImages = [
  'play_goal_four',
];
export const WinnerRullerImages = [
  'play_winner',
];
export const WinnerRunnerUpRullerImages = [
  'play_winner_runner_up',
];
export const winLossLotteryRullerImages = ['play_win_lose'];
export const ChooseNineRullerImages = ['play_option_9'];
export const ballPlayRullerImages: Record<
  CoreCommonEnum.LotteryName,
  string[]
> = {
  FootballLottery: footballRullerImages,
  BasketballLottery: basketballRullerImages,
  BeijingSingleMatch: bjSingerRullerImages,
  ChooseNine: ChooseNineRullerImages,
  WinLossLottery: winLossLotteryRullerImages,
  DoubleBall: play_double_ballImages,
  ArrangedFive: arrangedFiveRullerImages,
  ArrangedThree: arrangedThreeRullerImages,
  SuperLotto:    SuperLottoRullerImages,
  SevenHappy: SevenHappyRullerImages,
  Happy8: Happy8RullerImages,
  Fucai3D: Fucai3DRullerImages,
  HalfTimeFullTimeBet6: HalfTimeFullTimeBet6RullerImages,
  GameTotalGoalsBet4: GameTotalGoalsBet4RullerImages,
  SevenStar: SevenStarRullerImages,
  Winner: WinnerRullerImages,
  WinnerRunnerUp: WinnerRunnerUpRullerImages,
  
 
};

export type Label =
  | '胜平负'
  | '让球胜平负'
  | '猜比分'
  | '总进球'
  | '半全场'
  | '胜负'
  | '让分'
  | '大小分'
  | '胜负差'
  | '上下单双'
  | '胜负过关';
export const imageLabelMap: Record<string, Label> = {
  play_football_1: '胜平负',
  play_football_2: '让球胜平负',
  play_football_3: '猜比分',
  play_football_4: '总进球',
  play_football_5: '半全场',
  play_basketball_1: '胜负',
  play_basketball_2: '让分',
  play_basketball_3: '大小分',
  play_basketball_4: '胜负差',
  play_single_1: '胜平负',
  play_single_2: '猜比分',
  play_single_3: '总进球',
  play_single_4: '半全场',
  play_single_5: '上下单双',
  play_single_6: '胜负过关',
};

// 图片文件名映射
export const imageMap: Record<string, string> = {
  play_basketball_1,
  play_basketball_2,
  play_basketball_3,
  play_basketball_4,
  play_bonus_optimization: 'lottery_info/play_bonus_optimization.webp',
  play_daletou ,
  play_double_ball,
  play_football_1,
  play_football_2 ,
  play_football_3,
  play_football_4,
  play_football_5,
  play_fucai_3d,
  play_goal_four,
  play_happy_8,
  play_match_error: 'lottery_info/play_match_error.webp',
  play_option_9: 'lottery_info/play_option_9.webp',
  play_qilecai,
  play_rank_3: 'lottery_info/play_rank_3.webp',
  play_rank_5: 'lottery_info/play_rank_5.webp',
  play_seven_star ,
  play_single_1,
  play_single_2,
  play_single_3,
  play_single_4,
  play_single_5,
  play_single_6,
  play_six_half,
  play_win_lose,
  play_arranged_three_3 ,
 
  play_arranged_three_5 ,
};
