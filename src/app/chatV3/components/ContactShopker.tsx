import React, { useCallback, useMemo, useState } from "react";
import { Floating } from "@/p138-react-common/components";
import { router, usePathname } from "expo-router";

import { useUserStore } from "src/store";
import { imService } from "@/p138-react-common/OpenIM/imService";
import { useIMStore } from "@/p138-react-common/OpenIM/store"; // Zustand 全局会话

const ContactShopker: React.FC = () => {
  const { loginInfo } = useUserStore();
  const pathname = usePathname();

  // 全局会话（来自 zustand）
  const conversations = useIMStore((s) =>
    s.conversationIds.map((id) => s.conversations[id])
  );

  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState("");

  // 默认客服会话（按你们 si_ 约定）
  const defaultServiceConvId = useMemo(() => {
    const list = loginInfo?.customerServiceIDS || [];
    if (!list.length || !loginInfo?.userID) return "";
    return `si_${list[0]}_${loginInfo.userID}`;
  }, [loginInfo?.customerServiceIDS, loginInfo?.userID]);

  // 未读数：只看默认客服会话（或你想改成汇总也行）
  const serviceUnread = useMemo(() => {
    if (!defaultServiceConvId) return 0;
    const conv = conversations.find((c) => c.conversationID === defaultServiceConvId || c.id === defaultServiceConvId);
    // 兼容字段名：新 store 用 conversationID，旧 UI 可能用 id
    return conv?.unreadCount ?? 0;
  }, [conversations, defaultServiceConvId]);

  const handleContactShopker = useCallback(async () => {
    if (roomId) {
      router.push(`/chatV3/room?id=${roomId}`);
      return;
    }

    // 基础校验
    const serviceIds = loginInfo?.customerServiceIDS || [];
    const selfId = loginInfo?.userID;
    if (!selfId || !serviceIds.length) {
      console.warn("缺少 userID 或客服ID列表，无法建立会话");
      return;
    }

    setIsLoading(true);
    try {
      // 确保 IM 有效登录（imService 内部会做 token 校验/刷新/重试）
      const ok = await imService.autoLogin(selfId);
      if (!ok) {
        console.warn("IM 自动登录失败");
        return;
      }

      // 随机挑一个客服（或直接用第一个）
      const target = serviceIds[Math.floor(Math.random() * serviceIds.length)];
      const singleConversationId = `si_${target}_${selfId}`;

      // 不需要手动“创建会话”，首次发消息时 SDK 会自动创建；
      // 这里只做跳转，room 页面用 conversationId 渲染列表/发送消息即可。
      setRoomId(singleConversationId);
      router.push(`/chatV3/room?id=${singleConversationId}`);
    } catch (e) {
      console.error("联系客服失败", e);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, loginInfo?.customerServiceIDS, loginInfo?.userID]);

  // 未登录 IM：不显示浮窗（autoLogin 放到全局 App 初始化里，不在组件里做）
  // 这里仅用页面级兜底：若没 userID 也不显示
  if (!loginInfo?.userID) return null;

  // 在聊天页隐藏浮窗
  if (pathname?.includes("/chatV3/room")) return null;

  return (
    <Floating
      title={isLoading ? "加载中..." : "联系客服"}
      onPress={handleContactShopker}
      unreadCount={serviceUnread}
    />
  );
};

export default ContactShopker;
