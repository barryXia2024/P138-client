// IM 通用工具函数（对齐 DEMO）
import { Platform } from 'react-native';

// 平台 ID 定义
export const platformID = Platform.OS === 'ios' ? 1 : Platform.OS === 'android' ? 2 : 5;

// 会话类型
export enum SessionType {
  Single = 1,
  Group = 2,
  WorkingGroup = 3,
  Notification = 4,
}

// 消息类型
export enum MessageType {
  Text = 101,
  Picture = 102,
  Voice = 103,
  Video = 104,
  File = 105,
  AtText = 106,
  Merger = 107,
  Card = 108,
  Location = 109,
  Custom = 110,
  Revoke = 111,
  HasReadReceipt = 112,
  Typing = 113,
  Quote = 114,
  Face = 115,
  AdvancedText = 117,
}

// 系统消息类型
export const SystemMessageTypes = [
  1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210,
  1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220,
  1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228, 1229, 1230,
  1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240,
  1241, 1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250,
  1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260,
  1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270,
  1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280,
  1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290,
  1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300,
];

// 群组状态
export enum GroupStatus {
  Normal = 0,
  Banned = 1,
  Dismissed = 2,
  Muted = 3,
}

// 判断是否为群聊会话
export const isGroupSession = (conversationType: number): boolean => {
  return conversationType === SessionType.Group || conversationType === SessionType.WorkingGroup;
};

// 获取会话内容预览
export const getConversationContent = (message: any): string => {
  if (!message) return '';
  
  switch (message.contentType) {
    case MessageType.Text:
      return message.textElem?.content || message.content || '';
    case MessageType.Picture:
      return '[图片]';
    case MessageType.Voice:
      return '[语音]';
    case MessageType.Video:
      return '[视频]';
    case MessageType.File:
      return '[文件]';
    case MessageType.AtText:
      return message.atTextElem?.text || '[提及消息]';
    case MessageType.Location:
      return '[位置]';
    case MessageType.Card:
      return '[名片]';
    case MessageType.Merger:
      return '[聊天记录]';
    case MessageType.Custom:
      return '[自定义消息]';
    case MessageType.Revoke:
      return '[消息已撤回]';
    case MessageType.Quote:
      return message.quoteElem?.text || '[引用消息]';
    case MessageType.Face:
      return '[表情]';
    default:
      if (SystemMessageTypes.includes(message.contentType)) {
        return '[系统消息]';
      }
      return '[未知消息]';
  }
};

// 格式化会话时间
export const formatConversionTime = (timestamp: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 今天
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (msgDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // 昨天
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  if (msgDate.getTime() === yesterday.getTime()) {
    return '昨天';
  }
  
  // 一周内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  }
  
  // 更早
  return date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit' 
  });
};

// 生成操作 ID
export const generateOperationID = (): string => {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};
