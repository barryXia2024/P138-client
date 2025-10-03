import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';

import AppHeader from '@/p138-react-common/components/AppHeader';

import dayjs from 'dayjs';
import {
  deleteLotteryOrderOrSchemeByOrderId,
  getBetList,
} from 'src/api/interface/orders-bet';

import {router} from 'expo-router';
import {lotteryChineseNameMap} from '@/p138-react-common/constants/LotteryCommon';
import {useUserStore} from 'src/store';
import CheckBox from 'src/components/checkBox';
import CustomAlertDialog from '@/p138-react-common/components/CustomAlertDialog';

const BettingRecordSaveList = () => {
  const [data, setData] = useState<ServerCoreOrder.ListOrderResult>();
  const {loginInfo} = useUserStore();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getBetList({
      userID: loginInfo?.userID,
 
    }).then(res => {
      setData(res.data);
    });
  }, [loginInfo?.userID]);

  // 全选状态
  const isAllSelected = Boolean(
    data?.list &&
      data.list.length > 0 &&
      selectedItems.length === data.list.length,
  );

  // 处理单个项目选择
  const handleItemSelect = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, orderId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== orderId));
    }
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allOrderIds = data?.list?.map(item => item.orderId) || [];
      setSelectedItems(allOrderIds);
    } else {
      setSelectedItems([]);
    }
  };

  // 处理删除
  const handleDelete = () => {
    if (selectedItems.length === 0) {
      Toast.show('请选择要删除的项目');
      return;
    }
    Promise.all(
      selectedItems.map(item =>
        deleteLotteryOrderOrSchemeByOrderId({orderId: item}),
      ),
    ).then(res => {
      if (res.every(item => item.success)) {
        Toast.show('删除成功');
        setSelectedItems([]);
        getBetList({
          userID: loginInfo?.userID,
        
        }).then(res => {
          setData(res.data);
        });
      }
    });
  };

  // 退出编辑模式时清空选择
  const handleEditToggle = () => {
    setIsEdit(!isEdit);
    if (isEdit) {
      setSelectedItems([]);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="保存记录"
        rightComponent={
          <TouchableOpacity onPress={handleEditToggle}>
            <Text className="text-white p-2">{isEdit ? '取消' : '编辑'}</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={data?.list}
        keyExtractor={item => item.orderId}
        renderItem={({item}) => (
          <View className="flex-row flex-1">
            {isEdit && (
              <CheckBox
                className="p-1"
                checked={selectedItems.includes(item.orderId)}
                onChange={checked => handleItemSelect(item.orderId, checked)}
              />
            )}
            <TouchableOpacity
              className="flex-1"
              activeOpacity={1}
              onPress={() =>
                router.push({
                  pathname: '/order/bet/detail',
                  params: {orderId: item.orderId},
                })
              }
              style={styles.recordItem}>
              <View style={styles.recordContent}>
                <Text style={styles.recordTime}>
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Text>

                <Text style={styles.recordStatus}>
                  {item.orderStatusChinese}
                </Text>
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordType}>
                  <Text className="font-bold">
                    {' '}
                    {lotteryChineseNameMap[item.lotteryName]}{' '}
                  </Text>{' '}
                  {item.betPlay}
                </Text>
                <Text style={styles.recordAmount}>
                  <Text style={styles.highlight}>{item.betAmount}元</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={<Text style={styles.noMoreText}>没有更多了</Text>}
      />
      {isEdit && (
        <View style={styles.editCheckBox}>
          <CheckBox
            label="全选"
            size={20}
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
          <CustomAlertDialog
            open={isModalVisible}
            trigger={
              <Button
                color="red"
                title={`删除(${selectedItems.length})`}
                onPress={() => {
                  setIsModalVisible(true);
                }}
              />
            }
            title="提示"
            description={`确认删除 ${selectedItems.length} 个订单吗？`}
            confirmText="确定"
            cancelText="取消"
            onConfirm={() => {
              setIsModalVisible(false);
              handleDelete();
            }}
            onCancel={() => setIsModalVisible(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  editCheckBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  recordItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  recordContent: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordType: {
    fontSize: 14,
    color: '#333',
  },
  recordAmount: {
    fontSize: 12,
    color: '#666',
  },
  highlight: {
    color: '#f53b57',
    fontWeight: 'bold',
  },
  recordInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordStatus: {
    fontSize: 12,
    // color: '#666',
  },
  recordTime: {
    fontSize: 12,
    // color: '#999',
  },
  noMoreText: {
    textAlign: 'center',
    padding: 10,
    color: '#999',
    fontSize: 12,
  },
});

export default BettingRecordSaveList;
