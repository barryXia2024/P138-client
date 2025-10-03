 
export const HEARTBEAT_TASK_KEYS = {
    ORDER_TIMEOUT: 'order-timeout',
    PAYMENT_DELAY: 'payment-delay',
    RESEND_VERIFICATION: 'resend-verification',
    LOTTERY_COUNTDOWN: (id: string) => `lottery-countdown-${id}`, // 动态拼接
    MATCH_END: (matchId: number) => `match-end-${matchId}`,

    /**
     *  用户中奖广播TASK
    */
    User_Winning_Broadcast: 'User-Winning-Broadcast',

    /**
     *  用户未读消息TASK
    */
    User_Not_Read_Count: 'User-Not-Read-Count',


    /**
     *  广告图展示时间TASK
    */
    AD_SHOW_TIME: 'AD-SHOW-TIME',

  };
 