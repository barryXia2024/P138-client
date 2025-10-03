// components/FunctionGrid.tsx
import { router } from 'expo-router';
import { FONT_SIZES, ICON_SIZES } from 'p138-react-common/utils/styles/theme';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUserStore } from 'src/store/user';



const items: User.GridItems[] = [
  // {label: '合买记录',id:0},
  {label: '追号记录', screen: '/order/bet/chaseRecord', imageId: '2'},
  { label: '保存记录', screen: '/order/bet/saveList', imageId: '3' },
  { label: '店铺信息', screen: '/home/shop', imageId: '4' },
  {label: '我的消息',screen: '/personCenter/message',imageId:'4'},
  { label: '分享好友', screen: '/personCenter/invitedUser', imageId: '6' },
  { label: '帮助中心', screen: '/personCenter/helpCenter', imageId: '7' },
  { label: '我的资料', screen: '/personCenter/myProfile', imageId: '8' },
  // {label: '意见反馈',id:8},
  { label: '设置中心', screen: '/personCenter/setting', imageId: '14' },
  // { label: '组件预览', screen: '/playground', imageId: '1' },
  { label: '红单回查', screen: '/personCenter/redTicket', imageId: '13' },
  { label: '用户管理', screen: '/personCenter/userManage', imageId: '13' },
  // {label: '退出登录'},
];
const UserItemsGrid: React.FC<UserProps.UserItemsGridProps> = () => {
  const { resetUserStore,userInfo } = useUserStore();
  const itemImg: Record<string, number> = {
    1: require('src/assets/imgs/mine/mine1.png'),
    2: require('src/assets/imgs/mine/mine2.png'),
    3: require('src/assets/imgs/mine/mine3.png'),
    4: require('src/assets/imgs/mine/mine4.png'),
    5: require('src/assets/imgs/mine/mine5.png'),
    6: require('src/assets/imgs/mine/mine6.png'),
    7: require('src/assets/imgs/mine/mine7.png'),
    8: require('src/assets/imgs/mine/mine8.png'),
    10: require('src/assets/imgs/mine/mine10.png'),
    11: require('src/assets/imgs/mine/mine13.png'),
    13: require('src/assets/imgs/mine/red_order.png'),
    14: require('src/assets/imgs/mine/mine_setting.png'),
  }
    
  
  return (
    <View style={styles.gridContainer}>
      {items.map((func, index) => (
        <TouchableOpacity
          key={index}
          className={`items-center justify-center w-1/4 rounded-lg py-2  ${func.label==='用户管理'&&!userInfo.isAgent?'hidden':''}`}
          onPress={() => {
            if (func.label === '退出登录') {
              resetUserStore();
              router.replace('/Login');
            } else {
              func.screen && router.push(func.screen);
            }
          }}>
          <Image
            source={itemImg[func.imageId]}
            style={{ width: ICON_SIZES.medium, height: ICON_SIZES.medium }}
          />
          <Text style={{ fontSize: FONT_SIZES.small, color: '#000' }}>{func.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },

});

export default UserItemsGrid;
