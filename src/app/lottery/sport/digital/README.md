# 数字彩票模块架构说明

## 🏗️ 重构后的架构

### 📁 目录结构
```
digital/
├── 📂 core/                    # 核心业务逻辑
│   ├── lotteryTypes.ts         # 彩种类型定义（更直观）
│   ├── lotteryRules.ts         # 彩种规则校验（更明确）
│   └── lotteryConfigs.ts       # 彩种配置常量（更清晰）
├── 📂 lotteryTypes/            # 彩种实现（更明确）
│   ├── superLotto/             # 大乐透
│   │   ├── superLottoStore.ts  # 大乐透状态管理（更明确）
│   │   └── betCalculator.ts    # 投注计算器（更明确）
│   ├── sevenStar/              # 七星彩
│   │   └── sevenStarStore.ts   # 七星彩状态管理（更明确）
│   ├── arrangedThree/          # 排列三
│   │   └── arrangedThreeStore.ts # 排列三状态管理（更明确）
│   └── arrangedFive/           # 排列五
│       └── arrangedFiveStore.ts # 排列五状态管理（更明确）
├── 📂 shared/                  # 共享资源
│   ├── uiComponents/           # UI组件（更明确）
│   ├── businessHooks/          # 业务逻辑hooks（更明确）
│   └── utilityFunctions/       # 工具函数（更明确）
├── 📂 betSlip/                 # 投注单（更直观）
│   ├── slipState.ts            # 投注单状态（更明确）
│   ├── ticketFactory.ts        # 票据工厂（更直观）
│   ├── ticketRenderers/        # 票据渲染器（更明确）
│   └── slipPage.tsx            # 投注单页面（更明确）
├── 📂 lotteryPages/            # 彩种页面（更明确）
└── 📂 index.tsx                # 主入口（根据lotteryInfo.lotteryName显示对应彩种）
```

## 🎯 架构特点

### 1. **解耦设计**
- **类型统一化**：`DigitalTicket` 联合类型，支持所有彩种
- **校验分离**：`lotteryRules.ts` 独立校验逻辑，不耦合UI
- **计算器独立**：每个彩种的计算逻辑独立，便于测试和维护

### 2. **可扩展性**
- **Store工厂**：`positionStoreFactory` 生成位置型彩票的通用store
- **渲染器注册**：`rendererRegistry` 动态选择票据渲染组件
- **票据构建器**：`ticketFactory` 统一构建票据的接口

### 3. **代码复用**
- **共享组件**：`BaseNumberGrid`、`CommonBetFooter` 等通用UI组件
- **通用逻辑**：位置型彩票的通用store和计算逻辑
- **类型安全**：TypeScript类型系统保证数据结构一致性

## 🔧 使用方法

### 添加新彩种
1. 在 `lotteryTypes/` 下创建新彩种目录
2. 实现 `gameState.ts` 和 `betCalculator.ts`
3. 在 `core/lotteryTypes.ts` 中添加彩种类型
4. 在 `core/lotteryConfigs.ts` 中添加彩种配置
5. 在 `betSlip/ticketFactory.ts` 中添加票据构建器
6. 在 `betSlip/ticketRenderers/` 中添加渲染器

### 票据构建流程
```typescript
// 1. 从彩种store获取选号状态
const store = useSuperLottoStore.getState();
const ticket = await store.buildTicket();

// 2. 添加到投注单
const betlistStore = useBetlistStore.getState();
betlistStore.addTicket(ticket);
```

### 票据渲染
```typescript
// 根据彩种类型自动选择渲染器
const Renderer = getRenderer(ticket.lotteryType);
return <Renderer ticket={ticket} onRemove={handleRemove} />;
```

## 🚀 优势

- **可维护性**：每个模块职责单一，修改影响范围小
- **可测试性**：业务逻辑与UI分离，便于单元测试
- **可扩展性**：新增彩种只需在 `lotteryTypes/` 下添加目录
- **类型安全**：完整的TypeScript类型定义
- **代码复用**：避免重复代码，提高开发效率

## 📝 注意事项

1. 所有彩种必须实现统一的 `DigitalTicket` 接口
2. 校验逻辑必须放在 `core/lotteryRules.ts` 中
3. 计算逻辑必须放在对应彩种的 `betCalculator.ts` 中
4. 新增组件优先考虑放在 `shared/uiComponents/` 中
5. 保持目录结构清晰，命名规范统一

## 🏷️ 命名规范

### 文件命名原则
- **见名思意**：文件名要能清楚表达其功能
- **层次分明**：目录结构要体现业务层次关系
- **一致性**：相似功能的文件使用相似的命名模式

### 命名示例
- `superLottoStore.ts` - 大乐透状态管理（更明确）
- `sevenStarStore.ts` - 七星彩状态管理（更明确）
- `arrangedThreeStore.ts` - 排列三状态管理（更明确）
- `arrangedFiveStore.ts` - 排列五状态管理（更明确）
- `betCalculator.ts` - 投注计算器
- `ticketFactory.ts` - 票据工厂
- `slipState.ts` - 投注单状态
- `lotteryTypes.ts` - 彩种类型定义
- `lotteryRules.ts` - 彩种规则校验

## 🔄 业务流程

### 入口逻辑
```typescript
// 根据外部传入的lotteryInfo.lotteryName直接显示对应彩种页面
export default function DigitalLotteryPage() {
  const lotteryInfo = useLotteryInfoStore(state => state.lotteryInfo);

  if (lotteryInfo?.lotteryName === LotteryName.SuperLotto) {
    return <SuperLottoPage />;
  } else if (lotteryInfo?.lotteryName === LotteryName.SevenStar) {
    return <SevenStarPage />;
  }
  // ... 其他彩种
}
```

### 彩种页面结构
每个彩种页面包含：
- **选号区域**：根据彩种规则显示选号界面
- **玩法切换**：如大乐透的普通/胆拖模式
- **投注控制**：机选、清空、添加到投注单等
- **投注信息**：显示注数、金额等
