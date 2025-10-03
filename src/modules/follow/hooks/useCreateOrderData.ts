import {useUserStore} from 'src/store';
import {useCreateOrderStore} from '../store/createOrderStore';
import {useCallback, useState} from 'react';
import {getAllDeclaration} from 'src/api/interface/orders-follow-hall-declaration';
import {getUserWallet} from 'src/api/interface/wallets';
import {useFocusEffect} from 'expo-router';

export const useCreateOrderData = () => {
  const {loginInfo} = useUserStore();
  const {setTagList, setSelectedTag, setDeclaration} = useCreateOrderStore();
  const [walletInfo, setWalletInfo] = useState<ServerCommonWallet.UserWallet>();

  const fetchTags = async () => {
    const res = await getAllDeclaration();
    if (res.data) {
      setTagList(res.data);
      setSelectedTag(res.data[0]);
      setDeclaration(res.data[0].value);
    }
  };

  const fetchWallet = useCallback(() => {
    if (!loginInfo?.userID) return;
    getUserWallet({
      userID: loginInfo.userID,
      username: loginInfo.username,
    }).then(res => setWalletInfo(res.data));
  }, [loginInfo?.userID]);

  useFocusEffect(fetchWallet);

  return {
    walletInfo,
    fetchTags,
  };
};
