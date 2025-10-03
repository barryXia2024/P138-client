declare namespace HomeProps {
  interface LotteryGridItemsProps {
    className?: string;
  }
  interface LotteryGridItemProps {
    item: ServerCommonLottery.ListCustomLotteryResult;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
  }
  interface HomeMarqueeProps {
    className?: string;
  }

  interface LotteryGridItemsProps {
    className?: string;
    // lotteryData: {
    //   category1: ServerCommonLottery.ListCustomLotteryResult[];
    //   category2: ServerCommonLottery.ListCustomLotteryResult[];
    // };
    // loading: boolean;
    // onPress: (lottery: ServerCommonLottery.ListCustomLotteryResult) => void;
    // getDisplayInfo: (lottery: ServerCommonLottery.ListCustomLotteryResult) => {
    //   name: string;
    //   iconUrl: string;
    //   description: string;
    //   isSaleable: boolean;
    // };
  }

  interface LotteryOverviewPanelProps {
    shopInfo?: ServerCommonShop.LotteryShop | null;
    loading?: boolean;
    onFollowPress?: () => void;
    onResultPress?: () => void;
    onTrendPress?: () => void;
  }
}
