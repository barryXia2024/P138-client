declare namespace LotteryResult {
  interface CollapsedMatchGroup {
    title: string;
    totalMatches: number;
  }

  interface TabList {
    label: string;
    key: keyof LotteryDrawAnnouncement.SportsMatch;
    rq?: keyof LotteryDrawAnnouncement.SportsMatch;
  }

  interface DigitalBalls {
    redBalls: string[];
    blueBalls: string[];
  }
}
