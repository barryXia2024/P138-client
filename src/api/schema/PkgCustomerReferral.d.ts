
declare namespace PkgCustomerReferral {

    interface CreateReferralRelationshipCommand {
        referrerUserId: number;
        referredUserId: number;
        referralType: number;
        referralCode: string;
        referralUrl: string;
        referralSource: string;
    }

    interface CreatedReferralRelationshipResult {
        id: string;
    }

    interface PathIDPathParams {
        id: string;
    }

    interface ReferralRelationship {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        referrerUserId: number;
        referredUserId: number;
        referralType: number;
        referralCode: string;
        referralUrl: string;
        referralSource: string;
        createdAt: any;
        updatedAt: any;
        isStarUser: boolean;
        status: string;
    }

    interface UpdateReferralRelationshipCommandPathParams {
        id: string;
    }

    interface UpdateReferralRelationshipCommandWithoutPath {
        referrerUserId: number;
        referredUserId: number;
        referralType: number;
        referralCode: string;
        referralUrl: string;
        referralSource: string;
        isStarUser: boolean;
        status: string;
    }

}
