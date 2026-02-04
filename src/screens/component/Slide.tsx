import React = require("react");
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
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
    StyleSheet,
    View,
    Dimensions,
} from 'react-native';
import VideoLayout from './VideoLayout';
import ImageLayout from './ImageLayout';
import { useIsFocused } from '@react-navigation/native';
interface Styles {
    container: ViewStyle;
    itemContainer: ViewStyle;
    // layout: ViewStyle;
}

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const VIRTUAL_NUM = 5;

const NAV_BAR_HEIGHT = 80;


const SlideItem = React.memo(({ index, translateY, item, dataType, ITEM_HEIGHT, videoConfig }: { index: number, translateY: any, item: any, dataType: string, ITEM_HEIGHT: number, videoConfig: any }) => {
    const isFocus = useIsFocused();
    const animatedStyle = useAnimatedStyle(() => {
        // 计算当前项相对于视口中心的偏移量
        const offset = (translateY.value as number) + index * ITEM_HEIGHT;

        // 自定义切换效果示例：缩放 + 透明度
        const scale = interpolate(
            offset,
            [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            offset,
            [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
            [0.5, 1, 0.5],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateY: offset },
                { scale: scale }
            ] as any,
            opacity: opacity,
        };
    });
    return (
        <Animated.View style={[styles.itemContainer, { height: ITEM_HEIGHT }, animatedStyle]}>
            {dataType === 'video' && <VideoLayout item={item} paused={videoConfig?.paused || !isFocus} repeat={videoConfig?.repeat} onended={videoConfig?.onended} />}
            {dataType === 'image' && <ImageLayout item={item} />}
        </Animated.View>
    );
})

const Slide = ({ data, dataType, onIndexChange }: { data: any[], dataType: string, onIndexChange?: (index: number) => void }) => {
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

    const panGesture = Gesture.Pan()
        .onStart(() => {
            contextY.value = translateY.value;
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

            translateY.value = withSpring(-clampedIndex * ITEM_HEIGHT, {
                damping: 100,
                stiffness: 800,
                mass: 1,
            });

            scheduleOnRN(setCurrentIndex, clampedIndex)
            if (onIndexChange) {
                scheduleOnRN(onIndexChange, clampedIndex);
            }
        });

    const goToNextVideo = () => {
        if (currentIndex < data.length - 1) {

            translateY.value = withSpring(-(currentIndex + 1) * ITEM_HEIGHT, {
                damping: 100,
                stiffness: 800,
                mass: 1,
            });
            setCurrentIndex(currentIndex + 1);
            if (onIndexChange) {
                onIndexChange(currentIndex + 1);
            }   
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
    // layout: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
});

export default Slide;

