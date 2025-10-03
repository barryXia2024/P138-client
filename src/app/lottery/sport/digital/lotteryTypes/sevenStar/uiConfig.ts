export const SevenStarUIConfig = {
  label: '直选',
  labels: Array.from({length: 7}, (_, i) => ({
    label: `第${i + 1}位`,
    color: 'red' as const,
    needZero: false,
    min: 1,
    max: undefined,
    numbers: Array.from({length: i === 6 ? 15 : 10}, (_, n) => n),
  })),
} as const;


