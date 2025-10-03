import { appConfig } from 'src/config';
import {loopTaskManager} from '../taskManager/LoopTaskManager';
import MqttClientManager from './MqttClientManager';
import request from 'src/api/request';

const mqttRefreshTokenApi = ()=>{
  if(appConfig.platform=='business'){
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.MQTTToken>>({ method: 'GET', url: '/api/v1/auth/mqtt/refresh-token' })
   
  }else{
    return request<BasicTypes.DefaultResponseWrapper<ServerCoreAuth.MQTTToken>>({ method: 'GET', url: '/api/v1/users/auth/mqtt/refresh-token' })
  }
}

let lastRefreshTaskKey = 'mqtt_config_refresh';
export async function fetchMqttConfig(): Promise<ServerCoreAuth.MQTTToken> {
  const res = await mqttRefreshTokenApi();
  if (!res.success) {
    // throw new Error(res.data?.message ?? 'mqttRefreshTokenApi error');
    Toast.show(res.data?.message ?? 'mqttRefreshTokenApi error');
    return Promise.reject(res.data?.message ?? 'mqttRefreshTokenApi error');
  }
  if (!res.data) {
    throw new Error('mqttRefreshTokenApi data is null');
  }
  const data = res.data;
  if (!data) {
    throw new Error('mqttRefreshTokenApi data is null');
  }
  console.log('mqttRefreshTokenApi', data);

  const now = Math.floor(Date.now() / 1000);
  const expiry = now + data.expires_in;

  const cfg: ServerCoreAuth.MQTTToken = {...data, expiry};

  loopTaskManager.register({
    key: lastRefreshTaskKey,
    intervalSec: data.expires_in - 5,
    once: true,
    callback: () => MqttClientManager.reconnectWithNewConfig(),
  });

  return cfg;
}
