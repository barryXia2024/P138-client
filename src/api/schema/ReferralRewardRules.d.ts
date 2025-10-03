
declare namespace ReferralRewardRules {

    interface CreateReferralRewardRuleCommand {
        ruleName: string;
        referralType: number;
        rewardType: string;
        rewardAmount: string;
        conditionType: string;
        conditionValue?: string;
        status: string;
        startDate: string;
        endDate?: string;
        uniqueIdentifier: string;
        captchaVerified: boolean;
        ipAddress: string;
    }

    interface CreatedReferralRewardRuleResult {
        id: string;
    }

    interface PathIDPathParams {
        id: string;
    }

    interface ReferralRewardRule {
        id: string;
        createdAt: number;
        updatedAt: number;
        version: number;
        ruleName: string;
        referralType: number;
        rewardType: string;
        rewardAmount: string;
        conditionType: string;
        conditionValue: string;
        status: string;
        startDate: any;
        endDate: any;
        uniqueIdentifier: string;
        captchaVerified: boolean;
        ipAddress: string;
    }

    interface UpdateReferralRewardRuleCommandPathParams {
        id: string;
    }

    interface UpdateReferralRewardRuleCommandWithoutPath {
        ruleName: string;
        referralType: number;
        rewardType: string;
        rewardAmount: string;
        conditionType: string;
        conditionValue?: string;
        status: string;
        startDate: string;
        endDate?: string;
        uniqueIdentifier: string;
        captchaVerified: boolean;
        ipAddress: string;
    }

}
