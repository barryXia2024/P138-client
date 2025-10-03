
declare namespace ImMessageStatus {

    interface MessageStatus {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        messageID: string;
        isRead: MessageReadStatus;
        userID: string;
    }

    interface MessageStatusPathIDPathParams {
        messageStatusID: string;
    }

    interface PathIDPathParams {
        userID: string;
    }

    // 0: 未读, 1: 已读
    type MessageReadStatus = 0 | 1;

}
