import React = require("react");
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
    ViewStyle,
    TextStyle,
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Image,
    ImageStyle
} from 'react-native';
import Video from 'react-native-video';
import HeartComponent from "./Heart";
import { useNavigation } from "@react-navigation/native";

interface Styles {
    container: ViewStyle;
    itemContainer: ViewStyle;
    layout: ViewStyle;
}

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const VIRTUAL_NUM = 5;

const NAV_BAR_HEIGHT = 80;

const VideoLayout = React.memo(({ item, paused, repeat, onended }: { item: any, paused: boolean, repeat: boolean, onended?: () => void }) => {
    const videoRef = React.useRef<Video>(null);
    const [manualPaused, setManualPaused] = React.useState(false);
    const pausedState = paused || manualPaused;
    const [hearts,setHearts] = React.useState([]);
    const generationHearts = (x:number,y:number) => {
        const newHeart = { id: Date.now(), x, y };
        setHearts((prevHearts) => [...prevHearts, newHeart]);
    }
    const handleHeartsAnimationEnd = (id:number) => {
        setHearts((prevHearts) => prevHearts.filter(h => h.id !== id));
    }
    const videoEnd = () => {
        videoRef.current?.seek(0);
        onended();
    }
    const singleTap = Gesture.Tap()
        .numberOfTaps(1)
        .onEnd(() => {
            scheduleOnRN(setManualPaused, !manualPaused);
        });
    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd((event) => {
            const { x, y } = event;
            scheduleOnRN(generationHearts,x,y)
        });
    return (
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
            <View style={[styles.layout, { backgroundColor: '#1a1a1a' }]}>
                <Video
                    source={{ uri: item.uri }}
                    style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT - NAV_BAR_HEIGHT }}
                    resizeMode="contain"
                    paused={pausedState}
                    ref = {videoRef}
                    repeat={repeat}
                    playInBackground={false} // 切后台必须暂停
                    playWhenInactive={false}
                    // viewType={'textureView'}
                    // onLoad={(data) => {
                    // }}
                    onEnd={() => {
                        if (!repeat && onended) {
                            videoEnd();
                        }
                    }}
                />
                {hearts.map((heart) => (
                    <HeartComponent
                        key={heart.id}
                        startX={heart.x}
                        startY={heart.y}
                        onAnimationEnd={() => {
                            handleHeartsAnimationEnd(heart.id);
                        }}
                    />
                ))}
            </View>
        </GestureDetector>
    );
});

const ImageLayout = React.memo(({ item }: { item: any }) => {
    return (
        <View style={[styles.layout, { backgroundColor: '#333' }]}>
            {/* 这里写图片的界面 */}
            <Image source={{ uri: item.uri }} style={{ width: WINDOW_WIDTH, height: '100%' }} resizeMode="contain" />
        </View>
    );
});

const SlideItem = React.memo(({ index, translateY, item, dataType, ITEM_HEIGHT, videoConfig }: { index: number, translateY: any, item: any, dataType: string, ITEM_HEIGHT: number, videoConfig: any }) => {
    // const insets = useSafeAreaInsets();
    // const ITEM_HEIGHT = WINDOW_HEIGHT - NAV_BAR_HEIGHT - insets.bottom;
    const animatedStyle = useAnimatedStyle(() => {
        // 计算当前项相对于视口中心的偏移量
        const offset = (translateY.value as number) + index * ITEM_HEIGHT;

        // 自定义切换效果示例：缩放 + 透明度
        // const scale = interpolate(
        //     offset,
        //     [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
        //     [0.8, 1, 0.8],
        //     Extrapolation.CLAMP
        // );

        // const opacity = interpolate(
        //     offset,
        //     [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
        //     [0.5, 1, 0.5],
        //     Extrapolation.CLAMP
        // );

        return {
            transform: [
                { translateY: offset },
                // { scale: scale }
            ] as any,
            // opacity: opacity,
        };
    });
    return (
        <Animated.View style={[styles.itemContainer, { height: ITEM_HEIGHT }, animatedStyle]}>
            {dataType === 'video' && <VideoLayout item={item} paused={videoConfig?.paused} repeat={videoConfig?.repeat} onended={videoConfig?.onended} />}
            {dataType === 'image' && <ImageLayout item={item} />}
        </Animated.View>
    );
})

const Slide = ({ data, dataType }: { data: any[], dataType: string }) => {
    const navigation = useNavigation<any>();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const translateY = useSharedValue(0);
    const contextY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const contextX = useSharedValue(0);

    const insets = useSafeAreaInsets();
    const ITEM_HEIGHT = WINDOW_HEIGHT - NAV_BAR_HEIGHT - insets.bottom;

    const visibleIndices = React.useMemo(() => {
        const half = Math.floor(VIRTUAL_NUM / 2);
        let start = Math.max(0, currentIndex - half);
        let end = Math.min(data.length - 1, currentIndex + half);

        if (end - start + 1 < VIRTUAL_NUM) {
            if (start === 0) end = Math.min(data.length - 1, start + VIRTUAL_NUM - 1);
            else if (end === data.length - 1) start = Math.max(0, end - VIRTUAL_NUM + 1);
        }

        const indices = [];
        for (let i = start; i <= end; i++) {
            indices.push(i);
        }
        return indices;
    }, [currentIndex, data.length]);

    // const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    //     const y = event.nativeEvent.contentOffset.y;
    //     const index = Math.round(y / ITEM_HEIGHT);
    //     if (index !== currentIndex && index >= 0 && index < data.length) {
    //         setCurrentIndex(index);
    //     }
    // };


    const panGesture = Gesture.Pan()
        .onStart(() => {
            // 记录起始位置
            contextY.value = translateY.value;
            contextX.value = translateX.value;
        })
        .onUpdate((event) => {
            translateY.value = contextY.value + event.translationY;
            translateX.value = contextX.value + event.translationX;
        })
        .onEnd((event) => {
            // 计算手势结束后的目标索引
            const scrollDistance = event.translationY + event.velocityY * 0.2; // 加入动能因子
            const nextIndex = Math.round(-(contextY.value + scrollDistance) / ITEM_HEIGHT);//计算目标index
            const clampedIndex = Math.max(0, Math.min(data.length - 1, nextIndex));//做限定幅度

            // const SWIPE_THRESHOLD = 80;
            // if (translateX.value < -SWIPE_THRESHOLD || event.velocityX < -500) {
            //     scheduleOnRN(navigation.navigate, 'Settings');
            //     // 跳转后重置 X 轴，防止回来时位置不对
            //     translateX.value = withSpring(0);
            //     // translateY.value = withSpring(0);
            //     return; // 触发左滑就不再处理上下滑逻辑
            // }
            // 弹性对齐动画
            translateY.value = withSpring(-clampedIndex * ITEM_HEIGHT, {
                damping: 100,
                stiffness: 800,
                mass: 1,
            });

            scheduleOnRN(setCurrentIndex, clampedIndex)
        });

    // const containerAnimatedStyle = useAnimatedStyle(() => {
    //     // 增加一个阻尼感，让左右滑动稍微沉重一点，或者直接 1:1 跟随
    //     const transX = translateX.value;
    //     // 联动效果：左滑时稍微缩小一点点，增加空间感
    //     const scale = interpolate(
    //         Math.abs(transX),
    //         [0, WINDOW_WIDTH],
    //         [1, 0.95],
    //         Extrapolation.CLAMP
    //     );

    // return {
    //     transform: [
    //         { translateX: transX },
    //         { scale: scale }
    //     ],
    // };
    // });

    const goToNextVideo = () => {
        if (currentIndex < data.length - 1) {

            translateY.value = withSpring(-(currentIndex + 1) * ITEM_HEIGHT, {
                damping: 100,
                stiffness: 800,
                mass: 1,
            });
            setCurrentIndex(currentIndex + 1);
        }
    }

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.container, { height: ITEM_HEIGHT }]}>
                    {visibleIndices.map(index => (
                        <SlideItem
                            key={data[index]?.id || index}
                            index={index}
                            translateY={translateY}
                            item={data[index]}
                            dataType={data[index]?.type || dataType}
                            ITEM_HEIGHT={ITEM_HEIGHT}
                            videoConfig={{ paused: currentIndex !== index, repeat: false, onended: goToNextVideo, }}
                        />
                    ))}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create<Styles>({
    container: {
        width: WINDOW_WIDTH,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    itemContainer: {
        position: 'absolute',
        width: WINDOW_WIDTH,
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Slide;