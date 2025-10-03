import {useState, useEffect, useCallback} from 'react';

import {useUserStore} from 'src/store/user';

import {HEARTBEAT_TASK_KEYS} from 'src/shared/constants/hearbeatTaskkeys';
import {
  getBetRecord,
  getUserWinningBroadcast,
} from 'src/api/interface/orders-bet';
import {useFocusEffect} from 'expo-router';
import {getUserWallet} from 'src/api/interface/wallets';
import useMineStore from '../store/mine';
import {getUserBasicInfoApi} from 'src/api/interface/users-auth';
import {getNotReadCountApi} from 'src/api/interface/my-message';
import {loopTaskManager} from '@/p138-react-common/taskManager/LoopTaskManager';

export const useMineData = () => {
  const {loginInfo, setUserInfo} = useUserStore();
  const {setWalletInfo, setBetRecord, setNotReadCount} = useMineStore();

  const getInfo = async () => {
    // 页面回到前台时执行的代码
    getUserWallet({
      userID: loginInfo?.userID!,
      username: loginInfo?.username!,
    }).then(res => {
      if (res.success && res.data) {
        setWalletInfo(res.data);
      }
    });

    getBetRecord({
      userID: loginInfo?.userID!,
    }).then(res => {
      res.data && setBetRecord(res.data);
    });

    getUserBasicInfoApi(
      {
        userID: loginInfo?.userID || '',
      },
      {
        'X-Shop-Code': loginInfo?.shopCode ?? 1,
        'X-User-Type': loginInfo?.userType ?? 1,
        'X-Username': loginInfo?.username ?? '',
      },
    ).then(res => {
      if (res.success && res.data) {
        setUserInfo(res.data);
      }
    });

    getNotReadCountApi({
      userID: loginInfo?.userID,
    }).then(res => {
      setNotReadCount(res.data ?? 0);
    });
  };

  useFocusEffect(
    useCallback(() => {
      getInfo();
      
    }, [loginInfo]),
  );

  useEffect(() => {
    loopTaskManager.register({
      key: HEARTBEAT_TASK_KEYS.User_Not_Read_Count,
      intervalSec: 60,
      callback: () => {
        getNotReadCountApi({
          userID: loginInfo?.userID,
        }).then(res => {
          setNotReadCount(res.data ?? 0);
        });
      },
    });
  }, []);
};
