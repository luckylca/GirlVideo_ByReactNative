import React = require("react");
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Header from "./component/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText, TextInput, Portal, Dialog, ActivityIndicator, Modal, Snackbar, IconButton } from "react-native-paper";
import getOtherVideo from "../api/GetOtherVideo";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import VideoReanimatedModal from "./component/VideoReanimatedModal";


const AddVideoScreen = ({ navigation }: any) => {
    const [url, setUrl] = React.useState("https://www.douyin.com/user/MS4wLjABAAAAnCCjg32RdaNXS1twDgbCAEmGVwdQ_73NTL3hu5G-BQDnwoYjEGaMOiJu79JIyztR?from_tab_name=main");
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [getVideoList, setGetVideoList] = React.useState<string[]>([]);
    const [getCoverList, setGetCoverList] = React.useState<string[]>([]);
    const [videoUrl, setVideoUrl] = React.useState<string>("");
    const [originLayout, setOriginLayout] = React.useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
    const [videoVisible, setVideoVisible] = React.useState(false);
    const imageRefs = React.useRef<(View | null)[]>([]);
    const hideDialog = () => setDialogVisible(false);
    const confirmUrl = async () => {
        hideDialog();
        setIsLoading(true);
        const data = await getOtherVideo(url, page)
        if (data.code === 200) {
            setSnackbarVisible(true);
            setIsLoading(false);
        }
        let covers = data.data.covers.map((item: { value: string }) => item.value);
        setGetVideoList(prev => [...prev, ...data.data.video_url]);
        setGetCoverList(prev => [...prev, ...covers]);
    };
    const playVideo = (index: number) => {
        const targetRef = imageRefs.current[index];
        if (targetRef) {
            targetRef.measure((fx, fy, width, height, px, py) => {
                setOriginLayout({ x: px, y: py, width: width, height: height });
                setVideoUrl(getVideoList[index]);
                setVideoVisible(true);
            });
        }
    }
    return (
        <ScrollView>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>链接</Dialog.Title>
                    <Dialog.Content>
                        <TextInput mode="flat" value={url} onChangeText={setUrl} placeholder="请输入视频链接" contextMenuHidden={false} selectTextOnFocus={true} multiline={true} />
                        <HelperText type="info">支持抖音视频链接</HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { hideDialog(); }}>取消</Button>
                        <Button onPress={confirmUrl}>确认</Button>
                    </Dialog.Actions>
                </Dialog>
                <Modal visible={isLoading} dismissable={true} onDismiss={() => setIsLoading(false)}>
                    <ActivityIndicator animating={isLoading} size={100} style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -50, marginTop: -50 }} />
                </Modal>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                >
                    <Text style={{ color: '#FFFFFF' }}>视频导入成功,第{page}页</Text>
                </Snackbar>
                <VideoReanimatedModal origin={originLayout} visible={videoVisible} url={videoUrl} onClose={() => setVideoVisible(false)} />
                <IconButton
                    icon="check"
                    size={40}
                    iconColor="#1D4ED8"
                    rippleColor="rgba(29, 78, 216, 0.1)"
                    style={styles.confirmButton}
                />
            </Portal>
            <Header navigation={navigation} title="导入视频" />
            <Button onPress={() => setDialogVisible(true)} style={{ borderRadius: 10 }} mode="contained-tonal" contentStyle={{ paddingVertical: 10 }}>
                导入其他平台视频
            </Button>
            <View style={{ flexDirection: 'row', marginBottom: 200 }}>
                <View style={{ flex: 1 }}>
                    {getCoverList.filter((_, i) => i % 2 === 0).map((url, i) => {
                        const realIndex = i * 2;
                        return (
                            <TouchableOpacity
                                key={`left-${i}`}
                                style={{ marginTop: 10, overflow: 'hidden', aspectRatio: i === 0 ? 1.0 : 0.60, marginLeft: 10 }}
                                ref={(el) => { imageRefs.current[realIndex] = el; }}
                                onPress={() => playVideo(realIndex)}
                            >
                                <Image
                                    source={{ uri: url }}
                                    resizeMode="cover"
                                    style={styles.leftCover}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={{ flex: 1 }}>
                    {getCoverList.filter((_, i) => i % 2 !== 0).map((url, i) => {
                        const realIndex = i * 2 + 1;
                        return (
                            <TouchableOpacity
                                key={`right-${i}`}
                                style={{ marginTop: 10, overflow: 'hidden', aspectRatio: 0.65 }}
                                ref={(el) => { imageRefs.current[realIndex] = el; }}
                                onPress={() => playVideo(realIndex)}
                            >
                                <Image
                                    source={{ uri: url }}
                                    style={styles.rightCover}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    leftCover: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
    },
    rightCover: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
    },
    confirmButton: {
        position: 'absolute', bottom: 100, right: 30, width: 70,
        height: 70, // 固定高度
        borderRadius: 30, // 完美的圆形
        backgroundColor: 'rgba(219, 234, 254, 1)',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
});

export default AddVideoScreen;