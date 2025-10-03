import { PositionRule, UIUnit } from '../../types';
import { SuperLottoPlayEnum, SuperLottoSubPlayEnum } from '../constants';

// Play + SubPlay 组合的处理器接口
interface PlayHandler {
  // UI 配置
  getUIConfig(): UIUnit;
  getPositionRules(): PositionRule[];
  
  // 业务逻辑
  handleClick(positions: number[][], positionIndex: number, number: number): number[][];
  handleQuickPick(): number[][];
  validate(positions: number[][]): { valid: boolean; message?: string };
  calculateBetCount(positions: number[][]): number;
}

// 普通玩法处理器
class NormalHandler implements PlayHandler {
  getUIConfig(): UIUnit {
    return {
      label: '普通选号',
      labels: [
        {
          label: '前区',
          color: 'red',
          needZero: true,
          min: 5,
          max: 5,
          numbers: Array.from({length: 35}, (_, n) => n + 1),
        },
        {
          label: '后区',
          color: 'blue',
          needZero: true,
          min: 2,
          max: 2,
          numbers: Array.from({length: 12}, (_, n) => n + 1),
        },
      ],
      positionRules: this.getPositionRules(),
    };
  }

  getPositionRules(): PositionRule[] {
    return [
      {index: 0, minCount: 5, maxCount: 5, numberRange: 35},
      {index: 1, minCount: 2, maxCount: 2, numberRange: 12},
    ];
  }

  handleClick(positions: number[][], positionIndex: number, number: number): number[][] {
    const newPositions = [...positions];
    const currentSelection = newPositions[positionIndex] || [];
    
    if (currentSelection.includes(number)) {
      // 取消选择
      newPositions[positionIndex] = currentSelection.filter(n => n !== number);
    } else {
      // 添加选择
      const rules = this.getPositionRules();
      const rule = rules[positionIndex];
      
      if (currentSelection.length >= rule.maxCount) {
        throw new Error(`${positionIndex === 0 ? '前区' : '后区'}最多选择${rule.maxCount}个号码`);
      }
      
      newPositions[positionIndex] = [...currentSelection, number].sort((a, b) => a - b);
    }
    
    return newPositions;
  }

  handleQuickPick(): number[][] {
    const frontNumbers = this.pickRandomNumbers(5, 35);
    const backNumbers = this.pickRandomNumbers(2, 12);
    return [frontNumbers, backNumbers];
  }

  validate(positions: number[][]): { valid: boolean; message?: string } {
    if (!positions[0] || positions[0].length !== 5) {
      return { valid: false, message: '前区需要选择5个号码' };
    }
    if (!positions[1] || positions[1].length !== 2) {
      return { valid: false, message: '后区需要选择2个号码' };
    }
    return { valid: true };
  }

  calculateBetCount(positions: number[][]): number {
    const validation = this.validate(positions);
    return validation.valid ? 1 : 0;
  }

  private pickRandomNumbers(count: number, range: number): number[] {
    const numbers = Array.from({length: range}, (_, i) => i + 1);
    const result: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result.push(numbers.splice(randomIndex, 1)[0]);
    }
    
    return result.sort((a, b) => a - b);
  }
}

// 胆拖玩法处理器
class DantuoHandler implements PlayHandler {
  getUIConfig(): UIUnit {
    return {
      label: '胆拖选号',
      labels: [
        {
          label: '前区胆码',
          color: 'red',
          needZero: false,
          min: 1,
          max: 4,
          numbers: Array.from({length: 35}, (_, n) => n + 1),
        },
        {
          label: '前区拖码',
          color: 'red',
          needZero: false,
          min: 1,
          max: 28,
          numbers: Array.from({length: 35}, (_, n) => n + 1),
        },
        {
          label: '后区胆码',
          color: 'blue',
          needZero: false,
          min: 0,
          max: 1,
          numbers: Array.from({length: 12}, (_, n) => n + 1),
        },
        {
          label: '后区拖码',
          color: 'blue',
          needZero: false,
          min: 1,
          max: 12,
          numbers: Array.from({length: 12}, (_, n) => n + 1),
        },
      ],
      positionRules: this.getPositionRules(),
    };
  }

  getPositionRules(): PositionRule[] {
    return [
      {index: 0, minCount: 1, maxCount: 4, numberRange: 35},   // 前区胆码
      {index: 1, minCount: 1, maxCount: 28, numberRange: 35},  // 前区拖码
      {index: 2, minCount: 0, maxCount: 1, numberRange: 12},   // 后区胆码
      {index: 3, minCount: 1, maxCount: 12, numberRange: 12},  // 后区拖码
    ];
  }

  handleClick(positions: number[][], positionIndex: number, number: number): number[][] {
    const newPositions = [...positions];
    const currentSelection = newPositions[positionIndex] || [];
    
    if (currentSelection.includes(number)) {
      // 取消选择
      newPositions[positionIndex] = currentSelection.filter(n => n !== number);
    } else {
      // 添加选择
      const rules = this.getPositionRules();
      const rule = rules[positionIndex];
      
      if (currentSelection.length >= rule.maxCount) {
        const labels = ['前区胆码', '前区拖码', '后区胆码', '后区拖码'];
        throw new Error(`${labels[positionIndex]}最多选择${rule.maxCount}个号码`);
      }
      
      // 检查胆码和拖码不能重复
      if (positionIndex < 2) { // 前区
        const otherIndex = positionIndex === 0 ? 1 : 0;
        const otherSelection = newPositions[otherIndex] || [];
        if (otherSelection.includes(number)) {
          throw new Error('前区胆码和拖码不能重复');
        }
      } else { // 后区
        const otherIndex = positionIndex === 2 ? 3 : 2;
        const otherSelection = newPositions[otherIndex] || [];
        if (otherSelection.includes(number)) {
          throw new Error('后区胆码和拖码不能重复');
        }
      }
      
      newPositions[positionIndex] = [...currentSelection, number].sort((a, b) => a - b);
    }
    
    return newPositions;
  }

  handleQuickPick(): number[][] {
    // 简单的胆拖机选逻辑
    const frontDan = this.pickRandomNumbers(2, 35);
    const remainingFront = Array.from({length: 35}, (_, i) => i + 1)
      .filter(n => !frontDan.includes(n));
    const frontTuo = this.pickRandomNumbers(5, remainingFront.length)
      .map(i => remainingFront[i - 1]).sort((a, b) => a - b);
    
    const backDan: number[] = [];
    const backTuo = this.pickRandomNumbers(3, 12);
    
    return [frontDan, frontTuo, backDan, backTuo];
  }

  validate(positions: number[][]): { valid: boolean; message?: string } {
    const [frontDan, frontTuo, backDan, backTuo] = positions;
    
    if (!frontDan?.length) {
      return { valid: false, message: '前区胆码至少选择1个' };
    }
    if (!frontTuo?.length) {
      return { valid: false, message: '前区拖码至少选择1个' };
    }
    if (!backTuo?.length) {
      return { valid: false, message: '后区拖码至少选择1个' };
    }
    
    const frontTotal = frontDan.length + frontTuo.length;
    const backTotal = (backDan?.length || 0) + backTuo.length;
    
    if (frontTotal < 5) {
      return { valid: false, message: '前区胆码+拖码总数至少5个' };
    }
    if (backTotal < 2) {
      return { valid: false, message: '后区胆码+拖码总数至少2个' };
    }
    
    return { valid: true };
  }

  calculateBetCount(positions: number[][]): number {
    const validation = this.validate(positions);
    if (!validation.valid) return 0;
    
    const [frontDan, frontTuo, backDan, backTuo] = positions;
    const frontNeed = 5 - frontDan.length;
    const backNeed = 2 - (backDan?.length || 0);
    
    const frontCombinations = this.combination(frontTuo.length, frontNeed);
    const backCombinations = this.combination(backTuo.length, backNeed);
    
    return frontCombinations * backCombinations;
  }

  private pickRandomNumbers(count: number, range: number): number[] {
    const numbers = Array.from({length: range}, (_, i) => i + 1);
    const result: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result.push(numbers.splice(randomIndex, 1)[0]);
    }
    
    return result.sort((a, b) => a - b);
  }

  private combination(n: number, k: number): number {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    
    return Math.round(result);
  }
}

// 大乐透工厂 - 处理 Play + SubPlay 组合
export class SuperLottoFactory {
  private handlers: Map<string, PlayHandler> = new Map();

  constructor() {
    // 注册处理器
    this.handlers.set(this.getKey(SuperLottoPlayEnum.NORMAL, SuperLottoSubPlayEnum.DEFAULT), new NormalHandler());
    this.handlers.set(this.getKey(SuperLottoPlayEnum.DANTUO, SuperLottoSubPlayEnum.DEFAULT), new DantuoHandler());
  }

  // 获取处理器
  getHandler(play: SuperLottoPlayEnum, subPlay: SuperLottoSubPlayEnum): PlayHandler {
    const key = this.getKey(play, subPlay);
    const handler = this.handlers.get(key);
    
    if (!handler) {
      throw new Error(`Unsupported play combination: ${play} + ${subPlay}`);
    }
    
    return handler;
  }

  // 获取支持的玩法列表
  getSupportedPlays(): { play: SuperLottoPlayEnum; subPlay: SuperLottoSubPlayEnum; name: string }[] {
    return [
      { play: SuperLottoPlayEnum.NORMAL, subPlay: SuperLottoSubPlayEnum.DEFAULT, name: '普通选号' },
      { play: SuperLottoPlayEnum.DANTUO, subPlay: SuperLottoSubPlayEnum.DEFAULT, name: '胆拖选号' },
    ];
  }

  private getKey(play: SuperLottoPlayEnum, subPlay: SuperLottoSubPlayEnum): string {
    return `${play}-${subPlay}`;
  }
}

// 单例工厂
export const superLottoFactory = new SuperLottoFactory();
