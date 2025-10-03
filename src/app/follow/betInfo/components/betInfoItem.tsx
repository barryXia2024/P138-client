

import { SportLotteryType, SportLotteryTypeEnum } from "src/modules/lottery/constants"
import { Traditional } from "./traditional"
import { Digital } from "./digital"
import { Sport } from "./sport"

const BetInfoItem = ({orderInfo}:{orderInfo?:CommonFollowHall.GetTrackingOrderItemResult}) => {
    const {lotteryName} = orderInfo||{};
    if(!orderInfo) return null;
    if(SportLotteryType[lotteryName!]===SportLotteryTypeEnum.Traditional){
        return <Traditional orderInfo={orderInfo} />
    }else if(SportLotteryType[lotteryName!]===SportLotteryTypeEnum.Digital){
        return <Digital orderInfo={orderInfo} />
    }else if(SportLotteryType[lotteryName!]===SportLotteryTypeEnum.Sport){
        return <Sport orderInfo={orderInfo} />
    }
    return null;
}

export default BetInfoItem;