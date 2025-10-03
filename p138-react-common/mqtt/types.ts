export type CooperationMessage = {
  id: string;
  createdAt: number;
  updatedAt: number;
  version: number;
  shopCode: number;
  cooperationShopCode: number;
  reviewShopCode: number;
  reviewStatus: CoreCommonEnum.ReviewStatus;
  applyUserID: string;
  applyUserName: string;
  reviewUserID: string;
  reviewUserName: string;
  cooperateAgreementUrl: string;
  lotteryList: ServerCoreCooperation.LotteryInfo[];
  cooperationCommissionRate: string;
  refuseReason: string;
  msgID: string;
};

export type TopicHandler = (
  topic: string,
  payload: any,
  context?: {logKey?: string},
) => void;

export interface RegisterOptions {
  qos?: 0 | 1 | 2;
  logKey?: string;
}

export interface PublishOptions {
  qos?: 0 | 1 | 2;
  retain?: boolean;
  logKey?: string;
}

export interface MqttMiddlewareContext {
  topic: string;
  payload: any;
  direction: 'incoming' | 'outgoing';
  logKey?: string;
  next: () => void;
}

export interface MqttPayload {
  messageID: string;          // 消息ID
  messageStatusID: string;    // 消息状态ID
  userID: string;             // 用户ID
  userType: number;           // 用户类型
  deviceID: string;           // 设备ID
  shopCode: number;           // 门店/商户代码
  msgType: number;            // 消息类型
  msgTypeName: string;        // 消息类型名称
  msgSubType: number;         // 消息子类型
  msgSubTypeName: string;     // 消息子类型名称
  createdAt: number;          // 创建时间（时间戳，毫秒）
  status: number;             // 状态
  orderNo: string;            // 订单编号
  content: string;            // 内容（HTML 字符串）
  title: string;              // 标题
  remark: string;             // 备注
}

export type MqttMiddleware = (ctx: MqttMiddlewareContext) => void;
