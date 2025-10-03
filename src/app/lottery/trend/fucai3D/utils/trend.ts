export const processTrendData = (trendInfos: CoreLotteryTrend.TrendInfo[]) => {
	if (!trendInfos || !Array.isArray(trendInfos)) return [] as { period: string; numbers: CoreLotteryTrend.TrendNumber[] }[];

	return trendInfos.map(trend => {
		const {issue, numbers} = trend;
		return {
			period: issue,
			numbers: numbers,
		};
	});
};

export const splitStats = (countString: string): string[] => {
	return (countString || '').split('#');
};

// 在指定索引后插入若干空列（默认在第10列后插入2个空位），用于大小/和值等玩法的统计展示
export const splitStatsWithInsert = (
	countString: string,
	insertAfterIndex: number = 9,
	insertCount: number = 2,
): string[] => {
	const arr = splitStats(countString);
	arr.splice(insertAfterIndex + 1, 0, ...Array(insertCount).fill(''));
	return arr;
};

export const isBlueIndex = (index: number, redCount: number = 35): boolean => index >= redCount;


