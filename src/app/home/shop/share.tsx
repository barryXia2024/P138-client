import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Clipboard,

} from "react-native";
import * as MediaLibrary from "expo-media-library";
import QRCode from "react-native-qrcode-svg";
import { useUserStore } from "src/store/user";
import ViewShot from "react-native-view-shot";
import { router } from "expo-router";
import { captureRef } from "react-native-view-shot";
import { env } from "@/config/env";
import commonStyles from "@/p138-react-common/utils/styles";
import { IMAGE_SIZE } from "@/p138-react-common/utils/styles/theme";


const QRCodeSharePage = () => {
    const { loginInfo } = useUserStore();
    const userID = loginInfo?.userID;
    const [referralUrl, setReferralUrl] = useState<string>();
    const [showLeft, setShowLeft] = useState<boolean>(true);
    const viewShotRef = useRef<ViewShot>(null);


    // 返回按钮
    const defaultBackPress = () => {
        router.back();
    };

    // 初始化，生成二维码 URL
    useEffect(() => {
        if (userID) {
            setReferralUrl(
                `${env.H5_Client_URL}/register?${loginInfo.referralUrl}&userType=1`
            );
            // 请求存储权限
            //   requestStoragePermission().then(granted => {
            //     console.log(granted);
            //     if (!granted) {
            //       ToastAndroid.show('存储权限被拒绝，无法保存截图', ToastAndroid.LONG);
            //     }
            //   });
        }
    }, [
        loginInfo?.referralUrl,
        loginInfo?.shopCode,
        loginInfo?.username,
        userID,
    ]);

    // 截图并保存
    const takeScreenshotAndSave = async () => {
        setShowLeft(false); // 隐藏不需要截图的部分
        try {
            // 确保视图已经渲染并且 ref 指向有效的组件
            if (viewShotRef.current) {
                // 使用 react-native-view-shot 截取页面
                const uri = await captureRef(viewShotRef, {
                    height: 440,
                    quality: 1,
                });
                console.log("Screenshot captured at:", uri);

                await MediaLibrary.saveToLibraryAsync(uri);
                if (uri) {
                    Toast.show("图片保存成功！");
                } else {
                    Toast.show("图片保存失败！");
                }
            } else {
                Toast.show("viewShotRef 未设置");
            }
            setShowLeft(true); // 恢复隐藏部分
        } catch (error) {
            Toast.show("截图保存失败:" + error);
            setShowLeft(true); // 恢复隐藏部分
        }
    };

    // 复制链接到剪贴板
    const copyToClipboard = () => {
        if (referralUrl) {
            Clipboard.setString(referralUrl);
            //   ToastAndroid.show('链接已复制到剪贴板', ToastAndroid.SHORT);
            Toast.show("链接已复制到剪贴板");
        } else {
            //   ToastAndroid.show('未生成链接', ToastAndroid.SHORT);
            Toast.show("未生成链接");
        }
    };

    return (
        <ViewShot
            style={commonStyles.flex_1}
            ref={viewShotRef}
            options={{ format: "png", quality: 0.9 }}
        >
            <ImageBackground
                source={require("src/assets/imgs/home/bg_share_hemai.webp")}
                className="flex-1 items-center resize-cover"
                resizeMode="stretch"
            >
                {showLeft && (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={defaultBackPress}
                        className="absolute left-4 top-4 w-5 h-2.5"
                    >
                        <Image
                            style={IMAGE_SIZE.IMAGE_SIZE20}
                            source={require("src/assets/imgs/home/icon_back_arrow.png")}
                        />
                    </TouchableOpacity>
                )}
                <Image
                    source={require("src/assets/imgs/mine/user_desc.png")}
                    style={styles.topTitleImage}
                />

                {/* 图片上叠加二维码 */}
                <ImageBackground
                    style={styles.codeCardBackground}
                    source={require("src/assets/imgs/mine/user_code.png")}
                >
                    <Text   style={styles.cardTitle}>安全可靠 扫码下载</Text>
                    <View style={styles.QRCodeSize}>
                        {referralUrl && (
                            <QRCode
                                value={referralUrl}
                                size={130}
                                color="black"
                                backgroundColor="white"
                                logoSize={0}
                                logoBackgroundColor="transparent"
                            />
                        )}
                    </View>

                    <View style={styles.buttonContainer} >
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={1}
                            onPress={takeScreenshotAndSave}
                        >
                            <Text style={styles.buttonText}>保存图片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.button}
                            onPress={copyToClipboard}
                        >
                            <Text style={styles.buttonText}>复制链接</Text>
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={require("src/assets/imgs/mine/share1.png")}
                        style={styles.footer}
                    />
                </ImageBackground>
            </ImageBackground>
        </ViewShot>
    );
};

const styles = StyleSheet.create({

    topTitleImage: {
        marginTop: 50,
        width: "100%",
        height: 26,
        resizeMode: "contain",
    },
    codeCardBackground: {
        padding: 20,
        width: 230,
        height: 230 * 1.51,
        resizeMode: "stretch",
        alignItems: "center",
        marginTop: 50,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#ff3366",
        marginVertical: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 35,
    },
    button: {
        backgroundColor: "#ff3366",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    footer: {
        width: 250,
        height: 100,
        resizeMode: "stretch",
    },
    QRCodeSize: {
        width: 130,
        height: 130,
    },
});

export default QRCodeSharePage;
