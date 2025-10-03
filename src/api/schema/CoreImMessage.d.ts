
declare namespace CoreImMessage {

    interface GetMessagePathIDPathParams {
        messageID: string;
    }

    interface Message {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        content: string;
        userID: string;
        roomID: string;
        sendTime: any;
        messageType: MessageType;
        isRead: MessageReadStatus;
        status: MessageStatus;
        priority: number;
        source: string;
        referenceMessageID: number | null;
        encrypted: EncryptionStatus;
        expirationTime: any;
        clusterID: string;
        partitionKey: string;
        sequenceNumber: number;
        sendTimeMonth: string;
        sendTimeYear: string;
    }

    interface PathIDPathParams {
        roomID: string;
    }

    // 0: 未加密, 1: 已加密
    type EncryptionStatus = 0 | 1;

    // 0: 未读, 1: 已读
    type MessageReadStatus = 0 | 1;

    // 0: 正常, 1: 已撤回, 2: 已删除
    type MessageStatus = 0 | 1 | 2;

    // text: 文本消息, image: 图片消息, video: 视频消息, audio: 音频消息, file: 文件消息
    type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

}
