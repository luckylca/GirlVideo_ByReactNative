import React = require("react");
import { ViewStyle, TextStyle, ImageStyle, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, Avatar, Card, Switch, Modal, Portal,TextInput,IconButton, HelperText  } from 'react-native-paper';

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

const SettingsScreen = ({ navigation }: any) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [isUserNameEmpty, setIsUserNameEmpty] = React.useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = React.useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={styles.modalContainer}
                >
                    <TouchableOpacity>
                        <IconButton size={40} icon="close-circle" iconColor="red" style={styles.closeButton}/>
                    </TouchableOpacity>
                    <Avatar.Icon size={100} icon="folder" style={styles.avatar}/>
                    <TextInput
                        label="账号"
                        mode="outlined"
                        style={styles.input}
                        placeholder="推荐使用QQ号注册"
                        onChangeText={setUserName}
                        />
                    <HelperText type="error" visible={isUserNameEmpty}>
                        用户名不能为空
                    </HelperText>
                    <TextInput
                        label="密码"
                        mode="outlined"
                        secureTextEntry
                        style={styles.passwordInput}/>
                    <HelperText type="error" visible={isPasswordEmpty}>
                        密码不能为空
                    </HelperText>
                    <Button style={styles.loginButton} onPress={hideModal} mode="elevated">
                        登录
                    </Button>
                    <Text style={styles.hintText}>若没有账号则会自动注册</Text>
                </Modal>
            </Portal>
            <TouchableOpacity style={styles.loginContainer} activeOpacity={0.8} onPress={showModal}>
                <Avatar.Icon size={100} icon="folder" style={styles.avatar}/>
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
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardContent}>数据源选择</Text>
                </Card.Content>
            </Card>
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardContent}>收藏列表</Text>
                </Card.Content>
            </Card>
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardContent}>下载列表</Text>
                </Card.Content>
            </Card>
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardContent}>导入视频</Text>
                </Card.Content>
            </Card>
            <Card mode="elevated" style={styles.card}>
                <Card.Content>
                    <Text style={styles.cardContent}>关于APP</Text>
                </Card.Content>
            </Card>
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
        marginBottom: 20,
        width: '90%',
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
        marginTop: 10,
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