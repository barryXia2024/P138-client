import {Client, ConnectOptions} from 'react-native-paho-mqtt';
import {fetchMqttConfig} from '../config';

import {error, log, warn} from '../debug';
import {PublishOptions, RegisterOptions, TopicHandler} from '../types';
import {dispatcher} from '../dispatcher';
import {runInternalMiddlewares} from '../middleware';

import {storageAdapter} from '@/p138-react-common/api/platforms/storage';
import {env} from '@/config/env';
import {DeviceIdGenerator} from 'src/utils/device';

// let client: Client | null = null;

const myStorage = {
  setItem: (key: string, item: string) => storageAdapter.setItem(key, item),
  getItem: (key: string) => storageAdapter.getItem(key),
  removeItem: (key: string) => storageAdapter.removeItem(key),
};

class MqttManager {
  private client: Client | null = null;
  private userName = '';

  private cfg: ServerCoreAuth.MQTTToken | null = null;
  private mssageCallback: (topic: string, payload: string) => void = () => {};

  async connect(userName: string) {
    this.userName = userName;
    console.log('🔗 MQTT 开始连接:', {userName});
    return await this.reconnectWithNewConfig();
  }

  private async buildClientId() {
    // return `mqtt/${this.platform}/${this.userId}/${topic.replace(/\//g, '-')}`;
    const deviceId = await new DeviceIdGenerator().getDeviceIdWithUserName(
      this.userName,
    );
    console.log('📱 设备ID生成:', {deviceId, userName: this.userName});
    const baseClientId = env.MQTT_Base_ClientID;
    const clientId = `${baseClientId}/${this.userName}/${deviceId}`;
    console.log('🆔 完整ClientID:', clientId);
    return clientId;
    // return `mqtt/${this.platform}/${this.userName}/${deviceId}`;
  }

  private setupEvents() {
    if (!this.client) return;
    log('✅ 开始链接connect mqtt', this.client);
    // this.client.on('connect', () => {
    //   log('✅ 连接成功');
    //   dispatcher.getTopics().forEach(topic => this.subscribe(topic));
    // });

    this.client.on('connectionLost', responseObject => {
      console.log(
        '[MQTT] ❌ connectionLost%%%:',
        responseObject.errorMessage,
        responseObject,
      );
      if (responseObject.errorCode !== 0) {
        error('❌ connectionLost连接失败', responseObject.errorMessage);
      } else {
        log('✅ connectionLost连接成功');
      }
    });
    this.client.on('messageReceived', async msg => {
      console.log('messageReceived', msg.payloadString);
      const raw = msg.payloadString;
      if (this.cfg?.topic) {
        console.log('messageReceived', this.cfg?.topic, msg.payloadString);
        this.mssageCallback(this.cfg?.topic, raw);
      }

      await runInternalMiddlewares({
        topic: this.cfg?.topic || '',
        payload: raw,
        direction: 'incoming',
        next: () => dispatcher.dispatch(this.cfg?.topic || '', raw),
      });
    });

    this.client.on('reconnect', () => log('🔁 正在重连...'));
    this.client.on('close', () => warn('❌ 连接关闭'));
    this.client.on('error', err => error('❗ 错误', err));
    this.client.on('message', async (topic, msg) => {
      const raw = msg.toString();

      await runInternalMiddlewares({
        topic,
        payload: raw,
        direction: 'incoming',
        next: () => dispatcher.dispatch(topic, raw),
      });
    });
  }

  async reconnectWithNewConfig() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
      return Promise.resolve(false);
    }

    return fetchMqttConfig().then(async cfg => {
      log('✅ fetchMqttConfig', cfg);
      this.cfg = cfg;
      const clientId = await this.buildClientId();

      const options: ConnectOptions = {
        keepAliveInterval: 30,
        // uris: [this.cfg.websocketAddress],
        mqttVersion: 4,
        userName: cfg.username, // 用户名
        password: cfg.token, // 密码
        cleanSession: true,
        timeout: 30 * 1000,
      };

      this.client = new Client({
        uri: this.cfg.websocketAddress,
        clientId: clientId,
        storage: myStorage,
      });

      console.log(
        'mqtt connect start',
        this.cfg.websocketAddress,
        clientId,
        options,
      );
      this.client
        .connect(options)
        .then(res => {
          log('✅ 链接成功111', res);
          this.setupEvents();
          return Promise.resolve(true);
        })
        .catch(err => {
          error('❌ 链接失败', err);
          return Promise.resolve(false);
        });
      log('✅ 开始链接connectionLost mqtt', this.client, options);
    });
  }
  async getCfg() {
    if (!this.cfg) {
      return fetchMqttConfig().then(cfg => {
        this.cfg = cfg;
        return cfg;
      });
    }
    return Promise.resolve(this.cfg);
  }

  register(topic: string, handler: TopicHandler, options?: RegisterOptions) {
    // dispatcher.register(topic, handler, options?.logKey);
    console.log(
      'registe11r',
      topic,
      handler,
      options,
      this.client?.isConnected(),
    );
    this.mssageCallback = handler;
    return this.subscribe(topic, options?.qos);
  }

  unsubscribe(topic: string) {
    dispatcher.unregister(topic);
    this.client?.unsubscribe(topic);
  }

  private subscribe(topic: string, qos: 0 | 1 | 2 = 2) {
    log('开始订阅....', topic, qos);
    return this.client
      ?.subscribe(topic, {qos})
      .then(res => {
        log('✅ 订阅成功', topic, qos, res);
        return res;
      })
      .catch(err => {
        error('❌ 订阅失败', err);
        return Promise.reject(err);
      });
  }

  async publish(topic: string, payload: any, options?: PublishOptions) {
    const original =
      typeof payload === 'string'
        ? payload
        : JSON.parse(JSON.stringify(payload));
    await runInternalMiddlewares({
      topic,
      payload: original,
      direction: 'outgoing',
      logKey: options?.logKey,
      next: () => {
        const msg =
          typeof original === 'string' ? original : JSON.stringify(original);
        this.client?.send(
          topic,
          msg,
          options?.qos ?? 0,
          options?.retain ?? false,
        );
        log(`[📤 发布][${options?.logKey || ''}]`, topic, payload);
      },
    });
  }

  disconnect() {
    this.client?.disconnect();
    this.client = null;
  }
}
const MqttClientManager = new MqttManager();
export default MqttClientManager;
