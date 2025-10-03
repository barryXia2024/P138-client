/**
 * MQTT 全局状态管理
 *
 * 管理 MQTT 的连接状态、订阅主题、消息队列等
 */

import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MqttPayload } from '@/p138-react-common/mqtt/types';

/**
 * 单条 MQTT 消息结构
 */
export interface MqttMessage<T = any> {
  topic: string; // 来源 topic
  payload: T; // 消息内容
  timestamp: number; // 接收时间戳
  status?: 'new' | 'read'; // 消息状态
}

/**
 * MQTT 全局状态
 */
interface MqttState {
  /** 连接状态 */
  connected: boolean;
  setConnected: (status: boolean) => void;

  /** 已订阅的主题 */
  subscribedTopics: string[];
  addTopic: (topic: string) => void;
  removeTopic: (topic: string) => void;

  /** 消息队列（按 topic 存储） */
  messages: Record<string, MqttMessage[]>;

  /** 最近一条新消息 */
  lastMessage?: MqttMessage;

  /** 未读计数 */
  unreadCount: Record<string, number>;

  /** 添加消息 */
  addMessage: (topic: string, payload: MqttPayload) => void;

  /** 标记某条消息已读 */
  markMessageRead: (topic: string, index: number) => void;

  /** 标记某个 topic 全部已读 */
  markTopicRead: (topic: string) => void;

  /** 清空某个 topic 的消息 */
  clearMessages: (topic: string) => void;

  /** 清空所有消息 */
  clearAllMessages: () => void;
}

/**
 * Store 实现
 */
export const useMqttStore = create<MqttState>()(
  persist(
    (set, get) => ({
      connected: false,
      setConnected: status => set({connected: status}),

      subscribedTopics: [],
      addTopic: topic =>
        set(state => ({
          subscribedTopics: Array.from(
            new Set([...state.subscribedTopics, topic]),
          ),
        })),
      removeTopic: topic =>
        set(state => ({
          subscribedTopics: state.subscribedTopics.filter(t => t !== topic),
        })),

      messages: {},
      lastMessage: undefined,
      unreadCount: {},

      addMessage: (topic, payload) =>
        set(state => {
          const newMessage: MqttMessage = {
            topic,
            payload,
            timestamp: Date.now(),
            status: 'new',
          };

          // 限制每个 topic 最大 50 条消息
          const topicMessages = state.messages[topic] || [];
          const updatedMessages = [...topicMessages, newMessage].slice(-50);

          return {
            lastMessage: newMessage,
            messages: {
              ...state.messages,
              [topic]: updatedMessages,
            },
            unreadCount: {
              ...state.unreadCount,
              [topic]: (state.unreadCount[topic] || 0) + 1,
            },
          };
        }),

      markMessageRead: (topic, index) =>
        set(state => {
          const topicMessages = state.messages[topic] || [];
          if (topicMessages[index]) {
            topicMessages[index].status = 'read';
          }
          return {
            messages: {
              ...state.messages,
              [topic]: [...topicMessages],
            },
          };
        }),

      markTopicRead: topic =>
        set(state => {
          const topicMessages = state.messages[topic] || [];
          topicMessages.forEach(msg => (msg.status = 'read'));
          return {
            messages: {
              ...state.messages,
              [topic]: [...topicMessages],
            },
            unreadCount: {
              ...state.unreadCount,
              [topic]: 0,
            },
          };
        }),

      clearMessages: topic =>
        set(state => {
          const newMessages = {...state.messages};
          delete newMessages[topic];
          const newUnread = {...state.unreadCount};
          delete newUnread[topic];
          return {
            messages: newMessages,
            unreadCount: newUnread,
          };
        }),

      clearAllMessages: () =>
        set({messages: {}, unreadCount: {}, lastMessage: undefined}),
    }),
    {
      name: 'mqtt-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // ⚠️ 只持久化必要字段，避免存大量消息
      partialize: state => ({
        subscribedTopics: state.subscribedTopics,
        unreadCount: state.unreadCount,
      }),
    },
  ),
);
