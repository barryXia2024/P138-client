/**
 * 通用聊天输入组件 (React Native 版本)
 * 支持文本和图片发送
 */

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import {Text as RNText} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';
import {checkImagePermissions, showPermissionDialog} from '@/utils/permissionUtils';
import {selectAndSendImage} from '@/utils/demoImageUtils';
import EmojiPanel from '../EmojiPanel';
import { ZTextInput } from '@/p138-react-common/components';
// 🚨 平台特定导入：只在非 Web 平台导入 RNFS
let RNFS: any = null;
if (Platform.OS !== 'web') {
  try {
    RNFS = require('react-native-fs').default;
  } catch (error) {
    console.warn('RNFS not available on this platform');
  }
}

interface ChatInputProps {
  /** 发送文本消息回调 */
  onSendMessage: (content: string) => Promise<void>;
  /** 发送图片消息回调 */
  onSendImage?: (
    imagePath: string,
    width?: number,
    height?: number,
  ) => Promise<void>;
  /** 是否正在发送 */
  sending?: boolean;
  /** 是否显示图片发送功能 */
  showImageOption?: boolean;
  /** 是否显示其他选项 */
  showMoreOptions?: boolean;
  /** 自定义选项 */
  customOptions?: Array<{
    icon: any;
    label: string;
    onPress: () => void;
  }>;
  /** 输入框占位符 */
  placeholder?: string;
  /** 最大输入长度 */
  maxLength?: number;
  /** 是否禁言（禁用输入与发送） */
  isMuted?: boolean;
  /** 禁言提示语 */
  mutedTip?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendImage,
  sending = false,
  showImageOption = true,
  showMoreOptions = false,
  customOptions = [],
  placeholder = '输入消息...',
  maxLength = 1000,
  isMuted = false,
  mutedTip = '已被禁言，暂时无法发言',
}) => {
  const [inputText, setInputText] = useState('');
  const [expanded, setExpanded] = useState<'none' | 'emoji' | 'options'>(
    'none',
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const disabled = sending || isMuted;

  // 🚨 监听键盘高度变化
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // 处理发送文本
  const handleSend = async () => {
    if (isMuted) {
      ToastService.show(mutedTip);
      return;
    }
    if (!inputText.trim() || sending) return;
    Keyboard.dismiss();

    try {
      await onSendMessage(inputText.trim());
      setInputText('');
      setExpanded('none');
    } catch (error) {
      // 错误处理由父组件负责
      console.error('发送消息失败:', error);
    }
  };

  // 🚨 处理输入框焦点事件：点击输入框时隐藏展开面板
  const handleInputFocus = () => {
    if (expanded !== 'none') {
      console.log('📱 RN 输入框获得焦点，隐藏展开面板');
      setExpanded('none');
    }
  };

  // 切换选项面板
  const toggleOptions = () => {
    if (isMuted) {
      ToastService.show(mutedTip);
      return;
    }
    setExpanded(prev => (prev === 'options' ? 'none' : 'options'));
  };

  // 切换表情面板
  const toggleEmoji = () => {
    if (isMuted) {
      Toast.show(mutedTip);
      return;
    }
    Keyboard.dismiss();
    setExpanded(prev => (prev === 'emoji' ? 'none' : 'emoji'));
  };

  // 处理图片选择 - 使用Demo方式
  const handlePickImage = async () => {
    if (!onSendImage) return;
    if (isMuted) {
      ToastService.show(mutedTip);
      return;
    }

    // 🚨 关键修复：先隐藏键盘
    Keyboard.dismiss();

    // 使用Demo方式的图片选择和处理
    await selectAndSendImage(async (uri: string, width?: number, height?: number) => {
      await onSendImage(uri, width, height);
      setExpanded('none');
    });
  };

  // 复制图片到持久化位置
  const copyImageToPersistentLocation = async (
    tempUri: string,
  ): Promise<string> => {
    // 🚨 Web 平台直接返回原始 URI
    if (Platform.OS === 'web') {
      console.log('🌐 Web 平台：直接使用原始 URI');
      return tempUri;
    }

    // 🚨 非 Web 平台使用 RNFS
    if (!RNFS) {
      console.warn('⚠️ RNFS 不可用，使用原始路径');
      return tempUri;
    }

    try {
      console.log('📁 开始复制图片:', {
        临时路径: tempUri,
        文档目录: RNFS.DocumentDirectoryPath,
      });

      // 检查临时文件是否存在
      const tempFileExists = await RNFS.exists(tempUri);
      if (!tempFileExists) {
        console.warn('⚠️ 临时文件不存在，尝试使用原始路径');
        return tempUri;
      }

      // 获取临时文件信息
      const tempFileStats = await RNFS.stat(tempUri);
      console.log('📄 临时文件信息:', {
        存在: tempFileExists,
        大小: tempFileStats.size,
        类型: tempFileStats.isDirectory() ? '目录' : '文件',
      });

      // 生成持久化文件名
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `image_${timestamp}_${randomId}.jpg`;
      const persistentPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      console.log('📁 准备复制到持久化位置:', {
        临时路径: tempUri,
        持久化路径: persistentPath,
        文件名: fileName,
      });

      // 确保目标目录存在
      try {
        const dirExists = await RNFS.exists(RNFS.DocumentDirectoryPath);
        if (!dirExists) {
          console.log('📁 创建文档目录...');
          await RNFS.mkdir(RNFS.DocumentDirectoryPath);
        }
      } catch (dirError) {
        console.warn('⚠️ 目录创建失败，继续尝试复制:', dirError);
      }

      // 复制文件
      console.log('📋 开始复制文件...');
      await RNFS.copyFile(tempUri, persistentPath);
      console.log('📋 文件复制完成');

      // 验证文件是否复制成功
      console.log('🔍 验证文件复制结果...');
      const fileExists = await RNFS.exists(persistentPath);
      if (!fileExists) {
        console.error('❌ 文件复制失败 - 目标文件不存在');
        throw new Error('文件复制失败 - 目标文件不存在');
      }

      // 获取复制后的文件信息
      const fileStats = await RNFS.stat(persistentPath);
      console.log('✅ 图片复制成功:', {
        路径: persistentPath,
        大小: fileStats.size,
        存在: fileExists,
      });

      return persistentPath;
    } catch (error) {
      console.error('❌ 复制图片失败:', error);
      console.error('❌ 错误详情:', {
        临时路径: tempUri,
        错误类型: error instanceof Error ? error.constructor.name : 'Unknown',
        错误消息: error instanceof Error ? error.message : String(error),
        错误堆栈: error instanceof Error ? error.stack : undefined,
      });

      // 如果复制失败，尝试直接使用原始路径
      console.log('🔄 尝试使用原始路径:', tempUri);

      // 再次检查原始路径是否存在
      try {
        const originalFileExists = await RNFS.exists(tempUri);
        if (originalFileExists) {
          console.log('✅ 原始路径文件存在，使用原始路径');
          return tempUri;
        } else {
          console.error('❌ 原始路径文件也不存在');
          throw new Error('图片文件不存在，请重新选择');
        }
      } catch (originalError) {
        console.error('❌ 检查原始路径失败:', originalError);
        throw new Error('图片文件不存在，请重新选择');
      }
    }
  };

  // 处理键盘事件
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
      event.preventDefault();
      if (!isMuted) handleSend();
    }
  };

  return (
   
      <View style={styles.container}>
        {isMuted ? (
          <View style={styles.mutedBar}>
            <RNText style={styles.mutedText}>{mutedTip}</RNText>
          </View>
        ) : null}
        <View style={styles.inputContainer}>
          {/* 输入框 */}
          <View style={styles.inputWrap}>
            <ZTextInput
           
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={isMuted ? mutedTip : placeholder}
              containerStyle={{borderWidth: 0}}
              placeholderTextColor="#999"
              multiline
              maxLength={maxLength}
              editable={!disabled}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
            />
          </View>
          {/* 表情按钮 */}
          <TouchableOpacity
            style={[styles.roundIcon, isMuted && {opacity: 0.5}]}
            onPress={toggleEmoji}
            disabled={isMuted}>
            <RNText style={{fontSize: 18}}>😊</RNText>
          </TouchableOpacity>

          {/* 发送 / 加号 */}
          {inputText.trim() ? (
            <TouchableOpacity
              style={[
                styles.sendButton,
                (sending || isMuted) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={sending || isMuted}>
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <RNText style={styles.sendButtonText}>发送</RNText>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={toggleOptions}
              style={[styles.plusButton, isMuted && {opacity: 0.5}]}
              disabled={isMuted}>
              <RNText style={{fontSize: 20, color: '#2D9DFE'}}>＋</RNText>
            </TouchableOpacity>
          )}
        </View>

        {/* 表情面板 */}
        {expanded === 'emoji' && (
          <View
            style={[styles.expandableArea, {height: keyboardHeight || 240}]}>
            <EmojiPanel
              onSelect={e => {
                setInputText(prev => prev + e);
              }}
              maxHeight={keyboardHeight || 240}
            />
          </View>
        )}

        {/* 扩展功能区 */}
        {expanded === 'options' &&
          (showImageOption || showMoreOptions || customOptions.length > 0) && (
            <View
              style={[styles.expandableArea, {height: keyboardHeight || 120}]}>
              <View style={styles.optionsBar}>
                {/* 图片选项 */}
                {showImageOption && onSendImage && (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={handlePickImage}>
                    <View style={styles.optionIconWrap}>
                      <Image
                        source={require('src/assets/imgs/chat/icon_image.png')}
                        style={{width: 24, height: 24, tintColor: '#fff'}}
                      />
                    </View>
                    <RNText style={styles.optionText}>相册</RNText>
                  </TouchableOpacity>
                )}

                {/* 自定义选项 */}
                {customOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionItem}
                    onPress={option.onPress}>
                    <View style={styles.optionIconWrap}>
                      <Image
                        source={option.icon}
                        style={{width: 24, height: 24, tintColor: '#fff'}}
                      />
                    </View>
                    <RNText style={styles.optionText}>{option.label}</RNText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
      </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  expandableArea: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,

    marginRight: 12,
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
    borderWidth: 0,
  },
  sendButton: {
    backgroundColor: '#2D9DFE',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsBar: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 16,
    backgroundColor: '#F6F7F9',
  },
  mutedBar: {
    backgroundColor: '#FFF4E5',
    borderColor: '#FFE1BF',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  mutedText: {
    color: '#A85D00',
    fontSize: 12,
  },
  optionItem: {
    width: 88,
    alignItems: 'center',
    marginRight: 24,
  },
  optionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2D9DFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  optionText: {
    color: '#666',
    fontSize: 12,
  },
});

export default ChatInput;
