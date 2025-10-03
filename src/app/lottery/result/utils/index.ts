export function parseLotteryResult(result: string): LotteryResult.DigitalBalls {
    const [redStr, blueStr] = result.split('|');
    const redBalls = redStr ? redStr.split('#') : [];
    const blueBalls = blueStr ? blueStr.split('#') : [];
    console.log(redBalls, blueBalls);
    return {redBalls, blueBalls};
  }
  