
import { bonusCalculatorNew } from "src/api/interface/orders-bet";
import { parseOddsCellKey } from "./lottery";





export async function calculatePrize(
    selectedPassTypes: string,
    selectedMatches: Record<string, string[]>,
    matchData: Record<string, LotteryDataSource.MatchInfo>,
    typeInfo: ServerCoreLottery.ListCustomLotteryResult

  ):Promise<ServerCoreOrder.BonusCalculatorV2Result|undefined>{
    const betSession:JCSessionInfo.JCBetSession[] = Object.keys(selectedMatches).map((matchId) => {
       const sessions = matchData[matchId];
       
       console.log(sessions);
     

       return {
        competitionSessions:sessions.matchNum,
        home:sessions.home,
        away:sessions.away,
        competitionId:sessions.competitionId,
        betItems:selectedMatches[matchId].map((oddsCellKey)=>{
            const odds = parseOddsCellKey(oddsCellKey);
            const betItem = typeInfo.lotteryName==='BasketballLottery'?odds.betItem.replace('-','~'):odds.betItem;
            return {
                betItem,
                betOdds:Number(odds.odds),
                betHandicap:odds.hanicap==='null'?'0':odds.hanicap,
                betPlay:odds.playChineseName
            }
        })
       }
    })
 


 const res = await  bonusCalculatorNew({
      lotteryName: typeInfo?.lotteryName,
      sessions: betSession,
      betAmount:1,
      bettingString: selectedPassTypes,
    })
   return  res?.data;
  }