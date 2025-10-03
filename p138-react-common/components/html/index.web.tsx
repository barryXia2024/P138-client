import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {getImageFromOss} from '../../utils/upload/rn-upload';
import CustomModal from '../CustomModal';
import OSSImage from '../Upload/OSSImage';
import {kScreenHeight, kScreenWidth} from '../../utils/fuc/fc.rn';

interface HtmlProps {
  html: {
    adTitle: string;
    adContent: string;
    imageUrl: string;
  };
  imageUrl?: string;
  htmlStyles?: string;
  onHeightChange?: (height: number) => void;
}

export default function Html({
  html,
  imageUrl,
  htmlStyles,
  onHeightChange,
}: HtmlProps) {
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(300); // 默认初始高度
  const [imageBase64, setImageBase64] = useState<string>('');

  useEffect(() => {
    const fetch = async () => {
      const targetUrl = imageUrl || html.imageUrl;
      if (targetUrl) {
        const base64 = await getImageFromOss(targetUrl);
        setImageBase64(base64);
      }
    };
    fetch();
  }, [imageUrl, html.imageUrl]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'height') {
        const newHeight = Math.min(event.data.height + 30, 10000); // 限高
        setIframeHeight(newHeight);
        onHeightChange?.(newHeight);
      } else if (event.data?.type === 'preview') {
        setIsPreviewModalVisible(true);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const defaultHtmlStyles = `<style>
    body {
      margin: 0;
      padding: 10px;
      box-sizing: border-box;
      line-height: 1.5;
      font-size: 16px;
      color: #333;
    }
    p {
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    img {
      width: 100%;
      height: auto;
      margin-top: 10px;
      cursor: pointer;
    }
    .content {
      word-break: break-word;
    }
  </style>`;

  const srcDocContent = `
    ${htmlStyles || defaultHtmlStyles}
    <p class="title">${html.adTitle}</p>
    <div class="content">${html.adContent}</div>
    ${
      imageBase64
        ? `<img onclick="window.parent.postMessage({ type: 'preview' }, '*')" src="${imageBase64}" />`
        : ''
    }
    <script>
      function postHeight() {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'height', height }, '*');
      }

      // 自动监测内容变化
      new ResizeObserver(postHeight).observe(document.body);

      // 初始加载
      window.addEventListener('load', postHeight);

      // fallback
      setTimeout(postHeight, 1000);
    </script>
  `;

  return (
    <View style={{width: '100%', height: iframeHeight}}>
      <iframe
        srcDoc={srcDocContent}
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin"
      />
      <CustomModal
        isVisible={isPreviewModalVisible}
        onClose={() => setIsPreviewModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{width: kScreenWidth, height: kScreenHeight}}
          onPress={() => setIsPreviewModalVisible(false)}>
          <OSSImage
            source={{uri: imageBase64}}
            style={{width: '100%', height: kScreenHeight}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </CustomModal>
    </View>
  );
}
