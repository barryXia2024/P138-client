/**
 * 通用聊天输入组件
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
  Platform,
} from 'react-native';
import {Text as RNText} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {ToastService} from '@/p138-react-common/components/toast/ToastService';
import EmojiPanel from '../EmojiPanel';

interface ChatInputProps {
  /** 发送文本消息回调 */
  onSendMessage: (content: string) => Promise<void>;
  /** 发送图片消息回调 */
  onSendImage?: (imagePath: string, width?: number, height?: number) => Promise<void>;
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
  const [expanded, setExpanded] = useState<'none' | 'emoji' | 'options'>('none');
  const [isVirtualKeyboardVisible, setIsVirtualKeyboardVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const disabled = sending || isMuted;

  // 🚨 手机端浏览器虚拟键盘检测
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // 如果高度减少超过 150px，认为是虚拟键盘弹出
      const isKeyboardVisible = heightDifference > 150;
      setIsVirtualKeyboardVisible(isKeyboardVisible);
      
      console.log('🌐 Web 虚拟键盘状态:', {
        initialHeight,
        currentHeight,
        heightDifference,
        isKeyboardVisible
      });
    };

    // 监听视口大小变化
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 🚨 处理输入框焦点事件：点击输入框时隐藏展开面板
  const handleInputFocus = () => {
    if (expanded !== 'none') {
      console.log('🌐 输入框获得焦点，隐藏展开面板');
      setExpanded('none');
    }
  };

  // 处理发送文本
  const handleSend = async () => {
    if (isMuted) {
      ToastService.show(mutedTip);
      return;
    }
    if (!inputText.trim() || sending) return;

    try {
      await onSendMessage(inputText.trim());
      setInputText('');
      setExpanded('none');
    } catch (error) {
      // 错误处理由父组件负责
      console.error('发送消息失败:', error);
    }
  };

  // 切换选项面板
  const toggleOptions = () => {
    if (isMuted) {
      ToastService.show(mutedTip);
      return;
    }
    
    // 🚨 Web 端：如果虚拟键盘可见，先隐藏展开面板
    if (isVirtualKeyboardVisible) {
      setExpanded('none');
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
    
    // 🚨 Web 端：如果虚拟键盘可见，先隐藏展开面板
    if (isVirtualKeyboardVisible) {
      setExpanded('none');
      return;
    }
    
    setExpanded(prev => (prev === 'emoji' ? 'none' : 'emoji'));
  };

  // 处理图片选择
  const handlePickImage = async () => {
    if (!onSendImage) return;
    if (isMuted) {
      ToastService.show(mutedTip);
      return;
    }

    try {
      // 请求权限
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        ToastService.show('需要相册权限才能发送图片');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        quality: 0.8,
        allowsEditing: false,
        allowsMultipleSelection: false,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // 检查文件大小（限制为10MB）
        if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          ToastService.show('图片文件过大，请选择小于10MB的图片');
          return;
        }
        
        await onSendImage(asset.uri, asset.width, asset.height);
        setExpanded('none');
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      ToastService.show('选择图片失败，请重试');
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
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={isMuted ? mutedTip : placeholder}
            placeholderTextColor="#999"
            multiline
            maxLength={maxLength}
            editable={!disabled}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
          />
        </View>
        {/* 表情按钮 */}
        {!isVirtualKeyboardVisible && (
          <TouchableOpacity style={[styles.roundIcon, isMuted && {opacity: 0.5}]} onPress={toggleEmoji} disabled={isMuted}>
            <RNText style={{fontSize: 18}}>😊</RNText>
          </TouchableOpacity>
        )}

        {/* 发送 / 加号 */}
        {inputText.trim() ? (
          <TouchableOpacity
            style={[styles.sendButton, (sending || isMuted) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={sending || isMuted}>
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <RNText style={styles.sendButtonText}>发送</RNText>
            )}
          </TouchableOpacity>
        ) : (
          /* 加号按钮 */
          !isVirtualKeyboardVisible && (
            <TouchableOpacity onPress={toggleOptions} style={[styles.plusButton, isMuted && {opacity: 0.5}]} disabled={isMuted}>
              <RNText style={{fontSize: 20, color: '#2D9DFE'}}>＋</RNText>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* 表情面板 */}
      {expanded === 'emoji' && !isVirtualKeyboardVisible && (
        <EmojiPanel
          onSelect={(e) => {
            setInputText(prev => prev + e);
            // 🚨 Web 端：选择表情后不需要隐藏键盘，因为 Web 端没有物理键盘
            // 但可以添加一些视觉反馈
            console.log('🌐 表情已选择:', e);
          }}
          maxHeight={240}
        />
      )}

      {/* 扩展功能区 */}
      {expanded === 'options' && !isVirtualKeyboardVisible && (showImageOption || showMoreOptions || customOptions.length > 0) && (
        <View style={styles.optionsBar}>
          {/* 图片选项 */}
          {showImageOption && onSendImage && (
            <TouchableOpacity style={styles.optionItem} onPress={handlePickImage}>
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
            <TouchableOpacity key={index} style={styles.optionItem} onPress={option.onPress}>
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
