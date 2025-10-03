
declare namespace ReferralReferralRewards {

    interface CreateReferralRewardCommand {
        referralRelationshipId: number;
        referralRewardRulesId: number;
        rewardType: string;
        rewardAmount: number;
    }

    interface CreatedReferralRewardResult {
        id: string;
    }

    interface PathIDPathParams {
        id: string;
    }

    interface ReferralReward {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        referralRelationshipId: number;
        referralRewardRulesId: number;
        rewardType: string;
        rewardAmount: number;
        status: string;
        createdAt: any;
        updatedAt: any;
    }

    interface UpdateReferralRewardCommandPathParams {
        id: string;
    }

    interface UpdateReferralRewardCommandWithoutPath {
        referralRelationshipId: number;
        referralRewardRulesId: number;
        rewardType: string;
        rewardAmount: number;
        status: string;
    }

}
