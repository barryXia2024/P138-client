import { StyleSheet, View } from "react-native";
import { Text } from "tamagui";
import dayjs from "dayjs";
import IconLock from 'src/assets/imgs/gendan/icon_lock.svg'
import { useUserStore } from "src/store";
/**
 * 竞彩跟单投注信息
 */
export const Sport = ({ orderInfo }: { orderInfo: CommonFollowHall.GetTrackingOrderItemResult }) => {
    const betInfoList = orderInfo?.betContentSportsLotteryList ?? [];
    const {loginInfo} = useUserStore()

    const isEnd = dayjs().isAfter(dayjs(orderInfo?.buyEndTime ?? undefined));
    const isMine = orderInfo.userID ===loginInfo?.userID
    const isPublic = (orderInfo.programContent === 1 && isEnd) || orderInfo.programContent === 2 || isMine;


    return (
        <View className="  " >
            <View className="mt-2 flex-row justify-between items-center   ">
                <View className="flex-1 flex-row gap-2">
                    <Text className="text-red-500" style={{ fontSize: 16, color: '#333', lineHeight: 24 }}>
                        投注信息
                    </Text>
                    <Text className="text-white bg-[#01b0ff] rounded-md p-1" style={{ color: "#fff" }}>{betInfoList.length}场</Text>
                    <Text className="text-white bg-[#169e16] rounded-md p-1" style={{ color: "#fff" }}>{orderInfo?.bettingString ?? '单关'}</Text>
                    <Text className="text-white bg-[#fe9f01] rounded-md p-1" style={{ color: "#fff" }}>{orderInfo?.betMultiple}倍</Text>
                </View>
                {!isEnd && <View className="gap-2">
                    <Text
                        className="text-red-500"
                        style={{ fontSize: 14, color: '#333', lineHeight: 18, textAlign: 'right' }}
                    >
                        截止时间
                    </Text>
                    <Text className="text-white  border rounded-md p-1 " style={{
                        color: 'rgb(145, 220, 253)',
                        backgroundColor: 'rgb(231, 247, 255)',
                        borderColor: 'rgb(145, 220, 253)',
                        fontSize: 10
                    }}>
                        {dayjs(orderInfo?.buyEndTime ?? undefined).format('MM-DD HH:mm')}
                    </Text>
                </View>}
            </View>

            <View style={{ flex: 1, marginTop: 10 }}>
                {/* 表头 */}
                <View style={[styles.row, styles.head]}>
                    {['场次', '对阵', '玩法', '投注内容'].map((header, index) => (
                        <Text key={index} style={[styles.cell, styles.headText, { borderColor: '#fff' }]}>
                            {header}
                        </Text>
                    ))}
                </View>
                {orderInfo.programContent === 1 && !isEnd &&!isMine&& <View style={[styles.row, styles.head, { height: 70, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }]}>
                    <IconLock width={16} height={16} />
                    <Text  >

                        截止后公开
                    </Text>
                </View>}


                {/* 表格行 */}
                {isPublic && betInfoList.map((item, rowIndex) => (
                    <View key={rowIndex} style={[styles.row,{flex:1}]}>
                        <View style={styles.cell}>
                            <Text style={{ textAlign: 'center' }}>{item.competitionSessions}</Text>
                        </View>
                        <View style={[styles.cell, { flex: 1 }]}>
                            <Text style={{ textAlign: 'center' }}>
                                {item.home + '\n' + 'vs' + '\n' + item.away}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={{ textAlign: 'center' }}>
                                {item.betPlayList?.map(play => play.betPlay).join('\n')}
                            </Text>
                        </View>
                        <View style={styles.cell}>
                            {item.betPlayList?.map((play, idx) => (
                                <Text key={idx} className="text-center" style={{ color: play.hasHit ? 'red' : 'black', textAlign: 'center' }}>
                                    {play.betItem}
                                    {'\n'}
                                    ({play.betOdds})
                                    {'\n'}
                                </Text>
                            ))}
                        </View>
                    </View>
                ))}

                <Text className="text-red-500  mt-2" style={{textAlign:'center'}}>
                    预计最高回报：{Number(orderInfo?.returnMultiple).toFixed(2)}倍
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderColor: '#f0f0f0',
        borderBottomWidth: 1, // 底部分割线
    },
    cell: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
        padding: 4,
        borderRightWidth: 1, // 右边分割线
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontWeight: 'bold',
        borderColor: '#f0f0f0',
    },
    head: {
        backgroundColor: '#f0f0f0',
    },
    headText: {
        fontWeight: 'bold',
        flex: 1
    },
});
