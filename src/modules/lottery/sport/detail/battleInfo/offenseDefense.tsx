import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


import { getFootballOffenseDefense } from 'src/api/interface/competition-football';
import { useLiveStore } from 'src/store';
import { Image } from 'expo-image';
import ActiveTab from 'src/modules/live/components/activeTab';
import { StatisticsBar } from '../statistics';

export enum OFFENSE_DEFENSE_TYPE {
    TEN = 0,
    TWENTY = 1,
}
type OffenseDefenseProps = {
    collapsed: boolean,
    setCollapsed: (collapsed: boolean) => void
}

// getFootballRecord
const OffenseDefense: React.FC<OffenseDefenseProps> = ({ collapsed, setCollapsed }) => {
    const [offenseDefense, setOffenseDefense] = useState<ServerCommonLive.FootBallCompetitionOffenseDefense>();
    const [type, setType] = useState<OFFENSE_DEFENSE_TYPE>(OFFENSE_DEFENSE_TYPE.TEN);
    const {
        currentMatch
    } = useLiveStore();

    useEffect(() => {
        const dict: ServerCommonLive.GetFootBallCompetitionOffenseDefenseCommandQuery = {
            competitionType: currentMatch?.competitionType ?? 'JC',
            lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
            awayId: currentMatch?.awayId ?? 0,
            competitionID: currentMatch?.competitionId ?? 0,
            homeId: currentMatch?.homeId ?? 0,
            leagueId: currentMatch?.leagueId ?? 0,
        }
        getFootballOffenseDefense(dict).then((res) => {
            setOffenseDefense(res.data);
        })
    }, [])




    return (
        <View>
            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => setCollapsed(!collapsed)}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>攻防对比</Text>
                <Image source={require('src/assets/imgs/down1.png')} style={{ width: 16, height: 16 }} />
            </TouchableOpacity>
            <View style={{ display: collapsed ? 'none' : 'flex' }}>
                <ActiveTab
                    activeList={[{ name: '近10场', value: OFFENSE_DEFENSE_TYPE.TEN }, { name: '近20场', value: OFFENSE_DEFENSE_TYPE.TWENTY }]}
                    value={type}
                    onChange={(value) => {
                        setType(value);
                    }}
                    height={40}
                    style={{ width: '50%' }}
                />
                <StatisticsBar home={offenseDefense?.homeOffenseDefenseList?.[type]?.totalGoalNum ?? 0} away={offenseDefense?.awayOffenseDefenseList?.[type]?.totalGoalNum ?? 0} label={'总进球数'} />
                <StatisticsBar home={offenseDefense?.homeOffenseDefenseList?.[type]?.totalGoalLostNum ?? 0} away={offenseDefense?.awayOffenseDefenseList?.[type]?.totalGoalLostNum ?? 0} label={'总失球数'} />
                <StatisticsBar home={offenseDefense?.homeOffenseDefenseList?.[type]?.avgGoalNum ?? 0} away={offenseDefense?.awayOffenseDefenseList?.[type]?.avgGoalNum ?? 0} label={'场均进球数'} />
                <StatisticsBar home={offenseDefense?.homeOffenseDefenseList?.[type]?.avgGoalLostNum ?? 0} away={offenseDefense?.awayOffenseDefenseList?.[type]?.avgGoalLostNum ?? 0} label={'场均失球数'} />
                <StatisticsBar home={offenseDefense?.homeOffenseDefenseList?.[type]?.shootNum ?? 0} away={offenseDefense?.awayOffenseDefenseList?.[type]?.shootNum ?? 0} label={'射门次数'} />
                <StatisticsBar home={offenseDefense?.homeOffenseDefenseList?.[type]?.shootTargetNum ?? 0} away={offenseDefense?.awayOffenseDefenseList?.[type]?.shootTargetNum ?? 0} label={'射正次数'} />
            </View>

        </View>

    )
};

export default OffenseDefense; 