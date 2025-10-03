# OSSImage 组件

`OSSImage` 是一个增强的图片组件，支持从 OSS 加载图片，并提供了完善的错误处理机制。

## 功能特性

- ✅ 支持从 OSS 加载图片
- ✅ 支持 HTTP/HTTPS 图片
- ✅ 支持本地静态资源
- ✅ 支持 data:image 格式
- ✅ 加载失败时显示自定义错误图片
- ✅ 加载状态显示
- ✅ 完善的错误处理

## 基本用法

```tsx
import OSSImage from '@/p138-react-common/components/Upload/OSSImage';

// 基本用法
<OSSImage
  source={{uri: 'https://example.com/image.jpg'}}
  style={{width: 200, height: 150}}
/>
```

## 属性说明

### OSSImageProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | - | 自定义样式类名 |
| `needAuth` | `boolean` | `false` | 是否需要认证 |
| `fallbackImage` | `string` | - | 加载失败时显示的图片 |

### 继承的属性

`OSSImage` 继承了 React Native `Image` 组件的所有属性，包括：

- `source`: 图片源
- `style`: 样式
- `onLoad`: 加载成功回调
- `onError`: 加载失败回调
- `resizeMode`: 缩放模式
- 等等...

## 使用示例

### 1. 基本用法

```tsx
<OSSImage
  source={{uri: 'https://example.com/image.jpg'}}
  style={{width: 200, height: 150}}
  className="rounded-lg"
/>
```

### 2. 使用自定义错误图片

```tsx
<OSSImage
  source={{uri: 'https://invalid-url.jpg'}}
  fallbackImage="https://example.com/error-image.jpg"
  style={{width: 200, height: 150}}
/>
```

### 3. 使用本地错误图片

```tsx
<OSSImage
  source={{uri: 'https://invalid-url.jpg'}}
  fallbackImage={require('@/assets/imgs/avatar-default.png')}
  style={{width: 200, height: 150}}
/>
```

### 4. 从 OSS 加载图片

```tsx
<OSSImage
  source={{uri: 'oss-image-name.jpg'}}
  style={{width: 200, height: 150}}
/>
```

### 5. 监听加载事件

```tsx
<OSSImage
  source={{uri: 'https://example.com/image.jpg'}}
  onLoad={() => console.log('图片加载成功')}
  onError={(error) => console.log('图片加载失败:', error)}
  style={{width: 200, height: 150}}
/>
```

## 错误处理机制

1. **网络图片加载失败**：触发 `onError` 回调，显示 `fallbackImage` 或默认图片
2. **OSS 图片加载失败**：在 `getImage` 函数中捕获错误，显示 `fallbackImage` 或默认图片
3. **本地图片加载失败**：触发 `onError` 回调，显示 `fallbackImage` 或默认图片

## 加载状态

组件在加载过程中会显示一个 `Spinner` 组件，加载完成后显示实际图片。

## 注意事项

1. `fallbackImage` 可以是网络 URL 或本地资源
2. 如果不设置 `fallbackImage`，会使用 `DEFAULT_IMAGE` 作为默认错误图片
3. 组件会自动处理不同类型的图片源（OSS、HTTP、本地资源等）
4. 支持所有 React Native `Image` 组件的属性

## 最佳实践

1. **总是设置 fallbackImage**：为用户提供更好的体验
2. **使用合适的图片尺寸**：避免加载过大的图片
3. **监听加载事件**：在需要时处理加载成功或失败的情况
4. **使用 className**：利用 Tailwind CSS 进行样式管理 