
/**
 * 19位雪花算法配置
 */
export const SNOWFLAKE_CONFIG = {
  // Twitter Snowflake 的纪元时间戳 (2010-11-04 01:42:54.657 UTC)
  EPOCH: 1288834974657,

  // 节点 ID 的位数 (10 bits)
  NODE_BITS: 10,
  // 序列号的位数 (12 bits)
  STEP_BITS: 12,

  // 计算最大节点值: 2^10 - 1 = 1023
  NODE_MAX: (-1 ^ (-1 << 10)),
  // 序列号最大值: 2^12 - 1 = 4095
  STEP_MASK: (-1 ^ (-1 << 12)),

  // 时间戳左移位数: NODE_BITS + STEP_BITS = 22
  TIME_SHIFT: 22,
  // 节点 ID 左移位数: STEP_BITS = 12
  NODE_SHIFT: 12
}

async function getDeviceId(): Promise<number> {
  const deviceId = await localStorage.getItem('deviceId');
  if (!deviceId) {
    // 使用 NODE_MAX (1023) 作为最大值
    // 生成 0-1023 之间的随机数作为设备ID
    const newDeviceId = Math.floor(Math.random() * (SNOWFLAKE_CONFIG.NODE_MAX + 1)).toString();
    await localStorage.setItem('deviceId', newDeviceId);
    return parseInt(newDeviceId);
  }
  return parseInt(deviceId);
}

/**
 * 雪花算法单例类
 */
class Snowflake {
  private static instance: Snowflake;
  private deviceId: number = 0; // 初始化 deviceId
  private lastTimestamp: number = 0;
  private sequence: number = 0;

  private constructor() {
    getDeviceId().then(id => this.deviceId = id);
  }

  public static getInstance(): Snowflake {
    if (!Snowflake.instance) {
      Snowflake.instance = new Snowflake();
    }
    return Snowflake.instance;
  }

  /**
   * 生成19位ID
   * 格式: 时间戳(13位) + 设备ID(3位) + 序列号(3位)
   */
  public nextId(): string {
    let timestamp = Date.now();

    if (timestamp < this.lastTimestamp) {
      throw new Error("时钟回拨，拒绝生成ID");
    }

    if (timestamp === this.lastTimestamp) {
      // 使用 STEP_MASK (4095) 作为序列号最大值
      this.sequence = (this.sequence + 1) & SNOWFLAKE_CONFIG.STEP_MASK;
      if (this.sequence === 0) {
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    // 使用位运算生成ID
    const id = BigInt(timestamp) << BigInt(SNOWFLAKE_CONFIG.TIME_SHIFT) |
               BigInt(this.deviceId) << BigInt(SNOWFLAKE_CONFIG.NODE_SHIFT) |
               BigInt(this.sequence);
    return id.toString();
  }

  private waitNextMillis(lastTimestamp: number): number {
    let timestamp = Date.now();
    while (timestamp <= lastTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }
}

/**
 * 生成19位雪花ID
 */
export function generateSnowflakeId(): string {
  return Snowflake.getInstance().nextId();
}

/**
 * 解析雪花ID
 */
export function parseSnowflakeId(id: string): {
  timestamp: Date;
  nodeId: number;
  sequence: number;
} {
  const bigIntId = BigInt(id);
  
  const timestamp = Number(bigIntId >> BigInt(SNOWFLAKE_CONFIG.TIME_SHIFT)) + SNOWFLAKE_CONFIG.EPOCH;
  const nodeId = Number((bigIntId >> BigInt(SNOWFLAKE_CONFIG.NODE_SHIFT)) & BigInt(SNOWFLAKE_CONFIG.NODE_MAX));
  const sequence = Number(bigIntId & BigInt(SNOWFLAKE_CONFIG.STEP_MASK));

  return {
    timestamp: new Date(timestamp),
    nodeId,
    sequence
  };
}
