import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import ActiveTab from 'src/modules/live/components/activeTab';

import { OFFENSE_DEFENSE_TYPE } from 'src/modules/lottery/constants/competitionDetail';
import ProgressBar from '../../football/ProgressBar';




const getRecordText = (win = 0, draw = 0, lost = 0) => `${win}胜${draw}平${lost}负`;

const getWinRate = (win: number, draw: number, lost: number): number => {
    const total = win + draw + lost;
    return total === 0 ? 0 : Math.round((win / total) * 100);
};

const BattleStatsSection = ({
    collapsed,
    setCollapsed,
    recordStatistic,
    statisticTen,
    setStatisticTen,
}: {
    collapsed: boolean,
    setCollapsed: (collapsed: boolean) => void
    recordStatistic: any;
    statisticTen: number;
    setStatisticTen: (v: number) => void;
}) => {
    const stat = recordStatistic?.recordStatistic?.[statisticTen] ?? {};
    const allStat = recordStatistic?.recordStatistic?.[0] ?? {};

    const homeFightRate = getWinRate(allStat.homeFightWin, allStat.homeFightDaw, allStat.homeFightLost);
    const awayFightRate = getWinRate(allStat.awayFightWin, allStat.awayFightDaw, allStat.awayFightLost);

    const homeCurrentRate = getWinRate(allStat.homeCurrentWin, allStat.homeCurrentDaw, allStat.homeCurrentLost);
    const awayCurrentRate = getWinRate(stat.awayCurrentWin, stat.awayCurrentDaw, stat.awayCurrentLost);

    return (
        <View>
            {/* 标题 */}
            <TouchableOpacity
                activeOpacity={1}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                onPress={() => setCollapsed(!collapsed)}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>战绩统计</Text>
                <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />
            </TouchableOpacity>

            <View style={{ display: collapsed ? 'none' : 'flex' }}>
                <View style={{ alignItems:'flex-end' }}>

                    <ActiveTab
                        style={{ width: 150 }}
                        activeList={[
                            { name: '近10场', value: OFFENSE_DEFENSE_TYPE.TEN },
                            { name: '近30场', value: OFFENSE_DEFENSE_TYPE.TWENTY },
                        ]}
                        value={statisticTen}
                        onChange={setStatisticTen}
                        height={40}
                    />
                </View>

                {/* 第一行：交锋 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text className='w-10'>{getRecordText(allStat.homeFightWin, allStat.homeFightDaw, allStat.homeFightLost)}</Text>
                    <ProgressBar style={{width:100}} value={homeFightRate} color="rgb(240, 75, 73)" isHideValue label="" />
                    <Text className='w-[80px]'>交锋</Text>
                    <ProgressBar style={{width:100}} value={awayFightRate} color="rgb(0, 122, 255)" isHideValue label="" leftOrRight="right" />
                    <Text>{getRecordText(allStat.homeCurrentWin, allStat.homeCurrentDaw, allStat.homeCurrentLost)}</Text>
                </View>

                {/* 第二行：近况 */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text>{getRecordText(allStat.awayFightWin, allStat.awayFightDaw, allStat.awayFightLost)}</Text>
                    <ProgressBar style={{width:100}} value={homeCurrentRate} color="rgb(240, 75, 73)" isHideValue label="" />
                    <Text>近况</Text>
                    <ProgressBar style={{width:100}} value={awayCurrentRate} color="rgb(0, 122, 255)" isHideValue label="" leftOrRight="right" />
                    <Text>{getRecordText(stat.awayCurrentWin, stat.awayCurrentDaw, stat.awayCurrentLost)}</Text>
                </View>
            </View>
        </View>
    );
};

export default BattleStatsSection;
