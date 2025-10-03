import React  from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themeGrayColor, themeRedColor } from 'p138-react-common/utils/styles/color';
import { FONT_SIZES } from 'p138-react-common/utils/styles/theme';
import dayjs from 'dayjs';

import useLotteryResultStore from 'src/store/lottery/result';
import { matchPlayTabList } from '../../constants/lotteryResult';



const colorArray = [themeRedColor, themeGrayColor];
interface MatchListItemProps {
    item: LotteryDrawAnnouncement.SportsMatch;
}
const MatchListItem = (Props: MatchListItemProps) => {
    const { item } = Props;
   
    const { activeTab } = useLotteryResultStore();





    return (
        <View style={styles.matchInfo}>
            <View className="flex-row justify-between">
                <View className="flex-row gap-4">
                    <Text style={{ fontSize: FONT_SIZES.small }}>{item.matchNum}</Text>
                    <Text
                        style={{
                            fontSize: FONT_SIZES.small,
                            color: '#fff',
                            backgroundColor: item.leagueColor,
                            paddingHorizontal: 6,
                            borderRadius: 4,
                        }}
                    >
                        {item.leagueName}
                    </Text>
                </View>
                <View className="flex-row items-center gap-5">
                    <Text style={{ fontSize: FONT_SIZES.small }}>{item.home}</Text>
                    <Text style={{ fontSize: FONT_SIZES.small, color: themeRedColor }}>{item.matchScore}</Text>
                    <Text style={{ fontSize: FONT_SIZES.small }}>{item.away}</Text>
                </View>
            </View>

            <View className="flex-row justify-between">
                <Text style={{ width: 100, fontSize: FONT_SIZES.small, color: '#999' }}>
                    {dayjs(item.competitionTime).format('MM-DD HH:mm')}
                </Text>
                {activeTab === 'FootballLottery' && (
                    <Text style={{ fontSize: FONT_SIZES.small, color: '#999' }}>半场{item.halfMatchScore}</Text>
                )}
            </View>

            <View style={styles.bettingOptions}>
                {matchPlayTabList[activeTab]?.map((option) => (
                    <View key={option.label} style={[styles.bettingItem, { flex: 1 }]}>
                        <View
                            className="bg-[#FFEBE8] w-full items-center flex-row justify-center py-2"
                            style={activeTab === 'BasketballLottery' && { height: 40, flexDirection: 'column' }}
                        >
                            <Text style={{ fontSize: FONT_SIZES.small }}>{option.label}</Text>
                            <Text style={{ fontSize: FONT_SIZES.small }}>{option.rq && `(${item[option.rq]})`}</Text>
                        </View>
                        <View className="bg-[#f0f0f0] w-full items-center justify-center min-h-10">
                            {item[option.key]?.split('@').map((part, i) => (
                                <Text key={i} style={{ fontSize: FONT_SIZES.small, color: colorArray[i] }}>
                                    {part}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
   
    matchInfo: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ececec',
        shadowOffset: { width: 0, height: 2 },
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    bettingOptions: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },
    bettingItem: {
        alignItems: 'center',
    },
});

export default MatchListItem;
