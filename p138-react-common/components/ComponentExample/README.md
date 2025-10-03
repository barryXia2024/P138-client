# 组件示例面板

一个用于展示和查阅项目组件的交互式面板，方便开发者快速了解组件的样式、功能和用法。

## 功能特性

- 🔍 **搜索功能** - 支持按组件名称和描述搜索
- 🏷️ **分类筛选** - 按组件类型进行分类展示
- 👀 **实时预览** - 组件效果实时展示
- 📝 **属性查看** - 查看组件的属性配置
- 💻 **代码示例** - 提供组件的使用代码
- 📱 **响应式设计** - 适配不同屏幕尺寸

## 使用方法

### 基础用法

```tsx
import SimpleComponentExamplePanel from '@/p138-react-common/components/ComponentExample/simple';

// 在页面中使用
<SimpleComponentExamplePanel />
```

### 添加到路由

在您的应用路由中添加组件示例面板：

```tsx
// 在路由配置中添加
<Stack.Screen 
  name="component-example" 
  component={SimpleComponentExamplePanel}
  options={{ title: "组件示例" }}
/>
```

## 界面说明

### 1. 搜索栏
- 支持按组件名称搜索
- 支持按组件描述搜索
- 实时过滤结果

### 2. 分类标签
- **全部** - 显示所有组件
- **导航** - 导航相关组件
- **弹窗** - 弹窗相关组件
- **表单** - 表单相关组件
- **状态** - 状态展示组件

### 3. 组件卡片
每个组件卡片包含：
- 组件名称
- 分类标签
- 组件描述
- 实时预览效果

### 4. 详情弹窗
点击组件卡片可查看：
- 组件详细描述
- 实时预览效果
- 属性配置信息
- 使用代码示例

## 添加新组件

要添加新的组件到示例面板，需要修改 `simple.tsx` 文件中的 `componentExamples` 数组：

```tsx
const componentExamples: ComponentExample[] = [
  // 现有组件...
  {
    id: 'your-component',
    name: 'YourComponent',
    category: '表单', // 选择分类
    description: '你的组件描述',
    component: YourComponent, // 导入的组件
    props: { 
      // 组件的示例属性
      placeholder: '示例属性'
    },
    code: `<YourComponent placeholder="示例属性" />`, // 使用代码示例
  },
];
```

## 组件分类

### 导航类组件
- AppHeader - 应用头部导航
- TabSwitcher - 标签切换器

### 弹窗类组件
- CustomModal - 自定义模态框
- ActionSheet - 操作表

### 表单类组件
- ZTextInput - 文本输入框
- ZInput - 输入框
- CheckBox - 复选框

### 按钮类组件
- Button - 多功能按钮组件
- ButtonExample - 按钮组件完整示例展示

### 状态类组件
- NoData - 无数据状态

## 自定义配置

### 修改分类
在 `categories` 数组中添加或修改分类：

```tsx
const categories = ['全部', '导航', '弹窗', '表单', '状态', '按钮', '布局'];
```

### 修改样式
可以通过修改 `styles` 对象来自定义界面样式：

```tsx
const styles = StyleSheet.create({
  // 自定义样式...
  componentCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // 修改圆角
    // 其他样式...
  },
});
```

## 注意事项

1. **组件导入** - 确保所有组件都正确导入
2. **属性配置** - 为每个组件提供合适的示例属性
3. **代码示例** - 提供准确的使用代码
4. **分类管理** - 合理分类便于查找
5. **性能优化** - 大量组件时考虑虚拟化

## 扩展功能

### 添加更多功能
- 组件使用统计
- 收藏功能
- 组件评分
- 使用示例
- 主题切换

### 集成到开发工具
- 与 Storybook 集成
- 与设计系统集成
- 与文档系统集成

## 技术栈

- React Native
- TypeScript
- StyleSheet
- 项目现有组件库

## 贡献指南

1. 添加新组件时，请确保组件功能完整
2. 提供准确的组件描述和代码示例
3. 选择合适的分类
4. 测试组件在不同设备上的表现 