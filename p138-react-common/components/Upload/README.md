# OSS 媒体组件使用说明

## 组件介绍

本项目提供了三个用于处理 OSS 媒体文件的组件：

### 1. OSSImage - 图片组件
专门用于显示图片，支持从 OSS 下载图片并转换为 base64 显示。

### 2. OSSVideo - 视频组件  
专门用于播放视频，支持从 OSS 下载视频并播放。

### 3. OSSMedia - 智能媒体组件
自动检测文件类型，选择合适的组件来渲染图片或视频。

## 使用方法

### 导入组件

```typescript
// 导入单个组件
import { OSSImage, OSSVideo, OSSMedia } from 'p138-react-common/components/Upload/web';

// 或者分别导入
import OSSImage from 'p138-react-common/components/Upload/OssImageWeb';
import OSSVideo from 'p138-react-common/components/Upload/OssVideoWeb';
import OSSMedia from 'p138-react-common/components/Upload/OssMediaWeb';
```

### 基本使用

```tsx
// 显示图片
<OSSImage 
  src="image.jpg" 
  className="w-64 h-48"
  onError={() => console.log('图片加载失败')}
/>

// 播放视频
<OSSVideo 
  src="video.mp4" 
  controls={true}
  autoPlay={false}
  className="w-full h-64"
  onError={() => console.log('视频加载失败')}
  onLoad={() => console.log('视频加载成功')}
/>

// 视频预览模式
<OSSVideo 
  src="video.mp4" 
  preview={true}
  className="w-32 h-24"
  previewWidth={800}
  previewHeight={600}
/>

// 智能媒体组件（推荐）
<OSSMedia 
  src="media.mp4" 
  className="w-full h-64"
  videoProps={{
    controls: true,
    autoPlay: false,
    muted: true
  }}
  onError={() => console.log('媒体加载失败')}
  onLoad={() => console.log('媒体加载成功')}
/>

// 智能媒体组件 - 预览模式
<OSSMedia 
  src="media.mp4" 
  className="w-32 h-24"
  videoProps={{
    preview: true,
    previewWidth: 800,
    previewHeight: 600
  }}
/>
```

### 支持的源类型

1. **OSS 文件名**：直接传入文件名，组件会自动从 OSS 下载
2. **完整 URL**：以 `http://` 或 `https://` 开头的 URL
3. **Base64**：以 `data:image/` 或 `data:video/` 开头的 base64 数据
4. **对象格式**：`{ uri: 'filename.jpg' }`

### 视频组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| controls | boolean | true | 是否显示播放控件 |
| autoPlay | boolean | false | 是否自动播放 |
| muted | boolean | false | 是否静音 |
| loop | boolean | false | 是否循环播放 |
| poster | string | - | 视频封面图片 |
| width | number \| string | - | 视频宽度 |
| height | number \| string | - | 视频高度 |
| preview | boolean | false | 是否启用预览模式 |
| previewWidth | number \| string | 800 | 预览弹窗宽度 |
| previewHeight | number \| string | 600 | 预览弹窗高度 |

### 智能媒体组件属性

| 属性 | 类型 | 说明 |
|------|------|------|
| imageProps | object | 传递给图片组件的属性 |
| videoProps | object | 传递给视频组件的属性 |

## 文件类型检测

### 支持的图片格式
- jpg, jpeg, png, gif, bmp, webp, svg

### 支持的视频格式  
- mp4, avi, mov, wmv, flv, webm, mkv

### 检测逻辑
1. 首先检查 URL 前缀（http、data:image、data:video）
2. 然后检查文件扩展名
3. 最后根据扩展名判断媒体类型

## 注意事项

1. **OSS 下载**：组件使用 `getImageFromOss` 函数从 OSS 下载文件，确保该函数支持视频文件
2. **浏览器兼容性**：视频播放依赖浏览器的 `<video>` 标签支持
3. **性能考虑**：大文件下载可能需要时间，组件会显示加载状态
4. **错误处理**：建议提供 `onError` 回调来处理加载失败的情况

## 示例代码

```tsx
import React, { useState } from 'react';
import { OSSMedia } from 'p138-react-common/components/Upload/web';

const MediaGallery: React.FC = () => {
  const [mediaList] = useState([
    'image1.jpg',
    'video1.mp4', 
    'image2.png',
    'video2.avi'
  ]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {mediaList.map((src, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <OSSMedia
            src={src}
            className="w-full h-48"
            videoProps={{
              controls: true,
              muted: true
            }}
            onError={() => console.log(`${src} 加载失败`)}
            onLoad={() => console.log(`${src} 加载成功`)}
          />
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;
``` 