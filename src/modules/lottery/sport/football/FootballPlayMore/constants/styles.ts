import {kScreenHeight} from '@/p138-react-common/utils/styles';

export const FOOTBALL_PLAY_MORE_STYLES = {
  bottomSheetContent: {
    minHeight: kScreenHeight * 0.6,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  scrollViewContent: {
    gap: 10,
  },
  oddsContainer: {
    marginTop: 10,
  },
  singleBetTip: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
} as const; 