import React = require("react");
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Header from "./component/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText, TextInput, Portal, Dialog, ActivityIndicator, Modal, Snackbar, IconButton } from "react-native-paper";
import getOtherVideo from "../api/douyin/GetOtherVideo";
import VideoReanimatedModal from "./component/VideoReanimatedModal";
import { createDouyinResolver } from "@/api/douyin/resolveDouyinUrl";
import WebView from 'react-native-webview';


const AddVideoScreen = ({ navigation }: any) => {
    const [url, setUrl] = React.useState("8- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/p9nMtw_UHzU/ 5@5.com :2pm");
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [getVideoList, setGetVideoList] = React.useState<string[]>([]);
    const [getCoverList, setGetCoverList] = React.useState<string[]>([]);
    const [videoUrl, setVideoUrl] = React.useState<string>("");
    const [rightUrl, setRightUrl] = React.useState<string>("");
    const [originLayout, setOriginLayout] = React.useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
    const [videoVisible, setVideoVisible] = React.useState(false);
    const imageRefs = React.useRef<(View | null)[]>([]);

    // WebView解析相关state
    const [webViewUrl, setWebViewUrl] = React.useState<string>("");
    const resolverRef = React.useRef<any>(null);
    const resolveCallbackRef = React.useRef<((url: string) => void) | null>(null);
    const rejectCallbackRef = React.useRef<((error: Error) => void) | null>(null);

    const hideDialog = () => setDialogVisible(false);

    // 使用WebView解析短链接
    const resolveWithWebView = (rawText: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const resolver = createDouyinResolver(rawText);

                // 如果不需要WebView，直接返回
                if (!resolver.needsWebView && resolver.userUrl) {
                    resolve(resolver.userUrl);
                    return;
                }

                // 需要WebView解析
                resolverRef.current = resolver;
                resolveCallbackRef.current = resolve;
                rejectCallbackRef.current = reject;
                setWebViewUrl(resolver.shortUrl!);
            } catch (error: any) {
                reject(error);
            }
        });
    };

    // WebView导航状态变化处理
    const handleWebViewNavigationStateChange = (navState: any) => {
        if (!resolverRef.current || !resolveCallbackRef.current) return;

        const userUrl = resolverRef.current.extractUserIdFromUrl(navState.url);

        if (userUrl) {
            // 找到用户ID，返回结果
            resolveCallbackRef.current(userUrl);
            // 清理state
            setWebViewUrl("");
            resolverRef.current = null;
            resolveCallbackRef.current = null;
            rejectCallbackRef.current = null;
        }
    };
    const confirmUrl = async () => {
        hideDialog();
        setIsLoading(true);
        try {
            // 使用WebView解析短链接
            const tmpUrl = await resolveWithWebView(url);
            setRightUrl(tmpUrl);
            const data = await getOtherVideo(tmpUrl, page);
            if (data.code === 200) {
                setSnackbarVisible(true);
                setIsLoading(false);
            }
            let covers = data.data.covers.map((item: { value: string }) => item.value);
            setGetVideoList(prev => [...prev, ...data.data.video_url]);
            setGetCoverList(prev => [...prev, ...covers]);
        } catch (error: any) {
            setIsLoading(false);
            alert(`解析失败: ${error.message}`);
        }
    };

    const refreshData = async () => {
        setIsLoading(true);
        const nextPage = page + 1;
        const data = await getOtherVideo(rightUrl, nextPage);
        if (data.code === 200) {
            setSnackbarVisible(true);
            setIsLoading(false);
        }
        let covers = data.data.covers.map((item: { value: string }) => item.value);
        setGetVideoList(prev => [...prev, ...data.data.video_url]);
        setGetCoverList(prev => [...prev, ...covers]);
        setPage(nextPage);
    }

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

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
        if (isBottom && !isLoading) {
            refreshData();
        }
    }

    return (
        <ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={8}
            >
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>链接</Dialog.Title>
                    <Dialog.Content>
                        <TextInput mode="flat" value={url} onChangeText={setUrl} placeholder="请输入主页链接" contextMenuHidden={false} selectTextOnFocus={true} multiline={false} />
                        <HelperText type="info">支持抖音主页链接</HelperText>
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
                {/* 隐藏的WebView用于捕获302重定向 */}
                {webViewUrl ? (
                    <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
                        <WebView
                            source={{ uri: webViewUrl }}
                            onNavigationStateChange={handleWebViewNavigationStateChange}
                            onError={() => {
                                if (rejectCallbackRef.current) {
                                    rejectCallbackRef.current(new Error('WebView加载失败,请重试'));
                                    setWebViewUrl("");
                                }
                            }}
                        />
                    </View>
                ) : null}
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