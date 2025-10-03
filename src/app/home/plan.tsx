import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';

import AppHeader from '@/p138-react-common/components/AppHeader';
 

const GuaranteePlan = () => {
  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <AppHeader title="放心玩计划" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.ruleSection}>
          <Text style={styles.ruleTitle}>规则说明</Text>
          <Image
            style={styles.bannerImage}
            source={require('src/assets/imgs/home/home_plan_banner.webp')}
            resizeMode="stretch"
          />
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              虽然平台在店主入驻的时候做了非常严格的入驻审核机制，但是还有极少的用户反馈联系不上店主的情况发生，虽然这是小概率的事情，就算再低的风险发生率，一旦发生，对相关用户来说就意味着100%。所以平台特别推出“放心玩”用户保障计划！
            </Text>

            <Text style={styles.highlightTitle}>
              保障计划：{' '}
              <Text style={styles.highlightText}>
                店主失联，平台负责；中奖后店主不赔付，平台负责。
              </Text>
            </Text>

            <Text style={styles.highlightTitle}>
              资金来源：{' '}
              <Text style={styles.highlightText}>
                用户在跟单大厅跟单产生的佣金，作为用户保障计划的资金来源。
              </Text>
            </Text>

            <Text style={styles.highlightTitle}>
              申请入口：{' '}
              <Text style={styles.highlightText}>
                若用户需申请保障，可通过<Text style={[styles.highlightText,{fontWeight: '700'}]}>【我的{'>'}意见反馈】</Text>路径提交申请，平台将进行审核和确认，确保用户能够获得合理赔付。
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  contentContainer: {
    padding: 15,
  },
  ruleSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleTitle: {
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  bannerContainer: {
    marginBottom: 15,
  },
  bannerImage: {
    width: '95%',
    height: 120,
    borderRadius: 8,
    marginTop: 10,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    // elevation: 1,
  },
  description: {
    fontSize: 13,
    color: '#333',
    marginBottom: 10,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f44336',
    marginTop: 10,
  },
  highlightText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    lineHeight: 22,
    
  },
});

export default GuaranteePlan;
