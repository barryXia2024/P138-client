import { StyleSheet, View } from "react-native"
import { Text } from "tamagui"
import dayjs from "dayjs"
import { Table, Row, Rows } from 'react-native-table-component';

export const Digital = ({ orderInfo }: { orderInfo: CommonFollowHall.GetTrackingOrderItemResult }) => {
    const playTableHead = ['场次', '对阵', '玩法', '投注内容'];
    const playTableData = [
        ['比赛', '投注', '投注时间', '投注金额'],
        ['比赛', '投注', '投注时间', '投注金额'],
    ];
    return <View>
        <View className='mt-2 flex-row justify-between items-center'>
            <View className='flex-1 flex-row gap-2'>
                <Text className='text-red-500' style={{ fontSize: 16, color: '#333', lineHeight: 24 }}>投注信息</Text>
                <Text className='text-white bg-[#01b0ff] rounded-md p-1'>{orderInfo?.betCount}场</Text>
                <Text className='text-white bg-[#169e16] rounded-md p-1'>{orderInfo?.bettingString ?? '单关'}</Text>
                <Text className='text-white bg-[#fe9f01] rounded-md p-1'>{orderInfo?.betMultiple}倍数</Text>
            </View>
            <View className='gap-2'>
                <Text className='text-red-500' style={{ fontSize: 16, color: '#333', lineHeight: 24, textAlign: 'right' }}>
                    截止时间
                </Text>
                <Text className='text-white border-[#91dcfd] border-2 bg-[#91dcfd] rounded-md p-1 text-[rgb(145, 220, 253)]'>{dayjs(orderInfo?.buyEndTime).format('MM-DD HH:mm')}</Text>
            </View>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                <Row data={playTableHead} style={styles.head} textStyle={styles.text} />
                <Rows data={playTableData} textStyle={styles.text} />
            </Table>
            <Text className='text-red-500 text-center'>预计最高回报：{orderInfo?.returnMultiple}倍</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    head: {
        backgroundColor: '#f0f0f0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 12,
    },
});