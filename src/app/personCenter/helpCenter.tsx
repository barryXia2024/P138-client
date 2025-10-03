import AppHeader from '@/p138-react-common/components/AppHeader';
import { FONT_SIZES } from 'p138-react-common/utils/styles/theme';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Collapsible from 'react-native-collapsible'
 


const IconItem = (props: {
  item: GridItems;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const {item, style, textStyle, imageStyle} = props;
  return (
    <View style={[styles.itemCard, style]}>
      <Image
        source={typeof item.icon === 'string' ? {uri: item.icon} : item.icon}
        resizeMode="stretch"
        style={imageStyle ?? {width: 40, height: 40}}
      />
      <Text style={textStyle}>{item.label}</Text>
    </View>
  );
};
type GridItems = {
  label: string;
  screen?: string;
  icon: string | number;
};
const iconZc =
  'data:image/png;base64,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';
const iconCz = 'https://cfhduserh5.7lzbgyqb7u.com/static/img/detail/icon/2.png';
const iconGc =
  'data:image/png;base64,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';
const iconZj = 'https://cfhduserh5.7lzbgyqb7u.com/static/img/detail/icon/4.png';
const iconTk =
  'data:image/png;base64,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';
const iconQt =
  'data:image/png;base64,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';

const items: GridItems[] = [
  {label: '注册', screen: 'MyProfileScreen', icon: iconZc},
  {label: '充值', screen: 'BettingRecordSaveList', icon: iconCz},
  {label: '购彩', screen: 'StoreInfoScreen', icon: iconGc},
  {label: '中奖', screen: 'QRCodePage', icon: iconZj},
  {label: '提款', screen: 'HelpCenter', icon: iconTk},
  {label: '其他', screen: 'SettingScreen', icon: iconQt},
];
const topItems: GridItems[] = [
  {
    label: '资金安全',
    screen: 'MyProfileScreen',
    icon: require('src/assets/imgs/mine/icon_zijin.png'),
  },
  {
    label: '购彩保障',
    screen: 'BettingRecordSaveList',
    icon: require('src/assets/imgs/mine/icon_goucai.png'),
  },
  {
    label: '提款便携',
    screen: 'StoreInfoScreen',
    icon: require('src/assets/imgs/mine/icon_withdrawl.png'),
  },
];

const HelpCenter = () => {
  const [collapsed, setCollapsed] = React.useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);

  const toggleCollapse = (index: number) => {
    // 创建新的数组来更新状态
    setCollapsed(
      prevState => prevState.map((state, i) => (i === index ? !state : state)), // 只有点击的项会切换状态
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部区域 */}
      <AppHeader title="帮助中心" />
      <ScrollView contentContainerStyle={{paddingBottom:100}}>
        {/* 图标卡片 */}
        <View style={styles.cardContainer}>
          {topItems.map(item => (
            <IconItem
              item={item}
              textStyle={{fontSize:FONT_SIZES.small,color:'#fff'}}
            />
          ))}
        </View>

        <View
          style={{backgroundColor: '#fff', marginTop: -10, borderRadius: 8}}>
          <Text style={styles.sectionTitle}>问题类型</Text>
          <View className='flex-wrap flex-row justify-center'>
            {items.map(item => (
              <IconItem
                item={item}
                textStyle={{fontSize:FONT_SIZES.small,color:'#333'}}
              />
            ))}
          </View>
          {/* 常见问题 */}
        </View>
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          <TouchableOpacity onPress={() => toggleCollapse(1)}>
            <Text style={styles.question}>
              1.充值提示超限，或者提示无法向该商户付款
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={!collapsed[1]}>
            <Text style={styles.answer}>
              为了您更好的体验支付,防止被微信、支付宝风控限额,我们建议您按下面的方式中调整扫码支付的方式,
              可以在绝大部分交易中避免被风控。
              {'\n'}
              1.规则一:30分钟内,尽量不要连续刷3笔(包括失败交易)两笔交易时间间隔大于5分钟,交易金额尽量不要一样,可以略微调节;
              {'\n'}
              2.规则二:大额的充值或者付款尽量选择在非正常营业时间(21:00-次日9:00);
              {'\n'}
              3.规则三:不要重复提交相同金额的订单,不同交易的交易金额要不一样;
              {'\n'}
              4.规则四: 单笔交易金额尽量不要是整数,可以适当多加角或分;
              {'\n'}
              5.规则五:单卡单日交易总笔数不要过多,尽量不要失败:6.规则六:单笔交易金额不要过大,控制在1W以内,若需要超大额充值可以选择转账支付。
            </Text>
          </Collapsible>

          <TouchableOpacity onPress={() => toggleCollapse(2)}>
            <Text style={styles.question}>
              2.延期、中断、取消的比赛如何算奖
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={!collapsed[2]}>
            <Text style={styles.answer}>
              1.延期比赛如何处理:推迟时间未超过36小时,则正常算奖:推迟时间超过36小时或无法确定时间,则该场为无效场次,按比赛取消算奖:取消赛事算奖:单关固定玩法返还投注金额,过关投注该场赔率值按1.0计算奖金;
              {'\n'}
              2.中断比赛如何处理:36小时内继续完成比赛则正常算奖:36小时内未完成比赛则该场为无效场次.按比赛取消算奖;取消赛事算奖:单关固定玩法返还投注金额，过关投注该场赔率值按1.0计算奖金。
            </Text>
          </Collapsible>
          <TouchableOpacity onPress={() => toggleCollapse(3)}>
            <Text style={styles.question}>3. 中奖奖金如何扣税</Text>
          </TouchableOpacity>
          <Collapsible collapsed={!collapsed[3]}>
            <Text style={styles.answer}>
              根据管理机构的相关规定,中奖单注奖金超过1万元时,中奖人需要缴纳奖金的20%作为个人偶然所得税;税金由中心代扣代缴。选择倍投投注时,只要开奖后单注奖金不超过1万元,就算翻倍后奖金超过1万元，也无须缴纳个人偶然所得税。
            </Text>
          </Collapsible>
          <TouchableOpacity onPress={() => toggleCollapse(4)}>
            <Text style={styles.question}>4. 关于提款手续费</Text>
          </TouchableOpacity>
          <Collapsible collapsed={!collapsed[4]}>
            <Text style={styles.answer}>
              用户提款不收取任何提款手续费,提款所产生的银行手续费由店主为您承担(异常提款除外)。注:充值金额不能提现,中奖金额才可提现。
            </Text>
          </Collapsible>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpCenter;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    // marginBottom:100,
    // height:500,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4D4F',
    padding: 10,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FF4D4F',
  },
  card: {
    width: 80,
    height: 90,
    borderRadius: 10,
    // backgroundColor: '#FF4D4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: 80,
  },
  faqSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    // paddingBottom: 20,  // Add padding to the bottom to ensure full scroll when expanded
  },
  cardText: {
    color: 'white',
    marginTop: 10,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    marginLeft: 20,
    marginTop: 10,
  },
  question: {
    fontSize: 12,
    color: '#333',
    paddingLeft: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  answer: {
    fontSize: 10,
    color: '#555',
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  contactButton: {
    backgroundColor: '#FF4D4F',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
