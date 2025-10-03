
declare namespace CoreImGroup {

    interface CreateGroupCommand {
        groupName: string;
        creatorID?: number;
        groupNotice: string;
        description: string;
        muteGroupNotifications: boolean;
    }

    interface CreatedGroupResult {
        groupID: string;
    }

    interface Group {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        groupName: string;
        creatorID: number;
        groupNotice: string;
        description: string;
        muteGroupNotifications: boolean;
    }

    interface GroupMember {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        groupID: string;
        groupName: string;
        groupNickname: string;
        userID: string;
        joinedAt: any;
        leaveAt: any;
        muteGroupNotifications: boolean;
    }

    interface JoinCommandPathParams {
        groupID: string;
        memberID: string;
    }

    interface JoinCommandWithoutPath {
        joinedAt: any;
    }

    interface JoinResult {
        groupMembersID: string;
    }

    interface ListGroupByUserIDPathParams {
        userID: string;
    }

    interface MemberPathIDPathParams {
        memberID: string;
        groupID: string;
    }

    interface PathGroupIDPathParams {
        groupID: string;
    }

    interface PathIDPathParams {
        groupID: string;
    }

    interface UpdateGroupCommandPathParams {
        groupID: string;
    }

    interface UpdateGroupCommandWithoutPath {
        groupName: string;
        groupNotice: string;
        description: string;
        muteGroupNotifications: boolean;
    }

    interface UpdateGroupProfileCommandPathParams {
        groupMemberID: string;
    }

    interface UpdateGroupProfileCommandWithoutPath {
        groupNickname: string;
        muteGroupNotifications: boolean;
    }

}
