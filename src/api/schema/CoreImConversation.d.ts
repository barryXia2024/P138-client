
declare namespace CoreImConversation {

    interface Conversation {
        ownerUserID: string;
        conversationID: string;
        recvMsgOpt: number;
        conversationType: number;
        userID: string;
        groupID: string;
        isPinned: boolean;
        attachedInfo: string;
        isPrivateChat: boolean;
        groupAtType: number;
        ex: string;
        burnDuration: number;
        minSeq: number;
        maxSeq: number;
        msgDestructTime: number;
        latestMsgDestructTime: number;
        isMsgDestruct: boolean;
    }

    interface ListConversationCommand {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListConversationCommandQuery {
        current?: number;
        pageSize?: number;
        sort?: CoreCommonEnum.Sort;
        direction?: BasicTypes.Direction;
    }

    interface ListConversationResult {
        list: Conversation[] | null;
        total: number;
        query: ListConversationCommand;
    }

}
