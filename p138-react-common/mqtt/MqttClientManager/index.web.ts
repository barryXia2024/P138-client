import mqtt, {MqttClient} from 'mqtt';
import {fetchMqttConfig} from '../config';

import {error, log, warn} from '../debug';
import {PublishOptions, RegisterOptions, TopicHandler} from '../types';
import {dispatcher} from '../dispatcher';
import {runInternalMiddlewares} from '../middleware';

import {env} from '@/config/env';
import {DeviceIdGenerator} from 'src/utils/device';

class MqttManager {
  private client: MqttClient | null = null;
  private userName = '';

  private cfg: ServerCoreAuth.MQTTToken | null = null;

  async connect(userName: string) {
    this.userName = userName;

    console.log('🔗 MQTT 开始连接:', {userName});
    await this.reconnectWithNewConfig();
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
    console.log('🔧 设置MQTT事件监听器');
    log('.....开始连接....');

    this.client.on('connect', () => {
      console.log('✅ MQTT 连接成功!');
      log('✅ 连接成功');
      dispatcher.getTopics().forEach(topic => this.subscribe(topic));
    });

    this.client.on('reconnect', () => {
      console.log('🔄 MQTT 正在重连...');
      log('🔁 正在重连...');
    });

    this.client.on('close', () => {
      console.log('❌ MQTT 连接关闭');
      warn('❌ 连接关闭');
    });

    this.client.on('error', err => {
      console.error('💥 MQTT 连接错误:', {
        message: err.message,
        stack: err.stack,
        fullError: err,
      });
      error('❌ 连接失败', err);
      // 如果是鉴权错误，直接关闭连接，避免死循环
      if (
        err?.message?.includes('Not authorized') ||
        err?.message?.includes('Connection refused')
      ) {
        console.log('🚫 检测到鉴权错误，停止重连');
        this.client?.end(true);
        this.client = null;
      }
    });

    this.client.on('message', async (topic, msg) => {
      console.log('📨 MQTT 收到消息:', {topic, message: msg.toString()});
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
    console.log('🔄 开始重新连接MQTT...');
    if (this.client) {
      console.log('🔌 关闭现有连接');
      this.client.end(true);
      this.client = null;
    }

    try {
      console.log('📡 获取MQTT配置...');
      const cfg = await fetchMqttConfig();
      console.log('✅ MQTT配置获取成功:', {
        websocketAddress: cfg.websocketAddress,
        username: cfg.username,
        topic: cfg.topic,
        expires_in: cfg.expires_in,
      });

      log('✅ fetchMqttConfig', cfg);
      this.cfg = cfg;
      const clientId = await this.buildClientId();

      const options: mqtt.IClientOptions = {
        keepalive: 60,
        clientId: clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        username: cfg.username, // 用户名
        password: cfg.token, // 密码
        clean: true,
        reconnectPeriod: 20000,
        connectTimeout: 30 * 1000,
      };

      console.log('🔗 MQTT连接参数:', {
        url: this.cfg.websocketAddress,
        clientId: clientId,
        options,
      });

      this.client = mqtt.connect(this.cfg.websocketAddress, options);
      console.log('📡 MQTT客户端创建成功:', this.client);

      this.setupEvents();
    } catch (err) {
      console.error('💥 MQTT配置获取失败:', err);
      throw err;
    }
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
    console.log('📝 注册MQTT主题:', {
      topic,
      options,
      isConnected: this.client?.connected,
    });
    dispatcher.register(topic, handler, options?.logKey);
    console.log('register', topic, handler, options, this.client?.connected);
    this.subscribe(topic, options?.qos);
  }

  unsubscribe(topic: string) {
    console.log('📝 取消订阅MQTT主题:', topic);
    dispatcher.unregister(topic);
    this.client?.unsubscribe(topic);
  }

  private subscribe(topic: string, qos: 0 | 1 | 2 = 0) {
    console.log('📥 订阅MQTT主题:', {topic, qos});
    this.client?.subscribe(topic, {qos}, err => {
      if (err) {
        console.error('❌ MQTT订阅失败:', {topic, error: err});
        error(`❌ 订阅失败 ${topic}`, err);
      } else {
        console.log('✅ MQTT订阅成功:', topic);
        log(`📥 已订阅 ${topic}`);
      }
    });
  }

  async publish(topic: string, payload: any, options?: PublishOptions) {
    console.log('📤 发布MQTT消息:', {topic, payload, options});
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
        this.client?.publish(topic, msg, {
          qos: options?.qos ?? 0,
          retain: options?.retain ?? false,
        });
        log(`[📤 发布][${options?.logKey || ''}]`, topic, payload);
      },
    });
  }

  disconnect() {
    console.log('🔌 断开MQTT连接');
    this.client?.end(true);
    this.client = null;
  }
}
const MqttClientManager = new MqttManager();
export default MqttClientManager;
