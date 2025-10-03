export function parseBetItem(betItem: string) {
  const safe = betItem ?? '';
  const parts = safe.includes('#')
    ? safe.split('#')
    : safe.split('|').length === 2
    ? safe.split('|')
    : [safe, ''];
  const splitNums = (s: string) =>
    (s || '')
      .split(/[|,]/)
      .filter(Boolean)
      .map(n => n.trim());
  const front = splitNums(parts[0] || '');
  const back = splitNums(parts[1] || '');
  return {front, back};
}

export function formatBetItemByPositions(positions: number[][], hasBackDanTuo = false) {
  if (!hasBackDanTuo) {
    return `${(positions[0] || []).join(',')}#${(positions[1] || []).join(',')}`;
  }
  const front = `${(positions[0] || []).join(',')}|${(positions[1] || []).join(',')}`;
  const back = `${(positions[2] || []).join(',')}|${(positions[3] || []).join(',')}`;
  return `${front}#${back}`;
}


