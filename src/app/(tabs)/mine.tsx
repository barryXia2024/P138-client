import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserBaseInfo, UserWallet, UserBetRecord, UserItemsGrid } from "src/modules/user";
import { LinearGradient } from "expo-linear-gradient";
import { useMineData } from "src/modules/user/hooks/mineData";
import HotFixed from "../personCenter/components/hotfix/HotFixed";
 
   

const MineScreen: React.FC = () => {
   
  useMineData()
  return (
    <LinearGradient colors={['#fee0f0', '#f0f0f0']} className='flex-1 bg-[#f0f0f0]'>
      <ScrollView style={{flex:1}}>
     
        <UserBaseInfo />
        <UserWallet />
        <UserBetRecord />
        <UserItemsGrid />
        <HotFixed />
      </ScrollView>
    </LinearGradient>
  );
};
 
export default MineScreen;
