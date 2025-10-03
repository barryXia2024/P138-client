
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFootballRecord } from 'src/api/interface/competition-football';
import { StatisticType, VS_TYPE } from 'src/modules/lottery/constants/competitionDetail';

import { useLiveStore } from 'src/store';


const StatistiCsView = (props: CompetitionProps.StatistiCsViewProps) => {
    const {
        currentMatch
    } = useLiveStore();

    const [recordList, setRecordList] = useState<ServerCommonLive.CompetitionRecordList>();
    useEffect(() => {

        const dict: ServerCommonLive.GetFootBallCompetitionRecordCommandQuery = {
            competitionID: currentMatch?.competitionId ?? 0,
            competitionType: currentMatch?.competitionType ?? 'JC',
            lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
            leagueId: props.leagueId,
        }
        if (props.statisticType == StatisticType.HOME) {
            dict.homeId = currentMatch?.homeId ?? 0;
        } else if (props.statisticType == StatisticType.AWAY) {
            dict.awayId = currentMatch?.awayId ?? 0;
        }
        if (props.statisticType === StatisticType.HOME_AWAY) {
            dict.homeId = currentMatch?.homeId ?? 0;
            dict.awayId = currentMatch?.awayId ?? 0;
        }

        getFootballRecord(dict).then((res) => {
            setRecordList(res.data)
            if (res.data) {
                props.onChange?.(res.data)
            }
        })
    }, [props.leagueId])


    if (!recordList) return null;
    return (
        <View>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text style={{ flex: 2, color: '#888', fontWeight: 'bold' }}>日期/赛事</Text>
                <Text style={{ flex: 5, color: '#888', fontWeight: 'bold', textAlign: 'center' }}>对阵比分</Text>
                <Text style={{ flex: 1, color: '#888', fontWeight: 'bold', textAlign: 'center' }}>赛果</Text>
                <Text style={{ flex: 1, color: '#888', fontWeight: 'bold', textAlign: 'center' }}>盘路</Text>
            </View>
            {recordList?.competitionList?.filter((row) => {
                if (props.vsType === VS_TYPE.ALL) return true;
                if (props.vsType === VS_TYPE.HOME) return row.home === currentMatch?.home;
                if (props.vsType === VS_TYPE.AWAY) return row.away === currentMatch?.away;
                return false;
            }).map((row, idx) => (
                <View key={row.competitionId + idx + row.awayId + row.homeId} style={{ flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, borderColor: '#eee' }}>
                    <Text style={{ flex: 2, color: '#222', textAlign: 'center' }}>{row.competitionTime} {row.leagueName}</Text>
                    <Text style={{ flex: 5, color: '#222', textAlign: 'center' }}>{row.home}<Text style={{ fontWeight: 'bold' }}> {row.matchScore} </Text> {row.away}</Text>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#fff', textAlign: 'center', borderRadius: 3, padding: 5, backgroundColor: row.result === '胜' ? '#e55' : row.result === '负' ? '#189d18' : '#4c95e4', }}>{row.result}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center' }}>{row.asiaHandicap}</Text>
                        <Text style={{ color: row.asiaHandicapResult === '赢' ? '#e55' : row.asiaHandicapResult === '输' ? '#19b5fe' : '#888', textAlign: 'center' }}>{row.asiaHandicapResult}</Text>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default StatistiCsView;