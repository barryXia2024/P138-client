import {
  betPlayColorBlue,
  betPlayColorBrown,
  betPlayColorGreen,
  betPlayColorPurple,
} from 'p138-react-common/utils/styles/color';

export const playMoreConfigMap: Record<
CoreCommonEnum.LotteryName,
  {
    playKeys: CoreCommonEnum.PlayEnglishName[];
    renderMap: Record<
    CoreCommonEnum.PlayEnglishName,
      {
        type: 'grid' | 'score' | 'twoColumn' | 'pairwise';
        title: string;
        color: string;
        insertEmptyAfter?: string;
        showSingleTip?: boolean;
        leftLabel?: string;
        rightLabel?: string;
        combineBetItem?: boolean;
        isShowHandicap?: boolean;
      }
    >;
  }
> = {
  /** 竞彩足球 */
  FootballLottery: {
    playKeys: [
      'F_HTZ$PLAY', // 胜平负
      'S_PFRQ$PLAY', // 让球胜平负
      'Q_CBF$PLAY', // 全场比分
      'Z_JQ$PLAY', // 进球数
      'B_QC$PLAY', // 半全场
    ],
    renderMap: {
      F_HTZ$PLAY: {type: 'grid', title: '胜平负', color: betPlayColorBlue},
      S_PFRQ$PLAY: {
        type: 'grid',
        title: '让球胜平负',
        color: betPlayColorGreen,
      },
      Q_CBF$PLAY: {
        type: 'score',
        title: '全场比分',
        color: betPlayColorBrown,
        insertEmptyAfter: '胜其他',
        showSingleTip: true,
      },
      Z_JQ$PLAY: {type: 'grid', title: '进球数', color: betPlayColorPurple},
      B_QC$PLAY: {type: 'grid', title: '半全场', color: betPlayColorBrown},
    },
  },

  /** 北京单场 */
  BeijingSingleMatch: {
    playKeys: [
      'S_PF$PLAY', // 让球胜平负
      'Q_CBF$PLAY', // 胜负过关（等价于全场比分）
      'Z_JQ$PLAY', // 总进球数
      'S_XDS$PLAY', // 比分
      'S_FGG$PLAY', // 半全场
      'B_QC$PLAY', // 上下单双
    ],
    renderMap: {
      S_PF$PLAY: {type: 'grid', title: '让球胜平负', color: betPlayColorBlue},
      Q_CBF$PLAY: {
        type: 'score',
        title: '胜负过关',
        insertEmptyAfter: '胜其他',
      },
      Z_JQ$PLAY: {type: 'grid', title: '总进球数', color: betPlayColorGreen},
      S_XDS$PLAY: {
        type: 'score',
        title: '比分',
        insertEmptyAfter: '胜其他',
        showSingleTip: false,
      },
      S_FGG$PLAY: {type: 'grid', title: '半全场', color: betPlayColorPurple},
      B_QC$PLAY: {type: 'grid', title: '上下单双', color: betPlayColorBrown},
    },
  },

  /** 竞彩篮球 */
  BasketballLottery: {
    playKeys: [
      'F_HTZ$PLAY', // 胜负
      'S_FR$PLAY', // 让分胜负
      'D_XF$PLAY', // 大小分
      'S_FC$PLAY', // 胜分差
    ],
    renderMap: {
      F_HTZ$PLAY: {
        type: 'twoColumn',
        title: '胜负',
        leftLabel: '客胜',
        rightLabel: '主胜',
        color: betPlayColorBlue,
      },
      S_FR$PLAY: {
        type: 'twoColumn',
        title: '让分胜负',
        leftLabel: '客胜',
        rightLabel: '主胜',
        color: betPlayColorGreen,
        isShowHandicap: true,
      },
      D_XF$PLAY: {
        type: 'twoColumn',
        title: '大小分',
        leftLabel: '大于',
        rightLabel: '小于',
        color: betPlayColorPurple,
        isShowHandicap: true,
      },
      S_FC$PLAY: {
        type: 'pairwise',
        title: '胜分差',
        color: betPlayColorBrown,
        leftLabel: '客胜',
        rightLabel: '主胜',
        combineBetItem: true,
      },
    },
  },
};
