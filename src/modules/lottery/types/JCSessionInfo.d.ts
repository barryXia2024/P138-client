declare namespace JCSessionInfo {
  /** 单个投注项（如胜/平/负/让胜等） */
  interface JCBetItem {
    betItem: string; // 投注项，如 "胜", "平", "负", "让胜"
    betOdds: number; // 投注赔率
    betHandicap: string; // 让球数（如 "+1", "0"）
    betPlay: string; // 投注玩法（如 "胜平负", "让球胜平负"）
  }
  /** 单场比赛投注信息 */
  interface JCBetSession {
    competitionSessions: string; // 比赛编号，如 "周三001"
    home: string; // 主队
    away: string; // 客队
    competitionId: number; // 比赛 ID
    betItems: JCBetItem[]; // 投注项
  }

  /** 一张竞彩足球投注单（比如 4 串 1） */
  interface JCBetOrder {
    sessions: JCBetSession[]; // 所有投注场次
    type: number; // 投注类型（暂不明用途，可定义为串关类型编号）
    betFreePass: string; // 串关方式（如 "4串1"）
  }
}
