/* eslint-disable react-native/no-inline-styles */
import React = require("react");
import { ViewStyle, TextStyle, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Avatar, Card, Switch, Modal, Portal, TextInput, IconButton, HelperText, Dialog, Snackbar } from 'react-native-paper';
import { useSettingStore } from '../store/useSettingStore';
import { useUserStore } from "@/store/useUserStore";
import Svg, { Path } from "react-native-svg";
import Header from "./component/Header";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
interface Styles {
    container: ViewStyle; // 容器样式
    card: ViewStyle; // 卡片容器样式
    cardContent: TextStyle; // 卡片样式
    avatar: ViewStyle; // 头像样式
    loginCard: ViewStyle;
    rowBetween: ViewStyle;
    centeredRow: ViewStyle;
    loginContainer: ViewStyle;
    modalContainer: ViewStyle;
    closeButton: ViewStyle;
    input: TextStyle;
    passwordInput: TextStyle;
    loginButton: ViewStyle;
    hintText: TextStyle;
}


const SettingsScreen = ({ navigation: _navigation }: any) => {
    const settingStore = useSettingStore();
    const userStore = useUserStore();

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [rateInput, setRateInput] = React.useState('');
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const hasError = () => {
        return isNaN(Number(rateInput)) || Number(rateInput) <= 0;
    }
    const confirmRate = () => {
        if (!hasError()) {
            setRateInput(rateInput);
            hideDialog();
            settingStore.setFastForwardRate(Number(rateInput));
            setSnackbarVisible(true);
        }
    }

    const hideDialog = () => setDialogVisible(false);
    const onToggleSwitch = () => {
        settingStore.setAutoPlay(!isSwitchOn);
        setIsSwitchOn(!isSwitchOn);
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>
            <Header navigation={_navigation} title="设置" />
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>倍速设置</Dialog.Title>
                    <Dialog.Content>
                        <TextInput mode="flat" value={rateInput} onChangeText={setRateInput} placeholder="请输入快进倍数"/>
                        <HelperText type="error" visible={hasError()}>请输入有效的数字</HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { hideDialog(); }}>取消</Button>
                        <Button onPress={confirmRate}>确认</Button>
                    </Dialog.Actions>
                </Dialog>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={2000}
                >
                    <Text style={{ color: '#fff' }}>已设置倍速为{settingStore.fastForwardRate}倍</Text>
                </Snackbar>
            </Portal>
            <Button
                mode="text"
                onPress={() => { }}
                style={{ width: '100%', marginTop: 20, borderRadius: 0, backgroundColor: 'transparent', elevation: 0, shadowColor: "transparent" }}
                contentStyle={{ height: 90, justifyContent: 'flex-start', alignContent: 'center' }}
                labelStyle={{ marginHorizontal: 0 }}
            >
                <View style={{ paddingLeft: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Svg width={39} height={39} viewBox="0 0 24 24">
                        <Path
                            d="M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M10 6A2 2 0 0 1 12 8A2 2 0 0 1 10 10A2 2 0 0 1 8 8A2 2 0 0 1 10 6M17 12C16.84 12 16.76 12.08 16.76 12.24L16.5 13.5C16.28 13.68 15.96 13.84 15.72 14L14.44 13.5C14.36 13.5 14.2 13.5 14.12 13.6L13.16 15.36C13.08 15.44 13.08 15.6 13.24 15.68L14.28 16.5V17.5L13.24 18.32C13.16 18.4 13.08 18.56 13.16 18.64L14.12 20.4C14.2 20.5 14.36 20.5 14.44 20.5L15.72 20C15.96 20.16 16.28 20.32 16.5 20.5L16.76 21.76C16.76 21.92 16.84 22 17 22H19C19.08 22 19.24 21.92 19.24 21.76L19.4 20.5C19.72 20.32 20.04 20.16 20.28 20L21.5 20.5C21.64 20.5 21.8 20.5 21.8 20.4L22.84 18.64C22.92 18.56 22.84 18.4 22.76 18.32L21.72 17.5V16.5L22.76 15.68C22.84 15.6 22.92 15.44 22.84 15.36L21.8 13.6C21.8 13.5 21.64 13.5 21.5 13.5L20.28 14C20.04 13.84 19.72 13.68 19.4 13.5L19.24 12.24C19.24 12.08 19.08 12 19 12H17M10 13C7.33 13 2 14.33 2 17V20H11.67C11.39 19.41 11.19 18.77 11.09 18.1H3.9V17C3.9 16.36 7.03 14.9 10 14.9C10.43 14.9 10.87 14.94 11.3 15C11.5 14.36 11.77 13.76 12.12 13.21C11.34 13.08 10.6 13 10 13M18.04 15.5C18.84 15.5 19.5 16.16 19.5 17.04C19.5 17.84 18.84 18.5 18.04 18.5C17.16 18.5 16.5 17.84 16.5 17.04C16.5 16.16 17.16 15.5 18.04 15.5Z"
                            fill="#222"
                        />
                    </Svg>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#222' }}>账号管理</Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>{userStore.isLoggedIn ? `已登录: ${userStore.username}` : '未登录'}</Text>
                </View>
            </Button>
            <Card mode="contained" style={styles.card}>
                <Card.Content style={styles.rowBetween}>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Svg width={39} height={39} viewBox="0 0 24 24">
                                <Path
                                    d="M13.54 22H10C9.75 22 9.54 21.82 9.5 21.58L9.13 18.93C8.5 18.68 7.96 18.34 7.44 17.94L4.95 18.95C4.73 19.03 4.46 18.95 4.34 18.73L2.34 15.27C2.21 15.05 2.27 14.78 2.46 14.63L4.57 12.97L4.5 12L4.57 11L2.46 9.37C2.27 9.22 2.21 8.95 2.34 8.73L4.34 5.27C4.46 5.05 4.73 4.96 4.95 5.05L7.44 6.05C7.96 5.66 8.5 5.32 9.13 5.07L9.5 2.42C9.54 2.18 9.75 2 10 2H14C14.25 2 14.46 2.18 14.5 2.42L14.87 5.07C15.5 5.32 16.04 5.66 16.56 6.05L19.05 5.05C19.27 4.96 19.54 5.05 19.66 5.27L21.66 8.73C21.79 8.95 21.73 9.22 21.54 9.37L19.43 11L19.5 12V12.19C19 12.07 18.5 12 18 12C17.83 12 17.66 12 17.5 12.03C17.5 11.41 17.4 10.79 17.2 10.2L19.31 8.65L18.56 7.35L16.15 8.39C15.38 7.5 14.32 6.86 13.12 6.62L12.75 4H11.25L10.88 6.61C9.68 6.86 8.62 7.5 7.85 8.39L5.44 7.35L4.69 8.65L6.8 10.2C6.4 11.37 6.4 12.64 6.8 13.8L4.68 15.36L5.43 16.66L7.86 15.62C8.63 16.5 9.68 17.14 10.87 17.38L11.24 20H12.35C12.61 20.75 13 21.42 13.54 22M15.96 12.36C16 12.24 16 12.12 16 12C16 9.79 14.21 8 12 8S8 9.79 8 12 9.79 16 12 16C12.12 16 12.24 16 12.36 15.96C12.97 14.29 14.29 12.97 15.96 12.36M12 14C10.9 14 10 13.11 10 12S10.9 10 12 10 14 10.9 14 12 13.11 14 12 14M16 15V21L21 18L16 15Z"
                                    fill="#222"
                                />
                            </Svg>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                            <Text style={styles.cardContent}>自动播放</Text>
                            <Text style={{ fontSize: 12, color: '#888' }}>离手刷小姐姐</Text>
                        </View>
                    </View>
                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                </Card.Content>
            </Card>
            <Button
                mode="elevated"
                onPress={() => { _navigation.navigate('AddVideo'); }}
                style={{ width: '100%', borderRadius: 0, backgroundColor: 'transparent', elevation: 0, shadowColor: "transparent" }}
                contentStyle={{ height: 90, justifyContent: 'flex-start', alignContent: 'center' }}
                labelStyle={{ marginHorizontal: 0 }}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 20 }}>
                    <Svg width={39} height={39} viewBox="0 0 24 24">
                        <Path
                            d="M13 19C13 19.34 13.04 19.67 13.09 20H4C2.9 20 2 19.11 2 18V6C2 4.89 2.9 4 4 4H5L7 8H10L8 4H10L12 8H15L13 4H15L17 8H20L18 4H22V13.81C21.39 13.46 20.72 13.22 20 13.09V10H5.76L4 6.47V18H13.09C13.04 18.33 13 18.66 13 19M20 18V15H18V18H15V20H18V23H20V20H23V18H20Z"
                            fill="#222"
                        />
                    </Svg>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#222' }}>导入视频</Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>让其他平台的小姐姐也住进来</Text>
                </View>
            </Button>
            <Button
                mode="elevated"
                onPress={() => { setDialogVisible(true);setRateInput(settingStore.fastForwardRate?.toString() || '2.0'); }}
                style={{ width: '100%', borderRadius: 0, backgroundColor: 'transparent', elevation: 0, shadowColor: "transparent" }}
                contentStyle={{ height: 90, justifyContent: 'flex-start' }}
                labelStyle={{ marginHorizontal: 0 }}
            >
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Svg width={39} height={39} viewBox="0 0 24 24">
                        <Path d="M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z" fill="#222" />
                    </Svg>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                    <Text style={{ fontSize: 18, color: '#222' }}>设置倍速</Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>快，更快一点</Text>
                </View>
            </Button>
            <Button
                mode="elevated"
                onPress={() => { }}
                style={{ width: '100%', borderRadius: 0, backgroundColor: 'transparent', elevation: 0, shadowColor: "transparent" }}
                contentStyle={{ height: 90, justifyContent: 'flex-start', alignContent: 'center' }}
                labelStyle={{ marginHorizontal: 0 }}
            >
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Svg width={39} height={39} viewBox="0 0 24 24">
                        <Path
                            d="M13 17.5C13 18.39 13.18 19.23 13.5 20H6.5C5 20 3.69 19.5 2.61 18.43C1.54 17.38 1 16.09 1 14.58C1 13.28 1.39 12.12 2.17 11.1S4 9.43 5.25 9.15C5.67 7.62 6.5 6.38 7.75 5.43S10.42 4 12 4C13.95 4 15.6 4.68 16.96 6.04C18.32 7.4 19 9.05 19 11C19.04 11 19.07 11 19.1 11C15.7 11.23 13 14.05 13 17.5M19 13.5V12L16.75 14.25L19 16.5V15C20.38 15 21.5 16.12 21.5 17.5C21.5 17.9 21.41 18.28 21.24 18.62L22.33 19.71C22.75 19.08 23 18.32 23 17.5C23 15.29 21.21 13.5 19 13.5M19 20C17.62 20 16.5 18.88 16.5 17.5C16.5 17.1 16.59 16.72 16.76 16.38L15.67 15.29C15.25 15.92 15 16.68 15 17.5C15 19.71 16.79 21.5 19 21.5V23L21.25 20.75L19 18.5V20Z"
                            fill="#222"
                        />
                    </Svg>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#222' }}>检查更新</Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>记得更新获取最优的体验哦</Text>
                </View>
            </Button>
            <Button
                mode="elevated"
                onPress={() => { }}
                style={{ width: '100%', borderRadius: 0, backgroundColor: 'transparent', elevation: 0, shadowColor: "transparent" }}
                contentStyle={{ height: 90, justifyContent: 'flex-start', alignContent: 'center' }}
                labelStyle={{ marginHorizontal: 0 }}
            >
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
                    <Svg width={39} height={39} viewBox="0 0 24 24">
                        <Path
                            d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19M8,19H16V12.2L10.46,9H8V19Z"
                            fill="#222"
                        />
                    </Svg>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#222' }}>清除缓存</Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>洗干净</Text>
                </View>
            </Button>
            <Button
                mode="elevated"
                onPress={() => { }}
                style={{ width: '100%', marginBottom: 20, borderRadius: 0, backgroundColor: 'transparent', elevation: 0, shadowColor: "transparent" }}
                contentStyle={{ height: 90, justifyContent: 'flex-start', alignContent: 'center' }}
                labelStyle={{ marginHorizontal: 0 }}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 20 }}>
                    <Svg width={39} height={39} viewBox="0 0 24 24">
                        <Path
                            d="M11 9H13V7H11V9M14 17V15H13V11H10V13H11V15H10V17H14M5 3H19C20.1 3 21 3.89 21 5V19C21 19.53 20.79 20.04 20.41 20.41C20.04 20.79 19.53 21 19 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 3.89 3.89 3 5 3M19 19V5H5V19H19Z"
                            fill="#222"
                        />
                    </Svg>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: '#222' }}>关于APP</Text>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#888' }}>获取信息</Text>
                </View>
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create<Styles>({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 30, // 底部留白
    },
    card: {
        backgroundColor: '#F5F5F5',
        // marginTop: 200,
        // marginBottom: 30,
        width: '100%',
        height: 90,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    loginCard: {
        marginBottom: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        alignItems: 'center',
        marginTop: 30,
        width: '30%',
    },
    cardContent: {
        // margin: 8,
        textAlign: 'center',
        fontSize: 18,
    },
    avatar: {
        marginTop: 30,
        marginBottom: 20,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: -10,
        left: 125,
    },
    input: {
        width: 200,
    },
    passwordInput: {
        marginTop: 0,
        width: 200,
    },
    loginButton: {
        margin: 10,
        width: 100,
    },
    hintText: {
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default SettingsScreen;