/**
 * 消息解析 Hook
 * 
 * 职责：
 * 1. 解析图片消息（提取URL、尺寸、缩略图等）
 * 2. 解析文本消息（内容、系统消息标识等）
 * 3. 处理SDK缩略图问题（强制使用真实尺寸）
 * 4. 移除URL中的尺寸参数
 * 
 * 设计原则：
 * - 与UI完全解耦，纯解析逻辑
 * - 支持多种消息格式（JSON、extras、直接URL）
 * - 类型安全，提供完整的类型定义
 * - 性能优化，使用useCallback避免重渲染
 */

import { useCallback } from 'react';
 
import type { WrappedMessage } from '../types';
import P138OpenIMCore from '../core/P138OpenIMCore';

export interface ImageMessageInfo {
  url: string;
  width: number;
  height: number;
  thumbnail: string;
}

export interface TextMessageInfo {
  content: string;
  isSystemMessage: boolean;
}

/**
 * 消息解析 Hook
 * @returns 消息解析方法
 */
export const useMessageParser = () => {
  /**
   * 解析图片消息
   * @param message 包装后的消息对象
   * @returns 图片信息对象或null
   */
  const parseImageMessage = useCallback((message: WrappedMessage): ImageMessageInfo | null => {
    const instance = new P138OpenIMCore();
    return instance.parseImageMessage(message);
  }, []);

  /**
   * 解析文本消息
   * @param message 包装后的消息对象
   * @returns 文本信息对象
   */
  const parseTextMessage = useCallback((message: WrappedMessage): TextMessageInfo => {
    const instance = new P138OpenIMCore();
    return instance.parseTextMessage(message);
  }, []);

  return {
    parseImageMessage,
    parseTextMessage,
  };
};
