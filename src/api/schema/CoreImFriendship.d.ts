
declare namespace CoreImFriendship {

    interface AddFriendshipCommandPathParams {
        userID: string;
    }

    interface AddFriendshipCommandWithoutPath {
        friendID: string;
        status: FriendshipStatus;
    }

    interface AddFriendshipResult {
        friendIDs: any[] | null;
    }

    interface DeleteFriendshipCommandPathParams {
        userID: string;
    }

    interface DeleteFriendshipCommandWithoutPath {
        friendID: string;
        status: FriendshipStatus;
    }

    // pending: 待处理, accepted: 已接受, rejected: 已拒绝, blocked: 已屏蔽
    type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

}
