/**
 * 消息渲染器
 * 根据消息类型渲染对应的消息组件
 */

import React from 'react';
import {MessageType} from '@/p138-react-common/OpenIM/base/types/core';
import type {WrappedMessage} from '@/p138-react-common/OpenIM/base/types/core';
import TextMessage from '../messages/TextMessage';

import VoiceMessage from '../messages/VoiceMessage';
import VideoMessage from '../messages/VideoMessage';
import FileMessage from '../messages/FileMessage';
// 平台分离：原生端和Web端使用不同的图片组件
import OptimizedImageMessage from '../../../components/OptimizedImageMessage';

/**
 * 渲染消息内容
 * @param message 消息对象
 * @param isCurrentUser 是否为当前用户
 * @returns 渲染的消息组件
 */
export const renderMessageContent = (message: WrappedMessage, isCurrentUser: boolean) => {
  const baseProps = {
    message,
    isCurrentUser,
  };

  switch (message.type) {
    case MessageType.Text:
      return <TextMessage {...baseProps} />;
    
    case MessageType.Image:
      return (
        <OptimizedImageMessage
          {...baseProps}
          showPreview={true}
          showStatus={true}
        />
      );
    
    case MessageType.Audio:
      return <VoiceMessage {...baseProps} />;
    
    case MessageType.Video:
      return <VideoMessage {...baseProps} />;
    
    case MessageType.File:
      return <FileMessage {...baseProps} />;
    
    default:
      return <TextMessage {...baseProps} />;
  }
};
