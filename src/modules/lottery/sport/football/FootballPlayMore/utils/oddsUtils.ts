import {generateOddsCellKey} from 'src/modules/lottery/utils/lottery';
import {LOTTERY_CONFIG} from '../constants';
import {ViewStyle} from 'react-native';
import {TextStyle} from 'react-native';

// 创建OddsCell的通用函数
export const createOddsCell = (
  competitionId: string | number,
  handicapDto: LotteryDataSource.HandicapDto,
  competitionOddsDto: LotteryDataSource.CompetitionOddsDto,
  isSelected: boolean,
  onToggle: (key: string) => void,
  style?: ViewStyle,
  textStyle?: TextStyle,
) => {
  const oddsCellKey = generateOddsCellKey(
    Number(competitionId),
    handicapDto,
    competitionOddsDto,
  );

  return {
    key: oddsCellKey,
    oddsCellKey,
    isSelected,
    props: {
      isConfirmed: false,
      style: style,
      handicapDtos: handicapDto,
      competitionOddsDtos: competitionOddsDto,
      toggleSelection: () => onToggle(oddsCellKey),
      isSelected,
      textStyle,
    },
  };
};

// 检查是否为胜其他后的位置
export const isAfterWinOther = (
  competitionOddsDto: LotteryDataSource.CompetitionOddsDto,
  handicapDto: LotteryDataSource.HandicapDto,
  lotteryName: string,
) => {
  return (
    competitionOddsDto.betItem === '胜其他' &&
    lotteryName === 'FootballLottery' &&
    handicapDto.competitionOddsDtos?.findIndex(
      item => item === competitionOddsDto,
    ) ===
      handicapDto.competitionOddsDtos?.findIndex(
        item => item.betItem === '胜其他',
      )
  );
};

// 获取彩票配置
export const getLotteryConfig = (lotteryName: string) => {
  return LOTTERY_CONFIG[lotteryName as keyof typeof LOTTERY_CONFIG];
};

// 过滤handicapDtos
export const filterHandicapDtos = (
  competitionInfo: LotteryDataSource.MatchInfo | null,
  playKey?: string,
) => {
  return (
    competitionInfo?.handicapDtos?.filter(
      item => item.playEnglishName === playKey,
    ) ?? []
  );
};
