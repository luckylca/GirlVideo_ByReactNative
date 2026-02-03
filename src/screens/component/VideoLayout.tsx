import React from 'react';
import { ViewStyle, StyleSheet, View, Dimensions, Text, TextStyle } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Defs, Filter, FeDropShadow, Circle, Rect } from "react-native-svg";
import { scheduleOnRN } from 'react-native-worklets';
import HeartComponent from "./Heart";
import { useSettingStore } from '@/store/useSettingStore';
import { PauseOverlayIcon } from './OverLayIcon';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');
const NAV_BAR_HEIGHT = 80;
interface Styles {
    layout: ViewStyle;
    rateText: TextStyle;
}

const PauseView = () => {
    return (
        <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            pointerEvents: 'box-none',
        }}>
            <Svg width="96" height="96" viewBox="0 0 24 24" accessibilityLabel="Pause">
                <defs>
                    <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#000" flood-opacity="0.35" />
                    </filter>
                </defs>
                <circle cx="12" cy="12" r="10" fill="#000" opacity="0.40" filter="url(#ds)" />
                <rect x="8.2" y="7.3" width="2.8" height="9.4" rx="1.2" fill="#fff" />
                <rect x="13.0" y="7.3" width="2.8" height="9.4" rx="1.2" fill="#fff" />
            </Svg>

        </View>
    )
}

const RateView = ({ rate }: { rate: number }) => {
    return (
        <Text style={styles.rateText}>正在以{rate}倍速播放x</Text>
    )
}



const VideoLayout = React.memo(({ item, paused, repeat, onended }: { item: any, paused: boolean, repeat: boolean, onended?: () => void }) => {
    const videoRef = React.useRef<VideoRef>(null);
    const settingStore = useSettingStore();
    const [manualPaused, setManualPaused] = React.useState(false);
    const pausedState = paused || manualPaused;
    const [hearts, setHearts] = React.useState<{ id: number, x: number, y: number }[]>([]);
    const [rate, setRate] = React.useState(1.0);
    const generationHearts = (x: number, y: number) => {
        const newHeart = { id: Date.now()+Math.random(), x, y };
        setHearts((prevHearts) => [...prevHearts, newHeart]);
    }
    const handleHeartsAnimationEnd = (id: number) => {
        setHearts((prevHearts) => prevHearts.filter(h => h.id !== id));
    }
    const videoEnd = () => {
        videoRef.current?.seek(0);
        if (settingStore.autoPlay) {
            onended();
        }
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
            scheduleOnRN(generationHearts, x, y)
        });
    const longPress = Gesture.LongPress()
        .onStart(() => {
            scheduleOnRN(setRate, settingStore.fastForwardRate);
        })
        .onEnd(() => {
            scheduleOnRN(setRate, 1.0);
        });
    return (
        <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap, longPress)}>
            <View style={[styles.layout, { backgroundColor: '#1a1a1a' }]}>
                <Video
                    source={{ uri: item.uri }}
                    style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT - NAV_BAR_HEIGHT }}
                    resizeMode="contain"
                    paused={pausedState}
                    ref={videoRef}
                    repeat={repeat}
                    rate={rate}
                    playInBackground={false} // 切后台必须暂停
                    playWhenInactive={false}
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
                {pausedState && <PauseOverlayIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -48 }, { translateY: -48 }] }} />}
                {rate !== 1.0 && <RateView rate={rate} />}
            </View>
        </GestureDetector>
    );
});

const styles = StyleSheet.create<Styles>({
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rateText: {
        position: 'absolute',
        bottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        fontSize: 16,
        pointerEvents: 'none',
    },
});

export default VideoLayout;