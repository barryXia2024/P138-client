import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Floating } from "@/p138-react-common/components";
import { useUserStore } from "src/store";
import { router, usePathname } from "expo-router";
import { useIMStore } from "@/p138-react-common/OpenIM/store"; 
import { imService } from "@/p138-react-common/OpenIM/imService";

const ContactServer: React.FC = () => {
  const { loginInfo } = useUserStore();
  const serviceIds = loginInfo?.customerServiceIDS || [];
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // 从全局 store 获取会话
  const conversations = useIMStore((s) =>
    s.conversationIds.map((id) => s.conversations[id])
  );

  // 当前默认客服会话 ID（取第一个客服）
  const defaultServiceId = serviceIds[0]
    ? `si_${serviceIds[0]}_${loginInfo?.userID}`
    : undefined;

  // 未读数：只取当前客服会话
  const serviceUnread = useMemo(() => {
    if (!defaultServiceId) return 0;
    const conv = conversations.find((c) => c.conversationID === defaultServiceId);
    return conv?.unreadCount ?? 0;
  }, [conversations, defaultServiceId]);



  const handleContactShopker = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!loginInfo?.openIMToken) {
        Toast.show("请先登录");
        return;
      }

      // 确保已登录 IM
      const logged = await imService.autoLogin(loginInfo.userID);
      if (!logged) {
        Toast.show("IM 登录失败，请重试");
        return;
      }

      // 随机选一个客服 ID
      if (!serviceIds.length) {
        Toast.show("暂无可用客服");
        return;
      }
      const randomId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
      const singleConversationId = `si_${randomId}_${loginInfo?.userID}`;

      // 跳转到单聊页面
      router.push(`/chatV3/room?id=${singleConversationId}`);
    } catch (err) {
      console.error("联系店主失败", err);
      Toast.show("联系店主失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }, [loginInfo, serviceIds, isLoading]);

  // 条件隐藏
  if (!loginInfo?.openIMToken) return null;
  if (pathname?.includes("/chatV3/room")) return null;

  return (
    <Floating
      title={isLoading ? "加载中..." : "联系客服"}
      onPress={handleContactShopker}
      unreadCount={serviceUnread}
    />
  );
};

export default ContactServer;
