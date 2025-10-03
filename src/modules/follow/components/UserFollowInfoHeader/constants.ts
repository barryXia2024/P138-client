export const HeaderConfig = {
  mine: {
    title: '我的战绩',
    showFollowButton: false,
    showConsecutiveWins: true,
    showFansInfo: true,
    showConsecutiveWinsInHeader: false,
    containerStyle: {},
    headerStyle: {
      borderRadius: 8,
      padding: 4,
    },
    userInfoStyle: {
      padding: 16,
    },
    statsStyle: {
      marginTop: 8,
      padding: 16,
      borderRadius: 8,
    },
  },
  other: {
    title: '他的战绩',
    showFollowButton: true,
    showConsecutiveWins: true,
    showFansInfo: true,
    showConsecutiveWinsInHeader: true,
    containerStyle: {
      backgroundColor: '#fff',
    },
    headerStyle: {},
    userInfoStyle: {},
    statsStyle: {},
  },
} as const;
