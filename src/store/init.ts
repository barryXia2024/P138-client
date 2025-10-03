import { getEncryptedData } from '@/p138-react-common/cryptoUtils';
import { STORAGE_KEYS } from 'p138-react-common/config';
import { useLotteryTypeStore } from 'src/appV3/lottery/store/lotteryStore';
import { useUserStore } from 'src/store/user';


export const restoreUserStore = async () => {
  const loginInfo = await getEncryptedData<ServerCommonAuth.UserSignInResult>(STORAGE_KEYS.LOGIN_INFO);
  const token = await getEncryptedData<string>(STORAGE_KEYS.OAUTH_TOKEN);
  const lotteryType = await getEncryptedData<ServerCommonLottery.ListCustomLotteryResult>(STORAGE_KEYS.LOTTERY_TYPE);

  if (loginInfo) {
    useUserStore.getState().setLoginInfo(loginInfo);
    useUserStore.getState().setLoggedIn(true);
  }
  if (token) {
    useUserStore.getState().setToken(token);
  }
  if (lotteryType) {
    useLotteryTypeStore.getState().setTypeInfo(lotteryType);
  }
};
