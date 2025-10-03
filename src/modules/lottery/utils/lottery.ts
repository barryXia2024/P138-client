/**
 * 生成赔率cell的key
 * @param matchId 赛事id
 * @param handicapDto 让球信息
 * @param competitionOddsDtos 赔率信息
 * @returns 赔率cell的key
 */
export const generateOddsCellKey = (
  matchId: number,
  handicapDto: LotteryDataSource.HandicapDto,
  competitionOddsDtos: LotteryDataSource.CompetitionOddsDto,
): string => {
  return `${matchId}§${handicapDto.playChineseName}§${handicapDto.playEnglishName}§${handicapDto.hanicap}§${competitionOddsDtos.betItem}§${competitionOddsDtos.betName}§${competitionOddsDtos.odds}§${competitionOddsDtos.winColor}§${competitionOddsDtos.status}§${competitionOddsDtos.rate}`;
};

/**
 * 解析赔率cell的key
 * @param oddsCellKey 赔率cell的key
 * @returns 赔率cell的key
 */
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

/**
 * 获取重复的赛事id
 * @param selectedMatches 选中的赛事
 * @returns 是否存在重复的赛事id
 */
export const getDuplicatedMatchIds = (
  selectedMatches: Record<string, string[]>,
) => {
  const duplicatedMatchIds: Record<string, Set<string>> = {};
  Object.values(selectedMatches).forEach(oddskeys => {
    oddskeys.forEach(oddskey => {
      const odds = parseOddsCellKey(oddskey);
      if (!duplicatedMatchIds[odds.matchId]) {
        duplicatedMatchIds[odds.matchId] = new Set();
      }
      duplicatedMatchIds[odds.matchId].add(odds.playEnglishName);
    });
  });
  return (
    Object.values(duplicatedMatchIds).filter(match => match.size > 1).length > 1
  );
};

/**
 * 过滤赛事
 * @param data 赛事数据
 * @param selectedLeagues 选中的联赛
 * @param selectedOddsRanges 选中的赔率范围
 * @param onlyWinDrawLose 是否只显示胜平负
 * @returns 过滤后的赛事数据
 */
export const filterMatches = (
  data: LotteryDataSource.TimeSportsLotteryResult[],
  selectedLeagues: string[],
  selectedOddsRanges: LotteryTypes.filterOddsRangeType[],
  onlyWinDrawLose: boolean,
) => {
  if (data?.length === 0) return [];
  return data
    ?.map(dateGroup => {
      const filteredMatches = dateGroup.timeSportsLottery?.filter(match => {
        // 联赛筛选
        if (
          selectedLeagues.length > 0 &&
          !selectedLeagues.includes(match.leagueName)
        ) {
          return false;
        }

        // 找到胜平负玩法的赔率
        const spfHandicap = match.handicapDtos?.find(
          item => item.playChineseName === '胜平负',
        );

        // 只显示胜平负单关
        if (onlyWinDrawLose) {
          // 判断是否存在胜平负玩法且为单关
          if (!spfHandicap || spfHandicap.single !== '1') {
            return false;
          }
        }

        // 赔率筛选
        if (selectedOddsRanges.length > 0 && spfHandicap) {
          const odds = spfHandicap.competitionOddsDtos || [];
          // 获取胜平负的三个赔率
          const homeOdds = odds.find(odd => odd.betItem === '胜')?.odds || 0;
          const drawOdds = odds.find(odd => odd.betItem === '平')?.odds || 0;
          const awayOdds = odds.find(odd => odd.betItem === '负')?.odds || 0;

          const minOdds = Math.min(
            homeOdds || Infinity,
            drawOdds || Infinity,
            awayOdds || Infinity,
          );

          const matchesOddsRange = selectedOddsRanges.some(range => {
            switch (range) {
              case 'under1.5':
                return minOdds > 0 && minOdds < 1.5;
              case '1.5to2':
                return minOdds >= 1.5 && minOdds < 2;
              case 'above2':
                return minOdds >= 2;
              default:
                return false;
            }
          });

          if (!matchesOddsRange) return false;
        }

        return true;
      });

      return {
        ...dateGroup,
        timeSportsLottery: filteredMatches || [],
      };
    })
    .filter(dateGroup => (dateGroup.timeSportsLottery?.length || 0) > 0);
};

export const jumentSamePlayType = (
  playKey: string,
  selectPlayKeys: string[],
) => {
  const playInfo = parseOddsCellKey(playKey);
  let isSamePlayType = false;
  if (selectPlayKeys.length === 0) {
    isSamePlayType = false;
  }

  selectPlayKeys.forEach(key => {
    const selectPlayInfo = parseOddsCellKey(key);
    if (playInfo.playChineseName !== selectPlayInfo.playChineseName) {
      isSamePlayType = true;
      return;
    }
  });
  return isSamePlayType;
};
