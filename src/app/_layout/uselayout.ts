import MqttClientManager from "@/p138-react-common/mqtt/MqttClientManager";
import { imService } from "@/p138-react-common/OpenIM/imService";
import { BaseEventTypes, eventBus, IMEventTypes } from "@/p138-react-common/utils/eventBus";
import { logger } from "@/p138-react-common/utils/logged";
import { useEffect } from "react";
import { Platform } from "react-native";
import { refreshOpenimTokenApi } from "src/api/interface/users-auth";
import { useUserStore } from "src/store";

export default ()=>{
  const {loginInfo} = useUserStore()

  useEffect(() => {
    if(!loginInfo?.userID){
      imService.autoLogin(loginInfo?.userID)
    }
    // 监听登录成功
    const offLogin = eventBus.on(BaseEventTypes.LOGIN, async (data) => {
      if(data.openIMToken?.token){
     
        imService.loginWithToken({
          userId: loginInfo?.userID,
          token: data.openIMToken?.token,
          expireTimeSeconds: data.openIMToken?.expireTimeSeconds,
          refreshFn: async () => {
            const r = await refreshOpenimTokenApi({
              userType: 1,
              userID: loginInfo?.userID,
              platform: Platform.OS=='web'?'pc':Platform.OS as BasicTypes.Platform
            });
            if(r.success){
            return { token: r.data?.token??'', expireTimeSeconds: r.data?.expireTimeSeconds??0 };
            }else{
              logger.error('refreshOpenimTokenApi error',JSON.stringify(r))
              return { token: '', expireTimeSeconds: 0 }
            }
          }
        });
        eventBus.emit(IMEventTypes.LOGIN,undefined)
      }else{
        eventBus.emit(IMEventTypes.LOGIN_FAILED,new Error('imToken不存在'))
      }
    });

    

    // 监听退出登录
    const offLogout = eventBus.on(BaseEventTypes.LOGOUT, () => {
      
      imService.logout()
      MqttClientManager.disconnect()

     
    });

    return () => {
      offLogin();
      offLogout();
    };
  }, []);

}