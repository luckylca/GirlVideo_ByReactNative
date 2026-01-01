import React = require("react");
import { ViewStyle, TextStyle, ImageStyle, StyleSheet, View, ScrollView } from 'react-native';
import { Button, Text, Avatar, Card, Switch } from 'react-native-paper';

interface Styles {
    container: ViewStyle; // 容器样式
    card: ViewStyle; // 卡片容器样式
    cardContent: TextStyle; // 卡片样式
    avatar: ViewStyle; // 头像样式
    loginCard: ViewStyle;
    rowBetween: ViewStyle;
    centeredRow: ViewStyle;
}

const SettingsScreen = ({ navigation }: any) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Avatar.Icon size={100} icon="folder" style={styles.avatar} />
            <Card mode="elevated" style={styles.loginCard}>
                <View style={styles.centeredRow}>
                    <Text style={styles.cardContent}>请登录</Text>
                </View>
            </Card>
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
    cardContent: {
        margin: 8,
        textAlign: 'center',
        fontSize: 18,
    },
    avatar: {
        marginTop: 60,
        marginBottom: 10,
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
});
export default SettingsScreen;