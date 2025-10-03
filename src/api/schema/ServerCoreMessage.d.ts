
declare namespace ServerCoreMessage {

    interface CreateMessageCommand {
        userID?: string | null;
        shopID?: number | null;
        msgType: ServerCoreRepo.MsgType;
        userType: ServerCoreUser.UserType;
        msgTypeName: string;
        msgSubType: number;
        msgSubTypeName: string;
        orderNo: string | null;
        content: string;
        title: string | null;
        remark: string | null;
    }

    interface CreateMessageResult {
        messageID: string;
    }

    interface DeleteMessageCommandPathParams {
        messageID: string;
    }

    interface GetMessageCommandPathParams {
        messageID: string;
    }

    interface GetMyMessageCommand {
        userID: string;
        msgType?: ServerCoreRepo.MsgType | null;
    }

    interface GetMyMessageCommandQuery {
        userID: string;
        msgType?: ServerCoreRepo.MsgType | null;
    }

    interface GetMyMessageResult {
        list: MyMessageRow[] | null;
        total: number;
        query: GetMyMessageCommand;
    }

    interface GetNotReadCountCommandQuery {
        userID: string;
    }

    interface GetNotReadCountResult {
        deviceID: string;
        messageTypeOrder: number;
        messageTypeLuckyBag: number;
        messageTypeRedEnvelope: number;
        messageTypeAnnouncement: number;
    }

    interface ListMessageCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        msgType?: ServerCoreRepo.MsgType | null;
        userType?: ServerCoreUser.UserType | null;
        subMsgType?: number | null;
        messageID?: string | null;
    }

    interface ListMessageCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
        msgType?: ServerCoreRepo.MsgType | null;
        userType?: ServerCoreUser.UserType | null;
        subMsgType?: number | null;
        messageID?: string | null;
    }

    interface ListMessageResult {
        list: Message[] | null;
        total: number;
        query: ListMessageCommand;
    }

    interface MarkAsReadByMessageIDCommandPathParams {
        messageID: string;
    }

    interface MarkAsReadByMessageIDCommandQueryWithoutPath {
        userID: string;
    }

    interface MarkAsReadByMessageIDResult {
        searchValue: string;
        createBy: string;
        createdAt: number;
        updateBy: string;
        updatedAt: number;
        remark: string;
        params: Record<string,any> | null;
        messageID: string;
        userID: string;
        deviceID: string;
        shopCode: number;
        orderID: string;
        orderNo: string;
        content: string;
        messageReadStatus: ServerCoreRepo.MessageReadStatus;
        type: ServerCoreRepo.MsgType;
        subType: number;
        typeList: ServerCoreRepo.MsgType[] | null;
        idList: string[] | null;
    }

    interface MarkAsReadCommand {
        userID: string;
        msgType: ServerCoreRepo.MsgType;
    }

    interface Message {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        createBy: string;
        updateBy: string;
        msgType: ServerCoreRepo.MsgType;
        userType: ServerCoreUser.UserType;
        msgTypeName: string;
        msgSubType: number;
        msgSubTypeName: string;
        content: string;
        hasPushed: boolean;
        title: string;
        remark: string;
    }

    interface MyMessageRow {
        messageID: string;
        messageStatusID: string;
        userID: string;
        userType: ServerCoreUser.UserType;
        deviceID: string;
        shopCode: number;
        msgType: ServerCoreRepo.MsgType;
        msgTypeName: string;
        msgSubType: number;
        msgSubTypeName: string;
        createdAt: number;
        status: ServerCoreRepo.MessageReadStatus;
        orderNo: string;
        content: string;
        title: string;
        remark: string;
    }

    interface PublishMessageCommand {
        userIDList?: string[] | null;
        messageID: string;
    }

    interface PublishMessageResult {
        messageID: string;
    }

    interface UpdateMessageCommandPathParams {
        messageID: string;
    }

    interface UpdateMessageCommandWithoutPath {
        msgType?: ServerCoreRepo.MsgType | null;
        msgTypeName?: string | null;
        userType?: ServerCoreUser.UserType | null;
        msgSubType?: number | null;
        msgSubTypeName?: string | null;
        content?: string | null;
        title?: string | null;
        remark?: string | null;
    }

}
