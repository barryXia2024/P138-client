import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { useUserStore } from "src/store/user";
import { getBetList } from "src/api/interface/orders-bet";
import AppHeader from "@/p138-react-common/components/AppHeader";
import TabSwitcher from "@/p138-react-common/components/TabSwitcher";

import { FONT_SIZES } from "p138-react-common/utils/styles/theme";


import { transactionTabs } from "p138-react-common/dictionary/bet";
import { FlatList } from "p138-react-common/components/FlatList";
import { lotteryChineseNameMap } from "@/p138-react-common/constants/LotteryCommon";
import {  OrderTypeChineseNameMap } from "@/p138-react-common/constants/CommonChineseNameMap";

const BettingRecord = () => {
  const { tabType } = useLocalSearchParams();

  const [tab, setTab] = useState<CoreCommonEnum.OrderStatus | 0>(
    parseInt(tabType as string) as CoreCommonEnum.OrderStatus | 0
  );
  const [data, setData] = useState<ServerCoreOrder.ListOrderResult>();
  const { loginInfo } = useUserStore();
  const [page, setPage] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getBetList({
      userID: loginInfo?.userID!,
      orderStatus: tab === 0 ? undefined : tab,
      pageSize: page.pageSize,
      current: page.current,
    }).then((res) => {
      setData(res.data );
    });
  }, [tab, loginInfo?.userID]);
  return (
    <View style={styles.container}>
      <AppHeader title="投注记录" />
      <TabSwitcher<CoreCommonEnum.OrderStatus | 0>
        tabs={transactionTabs}
        activeTab={tab}
        onTabPress={setTab}
      />
      <FlatList
        data={data?.list ?? []}
        keyExtractor={(item) => item.orderId}
        className="mt-2"
        hasMore={(data?.list?.length ?? 0) < (data?.total ?? 0)}
        onLoadMore={()=>{

          return getBetList({
            userID: loginInfo?.userID,
            orderStatus: tab === 0 ? undefined : tab,
            pageSize: page.pageSize,
            current: page.current + 1,
          }).then((res) => {
            setData({
              ...data,
              list: [...data?.list, ...res.data?.list??[]],
              total: res.data?.total ?? 0,
            });
            setPage({
              current: page.current + 1,
              pageSize: page.pageSize,
            });
          });
        }}
        onRefresh={() => {
          return getBetList({
            userID: loginInfo?.userID,
            orderStatus: tab === 0 ? undefined : tab,
            pageSize: page.pageSize,
            current: 1,
          }).then((res) => {
            setData(res.data);
            setPage({
              current: 1,
              pageSize: page.pageSize,
            });
          });
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1}
            key={item.orderId}
            onPress={() =>
              router.push({
                pathname: "/bet/record/detail",
                params: { orderId: item.orderId },
              })
            }
            style={styles.recordItem}
          >
            <View style={styles.recordContent}>
              <Text style={styles.recordType}>
                {lotteryChineseNameMap[item.lotteryName]}
                <Text style={{ fontSize: FONT_SIZES.medium, color: "#999" }}>
                  ({OrderTypeChineseNameMap[item.orderType]}) {item.playType}
                </Text>
              </Text>
              <Text style={styles.recordStatus}>
                {item.orderStatusChinese}
              </Text>
            </View>
            <View style={styles.recordInfo}>
              <Text style={styles.recordAmount}>
                购买金额：
                <Text style={styles.highlight}>{item.betAmount}元</Text>
              </Text>
              <Text style={styles.recordTime}>
                {dayjs(item.orderTime).format("MM-DD HH:mm")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={<Text style={styles.noMoreText}>没有更多了</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },

  recordItem: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  recordContent: {
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordType: {
    fontSize: 12,
    color: "#333",
  },
  recordAmount: {
    fontSize: 12,
    color: "#666",
  },
  highlight: {
    color: "#f53b57",
    fontWeight: "bold",
  },
  recordInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recordStatus: {
    fontSize: 12,
    color: "#666",
  },
  recordTime: {
    fontSize: 12,
    color: "#999",
  },
  noMoreText: {
    textAlign: "center",
    padding: 10,
    color: "#999",
    fontSize: 12,
  },

});

export default BettingRecord;
