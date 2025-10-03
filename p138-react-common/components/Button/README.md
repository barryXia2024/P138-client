# Button 组件

一个功能丰富的按钮组件，参考 Ant Design 的 Button 组件设计，支持多种类型、尺寸、状态和样式。

## 功能特性

- ✅ 多种按钮类型：primary、default、dashed、link、text
- ✅ 多种尺寸：large、middle、small
- ✅ 多种形状：default、round、circle
- ✅ 状态支持：disabled、loading、ghost、danger、block
- ✅ 图标支持：左侧/右侧图标
- ✅ 自定义样式：支持 style 和 textStyle
- ✅ 事件支持：onPress、onLongPress、onPressIn、onPressOut

## 基础用法

```tsx
import Button from './Button';

// 基础按钮
<Button title="点击我" onPress={() => console.log('点击')} />

// 主要按钮
<Button title="主要按钮" type="primary" onPress={() => console.log('主要按钮')} />

// 虚线按钮
<Button title="虚线按钮" type="dashed" onPress={() => console.log('虚线按钮')} />
```

## API

### ButtonProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 按钮文字 | string | - |
| children | 按钮内容（与 title 二选一） | ReactNode | - |
| type | 按钮类型 | 'primary' \| 'default' \| 'dashed' \| 'link' \| 'text' | 'default' |
| size | 按钮尺寸 | 'large' \| 'middle' \| 'small' | 'middle' |
| shape | 按钮形状 | 'default' \| 'round' \| 'circle' | 'default' |
| disabled | 是否禁用 | boolean | false |
| loading | 是否加载中 | boolean | false |
| ghost | 是否幽灵模式 | boolean | false |
| danger | 是否危险按钮 | boolean | false |
| block | 是否块级按钮 | boolean | false |
| icon | 图标 | ReactNode | - |
| iconPosition | 图标位置 | 'left' \| 'right' | 'left' |
| style | 按钮样式 | StyleProp<ViewStyle> | - |
| textStyle | 文字样式 | StyleProp<TextStyle> | - |
| className | 类名 | string | - |
| activeOpacity | 点击透明度 | number | 0.6 |
| onPress | 点击事件 | () => void | - |
| onClick | 点击事件（兼容） | () => void | - |
| onLongPress | 长按事件 | () => void | - |
| onPressIn | 按下事件 | () => void | - |
| onPressOut | 抬起事件 | () => void | - |

## 按钮类型

### 基础按钮
```tsx
<Button title="默认按钮" />
<Button title="主要按钮" type="primary" />
<Button title="虚线按钮" type="dashed" />
<Button title="链接按钮" type="link" />
<Button title="文本按钮" type="text" />
```

### 按钮尺寸
```tsx
<Button title="小按钮" size="small" />
<Button title="中按钮" size="middle" />
<Button title="大按钮" size="large" />
```

### 按钮形状
```tsx
<Button title="默认形状" shape="default" />
<Button title="圆角形状" shape="round" />
<Button title="圆形按钮" shape="circle" />
```

### 按钮状态
```tsx
<Button title="禁用按钮" disabled />
<Button title="加载中" loading />
<Button title="危险按钮" danger />
<Button title="幽灵按钮" ghost />
<Button title="块级按钮" block />
```

### 带图标的按钮
```tsx
<Button 
  title="左侧图标" 
  icon={<Text>🔍</Text>}
  iconPosition="left"
/>
<Button 
  title="右侧图标" 
  icon={<Text>→</Text>}
  iconPosition="right"
/>
```

### 自定义样式
```tsx
<Button 
  title="自定义样式" 
  style={{ backgroundColor: '#ff6b6b' }}
  textStyle={{ color: '#fff', fontWeight: 'bold' }}
/>
```

## 样式说明

### 颜色规范
- **Primary**: #1890ff (蓝色)
- **Default**: #fff (白色背景) + rgba(0, 0, 0, 0.85) (文字)
- **Danger**: #ff4d4f (红色)
- **Ghost**: 透明背景 + 边框颜色

### 尺寸规范
- **Large**: 40px 高度，16px 字体
- **Middle**: 32px 高度，14px 字体  
- **Small**: 24px 高度，12px 字体

### 圆角规范
- **Default**: 6px
- **Round**: 16px
- **Circle**: 50% (圆形)

## 注意事项

1. `title` 和 `children` 属性二选一使用
2. `onClick` 和 `onPress` 属性功能相同，`onClick` 为兼容性保留
3. 加载状态下按钮会自动禁用
4. 幽灵模式会改变背景色为透明
5. 危险模式会覆盖其他颜色设置
6. 块级按钮会占满容器宽度

## 示例

完整的使用示例请参考 `example.tsx` 文件。 