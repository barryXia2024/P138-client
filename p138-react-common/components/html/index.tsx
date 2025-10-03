import React, {useEffect, useState} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import WebView from 'react-native-webview';
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
  style?: StyleProp<ViewStyle>;
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
  if (!html) return null;
  console.log('html', html);
  const [imageBase64, setImageBase64] = useState<string>('');
  const getImageBase64 = async () => {
    if (imageUrl) {
      const image = await getImageFromOss(imageUrl);
      console.log('image', image);
      setImageBase64(image);
    }
    if (html.imageUrl) {
      const image = await getImageFromOss(html.imageUrl);
      console.log('image', image);
      setImageBase64(image);
    }
  };
  useEffect(() => {
    getImageBase64();
  }, [imageUrl, html.imageUrl]);

  const defaultHtmlStyles = `<style>
          body {
            margin: 0;
            padding: 10px;
            box-sizing: border-box;
            max-width: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            line-height: 1.5;
            font-size: 18px;
          }
            img {
            width: 100%;
      
            resizeMode: contain;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
          }
            .title {
              font-size: 30px;
        
    
              margin-bottom: 10px;
            }
            p {
              margin: 0 0 8px 0;
              font-size: 20px;
            }
        </style>
      `;

  return (
    <View style={{width: '100%', height: '100%'}}>
      <WebView
        textZoom={200}
        scrollEnabled={true}
        onMessage={event => {
          console.log('收到消息:', event.nativeEvent.data);
          if (event.nativeEvent.data === 'imageClicked') {
            console.log('准备打开预览弹窗');
            setIsPreviewModalVisible(true);
          } else if (event.nativeEvent.data.startsWith('height:')) {
            const height = parseInt(event.nativeEvent.data.split(':')[1]);
            console.log('HTML 内容高度:', height);
            onHeightChange?.(height);
          }
        }}
        injectedJavaScript={`
            console.log('注入的 JavaScript 已执行');
            
            // 简单的高度计算函数
            function getContentHeight() {
              const body = document.body;
              const textContent = body.textContent || '';
              const lines = textContent.split('\\n').filter(line => line.trim().length > 0);
              
              // 基础高度 + 文本行数 * 行高
              const baseHeight = 40;
              const lineHeight = 20;
              const contentHeight = baseHeight + (lines.length * lineHeight);
              
              console.log('文本行数:', lines.length, '计算高度:', contentHeight);
              return contentHeight;
            }
            
            let lastHeight = 0;
            
            // 检查高度变化
            function checkHeightChange() {
              const currentHeight = getContentHeight();
              if (currentHeight !== lastHeight) {
                console.log('高度变化:', lastHeight, '->', currentHeight);
                lastHeight = currentHeight;
                window.ReactNativeWebView.postMessage('height:' + currentHeight);
              }
            }
            
            // 监听内容变化
            const observer = new MutationObserver(() => {
              setTimeout(checkHeightChange, 50);
            });
            
            observer.observe(document.body, {
              childList: true,
              subtree: true,
              characterData: true
            });
            
            // 初始计算
            setTimeout(() => {
              const height = getContentHeight();
              lastHeight = height;
              window.ReactNativeWebView.postMessage('height:' + height);
            }, 100);
            
            document.addEventListener('click', function(e) {
              console.log('点击事件触发');
              if (e.target.tagName === 'IMG') {
                console.log('图片被点击');
                window.ReactNativeWebView.postMessage('imageClicked');
                e.preventDefault();
                return false;
              }
            });
            true;
          `}
        source={{
          html: `
        ${htmlStyles || defaultHtmlStyles}
        <div class="title">${html.adTitle}</div>
        <div class="content">${html.adContent}</div>
        ${
          imageBase64
            ? `<img onclick="window.ReactNativeWebView.postMessage('imageClicked')" src="${imageBase64}" />`
            : ''
        }
      `,
        }}
        style={{width: '100%', backgroundColor: 'transparent'}}
      />
      <CustomModal
        isVisible={isPreviewModalVisible}
        onClose={() => setIsPreviewModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          className="rounded-lg p-5 relative w-full h-[100%]  "
          style={{width: kScreenWidth, height: kScreenHeight}}
          onPress={() => setIsPreviewModalVisible(false)}>
          <OSSImage
            source={{uri: imageBase64}}
            className="w-full h-full rounded-lg"
            style={{width: '100%', height: kScreenHeight}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </CustomModal>
    </View>
  );
}
