import { LOTTERY_CONFIGS, SuperLottoTicket, PositionTicket} from './lotteryTypes';

// 大乐透校验
export function validateSuperLotto(ticket: Omit<SuperLottoTicket, 'betId' | 'betAmount' | 'betCount'>): boolean {
  if (ticket.mode === 'normal') {
    if (ticket.red.length < 5) {
      Toast.show('普通：红球至少5个');
      return false;
    }
    if (ticket.blue.length < 2) {
      Toast.show('普通：蓝球至少2个');
      return false;
    }
    return true;
  }
  
  // 胆拖模式
  const redTotal = ticket.redDan.length + ticket.redTuo.length;
  const blueTotal = ticket.blueDan.length + ticket.blueTuo.length;
  
  if (redTotal < 5) {
    Toast.show('胆拖：前区总数至少5个');
    return false;
  }
  if (blueTotal < 2) {
    Toast.show('胆拖：后区总数至少2个');
    return false;
  }
  if (ticket.redDan.length === 0) {
    Toast.show('胆拖：前区胆码至少1个');
    return false;
  }
  if (ticket.blueDan.length === 0) {
    Toast.show('胆拖：后区胆码至少1个');
    return false;
  }
  
  return true;
}

// 位置型彩票校验
export function validatePositions(ticket: Omit<PositionTicket, 'betId' | 'betAmount' | 'betCount'>): boolean {
  const config = LOTTERY_CONFIGS[ticket.lotteryType];
  
  // 检查每个位置是否都有选号
  for (let i = 0; i < config.positions; i++) {
    if (ticket.positions[i].length < config.minSelections[i]) {
      Toast.show(`第${i + 1}位至少选择${config.minSelections[i]}个号码`);
      return false;
    }
  }
  
  return true;
}

// 统一校验入口
export function validateTicket(lotteryType: CoreCommonEnum.LotteryName, ticket: any): boolean {
  switch (lotteryType) {
    case 'SuperLotto':
      return validateSuperLotto(ticket);
    case 'SevenStar':
    case 'ArrangedThree':
    case 'ArrangedFive':
      return validatePositions(ticket);
    default:
      Toast.show('未知彩种类型');
      return false;
    }
}
