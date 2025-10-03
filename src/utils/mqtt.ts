// import { getDeviceId } from "@/p138-react-common/utils/deviceUtils";
// import mqtt from "mqtt";

// export const contact = async (topic: string) => {
//   const clientId = "mqtt/client/1938524364958523392";

//   const host = "ws://192.168.31.249:8083/mqtt";

//   const setupEventHandlers = (client: mqtt.MqttClient): void => {
//     if (!client) return;

//     client.on("connect", () => {
//       console.log("MQTT连接成功");
     
//     });

//     client.on("message", (topic: string, message: Buffer) => {
//       const jsonString = message.toString('utf8');
//       const jsonData = JSON.parse(jsonString);
//       console.log("MQTT消息:", topic, jsonData);
      
//     });

//     client.on("error", (error) => {
//       console.error("MQTT错误:", error);
     
//     });

//     client.on("close", () => {
//       console.log("MQTT连接关闭");
     
//     });

//     client.on("reconnect", () => {
//       console.log("MQTT重新连接中...");
//     });
//   }

//   const options: mqtt.IClientOptions = {
//     keepalive: 60,
//     clientId: clientId,
//     protocolId: "MQTT",
//     protocolVersion: 4,
//     username: "admin", // 用户名
//     password: "admin ", // 密码
//     clean: true,
//     reconnectPeriod: 1000,
//     connectTimeout: 30 * 1000,
//     query: {
//       deviceId:await getDeviceId(),
   
  
//     },

//     will: {
//       topic: topic,
//       payload: "Connection Closed abnormally..!",
//       qos: 0,
//       retain: false,
      
//     },
//   };

//   // return
//   const client = mqtt.connect(host, options); // 使用用户名和密码连接
//   // setSocket(client);

//   client.on("connect", () => {
//     console.log("Connected to MQTT broker");
//     client.subscribe(topic, (err) => {
//       setupEventHandlers(client);
//       if (err) {
//         console.log("Failed to subscribe:", err);
//       } else {
//         console.log("Subscribed to chat/topic");
//       }
//     });
//   });


  
// };
