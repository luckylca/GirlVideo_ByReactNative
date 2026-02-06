import React = require("react");
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Header from "./component/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText, TextInput, Portal, Dialog, ActivityIndicator, Modal, Snackbar, IconButton } from "react-native-paper";
import getOtherVideo from "../api/douyin/GetOtherVideo";
import VideoReanimatedModal from "./component/VideoReanimatedModal";
import { createDouyinResolver } from "@/api/douyin/resolveDouyinUrl";
import WebView from 'react-native-webview';
import { FlashList } from "@shopify/flash-list";
import { useUserStore } from "@/store/useUserStore";
import { useVideoStore } from "@/store/useVideoStore";

const AddVideoScreen = ({ navigation }: any) => {
    const [url, setUrl] = React.useState("8- 长按复制此条消息，打开抖音搜索，查看TA的更多作品。 https://v.douyin.com/p9nMtw_UHzU/ 5@5.com :2pm");
    const [linkDialogVisible, setLinkDialogVisible] = React.useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = React.useState(false);
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
    const foundUserUrlRef = React.useRef<string | null>(null); // 保存找到的用户URL
    const webViewRef = React.useRef<any>(null); // WebView引用

    const [channelName, setChannelName] = React.useState("");
    const userStore = useUserStore();
    const videoStore = useVideoStore();
    const hideDialog = () => setLinkDialogVisible(false);

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

                // 需要WebView解析，直接加载短链接
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
        if (!resolverRef.current) return;

        const userUrl = resolverRef.current.extractUserIdFromUrl(navState.url);

        if (userUrl && !foundUserUrlRef.current) {
            // 找到用户ID，保存但不立即返回，继续加载页面
            console.log('找到用户URL:', userUrl);
            foundUserUrlRef.current = userUrl;
            // 不清理WebView，让它继续加载完整页面
        }
    };

    // WebView页面加载完成处理
    const handleWebViewLoadEnd = () => {
        if (!foundUserUrlRef.current || !webViewRef.current) return;

        console.log('用户页面加载完成，尝试提取用户名称');

        // 注入JavaScript来获取页面HTML
        const jsCode = `
            (function() {
                try {
                    const html = document.documentElement.outerHTML;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'html',
                        content: html
                    }));
                } catch (e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'error',
                        message: e.message
                    }));
                }
            })();
            true;
        `;

        webViewRef.current.injectJavaScript(jsCode);
    };

    // WebView消息处理
    const handleWebViewMessage = (event: any) => {
        if (!resolverRef.current || !resolveCallbackRef.current || !foundUserUrlRef.current) return;

        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'html') {
                console.log('收到HTML内容，长度:', data.content.length);

                // 使用resolver提取用户名称
                let userName = resolverRef.current.extractUserNameFromHtml(data.content);

                if (userName) {
                    console.log('提取到用户名称:', userName);
                    const match = userName.match(/(.+?)(?:的)?主页/);
                    setChannelName(match[1]);
                }

                // 返回结果
                resolveCallbackRef.current(foundUserUrlRef.current);

                // 清理state和ref
                setWebViewUrl("");
                resolverRef.current = null;
                resolveCallbackRef.current = null;
                rejectCallbackRef.current = null;
                foundUserUrlRef.current = null;
            } else if (data.type === 'error') {
                console.error('WebView错误:', data.message);
                // 即使出错，也返回用户URL
                resolveCallbackRef.current(foundUserUrlRef.current);

                // 清理state和ref
                setWebViewUrl("");
                resolverRef.current = null;
                resolveCallbackRef.current = null;
                rejectCallbackRef.current = null;
                foundUserUrlRef.current = null;
            }
        } catch (error) {
            console.error('解析WebView消息失败:', error);
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

    const renderItem = ({ item, index }: { item: string; index: number }) => {
        return (
            <TouchableOpacity
                style={{ marginTop: 10, overflow: 'hidden', aspectRatio: index === 0 ? 1.0 : 0.60 }}
                ref={(el) => { imageRefs.current[index] = el; }}
                onPress={() => playVideo(index)}
            >
                <Image
                    source={{ uri: item }}
                    resizeMode="cover"
                    style={index % 2 === 0 ? styles.leftCover : styles.rightCover}
                />
            </TouchableOpacity>
        );
    }

    const confirmImport = () => {
        userStore.addChanel({
            id: userStore.chanelList.length.toString(),
            name: channelName,
            url: rightUrl,
            type: 'video',
            status: '在线'
        })
        videoStore.setChannelVideoList?.(userStore.chanelList.length.toString(), getVideoList.map((videoUrl, index) => ({
            id: `${Date.now()}_${index}`,
            uri: videoUrl,
            type: 'video',
            description: `${channelName}的第${index + 1}个视频`,
            cover: getCoverList[index]
        })));
        setConfirmDialogVisible(false);
        navigation.goBack();
    }

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} title="导入视频" />
            <Button onPress={() => setLinkDialogVisible(true)} style={{ borderRadius: 10 }} mode="contained-tonal" contentStyle={{ paddingVertical: 10 }}>
                导入其他平台视频
            </Button>
            <FlashList
                data={getCoverList}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                renderItem={renderItem}
                onEndReached={refreshData}
                onEndReachedThreshold={0.3}
                masonry
                style={{ paddingLeft: 6 }}
            />
            <Portal>
                <Dialog visible={linkDialogVisible} onDismiss={hideDialog}>
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
                <Dialog visible={confirmDialogVisible} onDismiss={() => setConfirmDialogVisible(false)}>
                    <Dialog.Title>导入确认</Dialog.Title>
                    <Dialog.Content>
                        <Text>确认导入到{channelName}频道</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { setConfirmDialogVisible(false); }}>取消</Button>
                        <Button onPress={confirmImport}>确认</Button>
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
                    onPress={() => {
                        setConfirmDialogVisible(true);
                    }}
                />
                {/* 隐藏的WebView用于捕获302重定向 */}
                {webViewUrl ? (
                    <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
                        <WebView
                            ref={webViewRef}
                            source={{
                                uri: webViewUrl,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Referer': 'https://www.douyin.com/',
                                }
                            }}
                            userAgent="Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                            onNavigationStateChange={handleWebViewNavigationStateChange}
                            onLoadEnd={handleWebViewLoadEnd}
                            onMessage={handleWebViewMessage}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            sharedCookiesEnabled={true}
                            thirdPartyCookiesEnabled={true}
                            onError={() => {
                                if (rejectCallbackRef.current) {
                                    rejectCallbackRef.current(new Error('WebView加载失败,请重试'));
                                    setWebViewUrl("");
                                    foundUserUrlRef.current = null;
                                }
                            }}
                        />
                    </View>
                ) : null}
            </Portal>
        </View>
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