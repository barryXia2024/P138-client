import {useBetInfoStore} from 'src/modules/lottery/store/betInfo';
import {parseOddsCellKey} from './oddsKeyHelper';
import {BetOption, EveryBetType} from '../../../types/lottery/bets';

/**
 * 更新 HandicapDtos 的选中状态
 * @param selectedHandicapDtos 当前选中的玩法对象
 * @param handicapDtos 当前的 Handicap 对象
 * @param competitionOddsDtos 当前的 Odds 对象
 * @param isSelected 是否已选中
 * @returns 更新后的玩法对象
 */
export function updateHandicapDtos(
  selectedHandicapDtos: Record<string, LotteryDataSource.CompetitionOddsDto[]>,
  handicapDtos: LotteryDataSource.HandicapDto,
  competitionOddsDtos: LotteryDataSource.CompetitionOddsDto,
  isSelected: boolean,
) {
  const updatedSelectedHandicapDtos = {...selectedHandicapDtos};

  // 更新当前玩法的选中状态
  const currentHandicap =
    selectedHandicapDtos[handicapDtos.playEnglishName!] || [];
  updatedSelectedHandicapDtos[handicapDtos.playEnglishName!] = isSelected
    ? currentHandicap.filter(
        item =>
          item.betItem !== competitionOddsDtos.betItem &&
          item.betName !== competitionOddsDtos.betItem,
      ) // 取消选中
    : [...currentHandicap, competitionOddsDtos]; // 添加选中

  // 如果当前玩法为空，删除对应的键
  if (
    updatedSelectedHandicapDtos[handicapDtos.playEnglishName!]?.length === 0
  ) {
    delete updatedSelectedHandicapDtos[handicapDtos.playEnglishName!];
  }

  return updatedSelectedHandicapDtos;
}

//计算是否是单关
export function jumentSingle(selectedMatches: Record<string, string[]>) {
  const keys = Object.keys(selectedMatches);
  if (keys.length !== 1) {
    return false;
  } else {
    const matchId = keys[0];
    const matchInfo = useBetInfoStore.getState().matchData[matchId];
    const handicapDtosPlayEnglishName = selectedMatches[matchId]?.map(
      key => parseOddsCellKey(key).playEnglishName,
    );
    const notSingle = matchInfo.handicapDtos?.find(
      handicapDto =>
        handicapDto.single === '1' &&
        handicapDtosPlayEnglishName.findIndex(
          name => name === handicapDto.playEnglishName,
        ) > -1,
    );

    return notSingle;
  }
}

export function game4Hlaf6calculateBets(matchData: Record<string, string[]>) {
  const matches = expandedMatches(matchData);

  const result: {
    passType: string;
    combinations: EveryBetType[][];
    betCount: number;
  }[] = [];

  if (matches.length >= 4) {
    // 对每场比赛生成主客队进球数的组合
    const matchCombinations = matches.map(match => {
      const homeGoals = match.filter(bet => bet.playType === 'home');
      const awayGoals = match.filter(bet => bet.playType === 'away');

      // 生成主客队进球数的所有可能组合
      const combinations = [];
      for (const home of homeGoals) {
        for (const away of awayGoals) {
          combinations.push([home, away]);
        }
      }

      return combinations;
    });

    // 计算所有比赛的笛卡尔积
    const allCombinations =
      game4HalfTimeFullTimeCartesianProduct(matchCombinations);

    result.push({
      passType: '',
      combinations: allCombinations,
      betCount: allCombinations.length,
    });
  }

  return result;
}

function game4HalfTimeFullTimeCartesianProduct(
  matchCombinations: EveryBetType[][][],
): EveryBetType[][] {
  return matchCombinations.reduce<EveryBetType[][]>(
    (acc, currentMatchOptions) => {
      return acc.flatMap(existingCombination =>
        currentMatchOptions.map(currentOption => [
          ...existingCombination,
          ...currentOption,
        ]),
      );
    },
    [[]],
  );
}
export const game4HalfTimeFullTimeCalculateTotalBets = (
  selectedMatches: Record<string, string[]>,
) => {
  const betsResult = game4Hlaf6calculateBets(selectedMatches);
  console.log('betsResult', betsResult);

  let betsCount = 0;
  let maxPayout = 0;
  let minPayout = Infinity;

  betsResult.forEach(item => {
    betsCount += item.betCount;
    item.combinations.forEach(combination => {
      const oddsProduct = combination.reduce(
        (product, bet) => product * (bet.bet.odds ?? 0),
        1,
      );
      const payout = isNaN(oddsProduct) ? 0 : oddsProduct * 2; // Assume each bet amount is 2
      maxPayout = Math.max(maxPayout, payout);
      minPayout = Math.min(minPayout, payout);
    });
  });

  return {betsCount, maxPayout, minPayout};
};
export const calculateTotalBets = (
  passTypes: string[],
  selectedMatches: Record<string, string[]>,
) => {
  const freePassOption: BetOption = {mode: '自由过关', passTypes};
  const betsResult = calculateBets(selectedMatches, freePassOption);

  let betsCount = 0;
  let maxPayout = 0;
  let minPayout = Infinity;

  betsResult.forEach(item => {
    betsCount += item.betCount;
    item.combinations.forEach(combination => {
      const oddsProduct = combination.reduce(
        (product, bet) => product * bet.bet.odds!,
        1,
      );
      const payout = oddsProduct * 2; // Assume each bet amount is 2
      maxPayout = Math.max(maxPayout, payout);
      minPayout = Math.min(minPayout, payout);
    });
  });

  return {betsCount, maxPayout, minPayout};
};

// Expand matches to options format
export const expandedMatches = (matchData: Record<string, string[]>) => {
  return Object.entries(matchData).map(
    ([matchId, selectedHandicapDtosKeys]) => {
      return selectedHandicapDtosKeys.map(key => {
        const {
          playEnglishName,
          betName,
          betItem,
          odds,
          winColor,
          status,
          rate,
        } = parseOddsCellKey(key);
        return {
          matchId,
          playType: playEnglishName,
          bet: {
            betName,
            betItem,
            odds: parseFloat(odds),
            winColor,
            status,
            rate: parseFloat(rate),
          },
        };
      });
    },
  );
};

// Function to calculate bets with combinations and bet count
export function calculateBets(
  matchData: Record<string, string[]>,
  option: BetOption,
) {
  const {mode, passTypes} = option;
  const matches = expandedMatches(matchData);

  const result: {
    passType: string;
    combinations: EveryBetType[][];
    betCount: number;
  }[] = [];

  passTypes.forEach(passType => {
    if (passType === '单关') {
      const singleMatchCombinations = matches.flat().map(options => [options]);
      result.push({
        passType,
        combinations: singleMatchCombinations,
        betCount: singleMatchCombinations.length,
      });
      return;
    }

    const [M, N] = passType.split('串').map(Number);
    if (matches.length < M) {
      throw new Error(`${passType} 需要至少选择 ${M} 场比赛`);
    }

    const matchCombinations = getCombinations(matches.flat(), M);
    const allCombinations = matchCombinations.flatMap(matchCombo => {
      const hasDuplicateMatchId = matchCombo.some((item, index) =>
        matchCombo
          .slice(index + 1)
          .some(nextItem => nextItem.matchId === item.matchId),
      );
      return hasDuplicateMatchId
        ? []
        : cartesianProduct(matchCombo.map(item => [item]));
    });

    const betCount =
      mode === '自由过关'
        ? allCombinations.length
        : allCombinations.length * (N || 1);

    result.push({passType, combinations: allCombinations, betCount});
  });

  return result;
}

// Cartesian product function
function cartesianProduct(arrays: EveryBetType[][]): EveryBetType[][] {
  return arrays.reduce<EveryBetType[][]>(
    (acc, currentArray) => {
      return acc.flatMap(existingCombination =>
        currentArray.map(currentElement => [
          ...existingCombination,
          currentElement,
        ]),
      );
    },
    [[]],
  );
}

// Helper function: Get combinations of matches
function getCombinations(
  array: EveryBetType[],
  size: number,
): EveryBetType[][] {
  const combinations: EveryBetType[][] = [];
  const total = array.length;

  if (size > total) {
    return combinations;
  }

  const indices: number[] = Array(size).fill(0);

  while (true) {
    const combination = indices.map(index => array[index]);
    combinations.push(combination);

    let i = size - 1;
    while (i >= 0 && indices[i] === i + total - size) {
      i--;
    }

    if (i < 0) {
      break;
    }

    indices[i]++;
    for (let j = i + 1; j < size; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }
  return combinations;
}

// Generate pass types for combinations
export function generatePassTypes(max: number): string[] {
  if (max < 2) {
    globalThis.Toast.show('最大串关数必须大于等于2');
    return [];
  }

  return Array.from({length: max - 1}, (_, i) => `${i + 2}串1`);
}

// Get bet content for sports lottery
export const getBetContentSportsLotteryList = (
  selectedMatches: Record<string, string[]>,
  matchData: Record<string, LotteryDataSource.MatchInfo>,
  betPlay: string,
  typeInfo: ServerCommonLottery.ListCustomLotteryResult,
) => {
  const transformBetPlay = {
    胜: '3',
    平: '1',
    负: '0',
  };
  return Object.entries(selectedMatches).map(
    ([matchId, selectedHandicapDtosKeys]) => {
      const match = matchData[matchId];
      const dict: Record<string, string[]> = {
        主: [],
        客: [],
      };
      const isSixOrFOr = [
        'GameTotalGoalsBet4',
        'HalfTimeFullTimeBet6',
      ].includes(typeInfo?.lotteryName as string);

      let betPlayList: ServerCommonOrder.BetPlayInfo[] =
        selectedHandicapDtosKeys.map(key => {
          const {playChineseName, hanicap, betItem, odds} =
            parseOddsCellKey(key);
          if (isSixOrFOr) {
            if (playChineseName === '主') {
              dict['主'].push(betItem);
            } else {
              dict['客'].push(betItem);
            }
          }

          const betPlayString: Record<
            Extract<
              CommonCommonEnum.LotteryName,
              | 'FootballLottery'
              | 'BasketballLottery'
              | 'BeijingSingleMatch'
              | 'WinLossLottery'
              | 'ChooseNine'
            >,
            string
          > = {
            FootballLottery: playChineseName,
            BasketballLottery: playChineseName,
            BeijingSingleMatch: playChineseName,

            WinLossLottery: betPlay,
            ChooseNine: betPlay,
          };
          const betItemString: Record<
            Extract<
              CommonCommonEnum.LotteryName,
              | 'FootballLottery'
              | 'BasketballLottery'
              | 'BeijingSingleMatch'
              | 'WinLossLottery'
              | 'ChooseNine'
              | 'GameTotalGoalsBet4'
              | 'HalfTimeFullTimeBet6'
            >,
            string
          > = {
            FootballLottery: betItem,
            BasketballLottery: betItem,
            BeijingSingleMatch: betItem,

            WinLossLottery:
              transformBetPlay[betItem as keyof typeof transformBetPlay],
            ChooseNine:
              transformBetPlay[betItem as keyof typeof transformBetPlay],
            GameTotalGoalsBet4: betItem,
            HalfTimeFullTimeBet6: betItem,
          };

          return {
            betPlay: betPlayString[typeInfo?.lotteryName],
            betHandicap: hanicap === 'null' ? null : hanicap,
            betItem: betItemString[typeInfo?.lotteryName],
            betOdds: odds === 'null' ? 0 : parseFloat(odds),
            result: null,
            hasHit: null,
            competitionId: Number(matchId),
            competitionTime: match.competitionTime,
            competitionSessions: match.matchNum,
          };
        });

      if (isSixOrFOr) {
        if (typeInfo?.lotteryName === 'GameTotalGoalsBet4') {
          const betItem =
            dict['主'].sort((a, b) => a.localeCompare(b)).join('-') +
            '#' +
            dict['客'].sort((a, b) => a.localeCompare(b)).join('-');
          let betPlay = betPlayList[0];
          betPlay.betItem = betItem;
          betPlayList = [betPlay];
        } else {
          const betItem =
            dict['主']
              .sort((a, b) => (Number(b) - Number(a) > 0 ? 1 : -1))
              .join('-') +
            '#' +
            dict['客']
              .sort((a, b) => (Number(b) - Number(a) > 0 ? 1 : -1))
              .join('-');
          let betPlay = betPlayList[0];
          betPlay.betItem = betItem;
          betPlayList = [betPlay];
        }
      }

      return {
        home: match.home,
        away: match.away,
        betPlayList,
        // termNo:match.termNo,
        competitionId: Number(matchId),
        competitionTime: match.competitionTime,
        competitionSessions: match.matchNum,
      };
    },
  );
};
