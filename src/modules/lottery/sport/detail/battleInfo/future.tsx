import OSSImage from '@/p138-react-common/components/Upload/OSSImage';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFootballCompetitionFuture } from 'src/api/interface/competition-football';
import { useLiveStore } from 'src/store';



type FutureMatchTableProps = {
    title: string;
    isHome?: boolean;
};
const headers = ['日期', '赛事', '对阵', '时间'];
const FutureMatchTable: React.FC<FutureMatchTableProps> = ({ title, isHome }) => {

    const [list, setList] = useState<ServerCommonLive.GetFootBallCompetitionFutureResult>();
    const {
        currentMatch
    } = useLiveStore();


    useEffect(() => {

        const dict: ServerCommonLive.GetFootBallCompetitionFutureCommandQuery = {
            competitionID: currentMatch?.competitionId ?? 0,
            competitionType: currentMatch?.competitionType ?? 'JC',
            lotteryName: currentMatch?.lotteryName ?? 'FootballLottery',
            leagueId: currentMatch?.leagueId ?? -1,

        }
        if (isHome) {
            dict.homeId = currentMatch?.homeId ?? -1;
        } else {
            dict.awayId = currentMatch?.awayId ?? -1;
        }
        getFootballCompetitionFuture(dict).then((res) => {
            setList(res.data);
        })
    }, [])

    return (
        <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 4, overflow: 'hidden', marginTop: 16 }}>
            {/* 标题 */}
            <View style={{ backgroundColor: '#f0f0f0', paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }}>
                <OSSImage
                    source={{ uri: isHome ? currentMatch?.homeLogo : currentMatch?.awayLogo }}
                    style={{ width: 30, height: 30, borderRadius: 10 }}
                />
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{isHome ? currentMatch?.home : currentMatch?.away}</Text>
            </View>

            {/* 表头 */}
            <View style={{ flexDirection: 'row', backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                {headers.map((header, index) => (
                    <View
                        key={header + index}
                        style={{
                            flex: 1,
                            paddingVertical: 10,
                            paddingHorizontal: 8,
                            borderRightWidth: index === headers.length - 1 ? 0 : 1,
                            borderRightColor: '#eee',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontWeight: '500', color: '#666', fontSize: 14 }}>{header}</Text>
                    </View>
                ))}
            </View>

            {/* 内容行 */}
            {list?.awayFutureList?.concat(list?.homeFutureList ?? []).map((item, idx) => (
                <View
                    key={item.competitionId}
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: idx === (list?.awayFutureList?.concat(list?.homeFutureList ?? []).length ?? 0) - 1 ? 0 : 1,
                        borderBottomColor: '#eee',
                        backgroundColor: '#fff',
                    }}
                >
                    <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#eee' }}>
                        <Text style={{ textAlign: 'center', color: '#333', fontSize: 14 }}>{item.competitionTime}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#eee' }}>
                        <Text style={{ textAlign: 'center', color: '#333', fontSize: 14 }}>{item.leagueName}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#eee' }}>
                        <Text style={{ textAlign: 'center', color: '#333', fontSize: 14 }}>
                            {item.home} vs {item.away}
                        </Text>
                    </View>
                    <View style={{ flex: 1, padding: 10 }}>
                        <Text style={{ textAlign: 'center', color: '#333', fontSize: 14 }}>{item.days} 天后</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default FutureMatchTable;
