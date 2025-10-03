
export const generateOddsCellKey = (
  matchId: number,
  handicapDto: LotteryDataSource.HandicapDto,
  competitionOddsDtos: LotteryDataSource.CompetitionOddsDto,
): string => {
  return `${matchId}§${handicapDto.playChineseName}§${handicapDto.playEnglishName}§${handicapDto.hanicap}§${competitionOddsDtos.betItem}§${competitionOddsDtos.betName}§${competitionOddsDtos.odds}§${competitionOddsDtos.winColor}§${competitionOddsDtos.status}§${competitionOddsDtos.rate}`;
};

export const parseOddsCellKey = (
  oddsCellKey: string,
): {
  matchId: string;
  playEnglishName: string;
  playChineseName: string;
  hanicap: string;
  betItem: string;
  betName: string;
  odds: string;
  winColor: string;
  status: string;
  rate: string;
} => {
  const [
    matchId,
    playChineseName,
    playEnglishName,
    hanicap,
    betItem,
    betName,
    odds,
    winColor,
    status,
    rate,
  ] = oddsCellKey.split('§');
  return {
    matchId,
    playChineseName,
    playEnglishName,
    hanicap,
    betItem,
    betName,
    odds,
    winColor,
    status,
    rate,
  };
};
