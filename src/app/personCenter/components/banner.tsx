import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BannerSection: React.FC = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>分享本店去赚钱</Text>
      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>立即分享</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f44336',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  bannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  shareButtonText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BannerSection;
