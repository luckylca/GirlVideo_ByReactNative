/* eslint-disable react-native/no-inline-styles */
import React = require("react");
import { ViewStyle, TextStyle, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Avatar, Card, Switch, Modal ,Portal, TextInput, IconButton, HelperText, Dialog,RadioButton, TouchableRipple  } from 'react-native-paper';
import { useUserStore } from '../store/useUserStore';
import { useSettingStore } from '../store/useSettingStore';
import { DrawerLayout } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

interface SwipeableRef {
    close: () => void;
}

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

const RightAction = ({ progress: _progress, drag, onDelete }: { progress: SharedValue<number>, drag: SharedValue<number>, onDelete: () => void }) => {
    const styleAnimation = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: drag.value + 80 }],
        };
    });

    return (
        <Reanimated.View style={[styleAnimation, { width: 80, height: '100%', backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity onPress={onDelete}>
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white' }}>删除</Text>
                </View>
            </TouchableOpacity>
        </Reanimated.View>
    );
}

const UserScreen = ({ navigation }: any) => {
    const userStore = useUserStore();
    const settingStore = useSettingStore();

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn)
        settingStore.setAutoPlay(!isSwitchOn);
    };

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const [modalVisible, setModalVisible] = React.useState(false);
    const showModal = () => {
        setModalVisible(true);
        setUserName('');
        setPassword('');
    };
    const hideModal = () => {
        setModalVisible(false);
    };

    const [dialogVisible, setDialogVisible] = React.useState(false);
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [isUserNameEmpty, setIsUserNameEmpty] = React.useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = React.useState(false);

    const [isSecure, setIsSecure] = React.useState(true);

    const [isLoading, setIsLoading] = React.useState(false);

    const [videoChannels, setVideoChannels] = React.useState(userStore.chanelList || []);

    const swipeableRefs = React.useRef<Map<string, SwipeableRef>>(new Map());

    const [deleteItem, setDeleteItem] = React.useState<string | null>(null);

    const handleDeleteItem = (id: string) => {
        showDialog();
        setDeleteItem(id);
    };

    const confirmDeleteItem = () => {
        setVideoChannels(current => current.filter(item => item.id !== deleteItem));
        userStore.removeChanel?.(deleteItem!);
        hideDialog();
    }
    const login = () => {
        setIsLoading(true);
        if (userName.trim() === '') {
            setIsUserNameEmpty(true);
            setIsLoading(false);
            return;
        } else {
            setIsUserNameEmpty(false);
        }
        if (password.trim() === '') {
            setIsPasswordEmpty(true);
            setIsLoading(false);
            return;
        } else {
            setIsPasswordEmpty(false);
        }
        userStore.login(userName, password);
        hideModal();
        setIsLoading(false);
    }

    const drawerRef = React.useRef<DrawerLayout>(null);
    const openDrawer = () => {
        swipeableRefs.current.forEach(ref => ref.close());
        drawerRef.current?.openDrawer();
    };
    const closeDrawer = () => {
        drawerRef.current?.closeDrawer();
    };
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (isDrawerOpen) {
                    closeDrawer();
                    return true; // 拦截，不退出页面
                }
                return false; // 不拦截，执行正常返回
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [isDrawerOpen])
    );
    const renderDrawerContent = () => (
        //这个是抽屉组件的内容
        <>
            <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
                <Text style={{ fontSize: 20, marginBottom: 20 }}>数据源选择</Text>
                {videoChannels.map((item) => (
                    <ReanimatedSwipeable
                        key={item.id} // 🔥 必须有唯一的 key，就像 Vue 的 :key
                        friction={2}
                        ref={(ref) => {
                            if (ref) {
                                swipeableRefs.current.set(item.id, ref as SwipeableRef);
                            } else {
                                swipeableRefs.current.delete(item.id);
                            }
                        }}
                        rightThreshold={40}
                        renderRightActions={(progress, drag) => (
                            <RightAction
                                progress={progress}
                                drag={drag}
                                onDelete={() => handleDeleteItem(item.id)}
                            />
                        )}
                    >
                        {/* 列表项内容 */}
                        <View style={{
                            padding: 10,
                            borderBottomWidth: 1,
                            borderColor: '#eee',
                            backgroundColor: '#fff', // 必须有背景色，否则滑动的底层会透出来
                            flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'
                        }}>
                            <RadioButton value={item.id} status={settingStore.chanelId === String(item.id) ? 'checked' : 'unchecked'} onPress={() => settingStore.setChanelId(String(item.id))}/>
                            <TouchableOpacity style={{ marginLeft: 10,justifyContent: 'flex-start' }} onPress={() => { settingStore.setChanelId(String(item.id)) }}>
                                <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                <Text style={{ fontSize: 12, color: 'gray' }}>{item.status}</Text>
                            </TouchableOpacity>
                        </View>
                    </ReanimatedSwipeable>
                ))}
            </View>
        </>
    );
    return (
        <DrawerLayout
            ref={drawerRef}
            drawerWidth={200}
            drawerPosition="right"
            renderNavigationView={renderDrawerContent}
            onDrawerOpen={() => setIsDrawerOpen(true)}
            onDrawerClose={() => setIsDrawerOpen(false)}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                        <Dialog.Title>警告</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">确认删除{videoChannels.find(item => item.id === deleteItem)?.name}吗？</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => { hideDialog(); swipeableRefs.current.forEach(ref => ref.close()); }}>取消</Button>
                            <Button onPress={confirmDeleteItem}>确认</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Modal
                        visible={modalVisible}
                        onDismiss={hideModal}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <TouchableOpacity onPress={hideModal}>
                            <IconButton size={40} icon="close-circle" iconColor="red" style={styles.closeButton} />
                        </TouchableOpacity>
                        <Avatar.Icon size={100} icon="folder" style={styles.avatar} />
                        <TextInput
                            label="账号"
                            mode="outlined"
                            style={styles.input}
                            placeholder="推荐使用QQ号注册"
                            onChangeText={setUserName}
                            value={userName}
                        />
                        <HelperText type="error" visible={isUserNameEmpty}>
                            用户名不能为空
                        </HelperText>
                        <TextInput
                            label="密码"
                            mode="outlined"
                            placeholder="请输入密码"
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={isSecure}
                            right={<TextInput.Icon icon={isSecure ? "eye-off" : "eye"} onPress={() => setIsSecure(!isSecure)} />}
                            style={styles.passwordInput} />
                        <HelperText type="error" visible={isPasswordEmpty}>
                            密码不能为空
                        </HelperText>
                        <Button style={styles.loginButton} onPress={login} loading={isLoading} mode="elevated">
                            登录
                        </Button>
                        <Text style={styles.hintText}>若没有账号则会自动注册</Text>
                    </Modal>
                </Portal>
                <TouchableOpacity style={styles.loginContainer} activeOpacity={0.8} onPress={showModal}>
                    <Avatar.Icon size={100} icon="folder" style={styles.avatar} />
                    <Card mode="elevated" style={styles.loginCard}>
                        <View style={styles.centeredRow}>
                            <Text style={styles.cardContent}>请登录</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
                <Card mode="elevated" style={styles.card}>
                    <Card.Content style={styles.rowBetween}>
                        <Text style={styles.cardContent}>自动播放</Text>
                        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                    </Card.Content>
                </Card>
                <Button mode="elevated" onPress={openDrawer} style={{ width: '80%', marginBottom: 20 }}>
                    <Text style={{ textAlign: 'center', padding: 18, fontSize: 18 }}>数据源选择</Text>
                </Button>
                <Button mode="elevated" onPress={() => { navigation.navigate('Like'); }} style={{ width: '80%', marginBottom: 20 }}>
                    <Text style={{ textAlign: 'center', padding: 18, fontSize: 18 }}>收藏列表</Text>
                </Button>
                <Button mode="elevated" onPress={() => { navigation.navigate('Download'); }} style={{ width: '80%', marginBottom: 20 }}>
                    <Text style={{ textAlign: 'center', padding: 18, fontSize: 18 }}>下载列表</Text>
                </Button>
                <Button mode="elevated" onPress={() => { navigation.navigate('Settings'); }} style={{ width: '80%', marginBottom: 20 }}>
                    <Text style={{ textAlign: 'center', padding: 18, fontSize: 18 }}>设置</Text>
                </Button>
            </ScrollView>
        </DrawerLayout>
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
        marginBottom: 20,
        width: '80%',
        height: 75,
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
        margin: 8,
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
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: -190,
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

export default UserScreen;